"use server";

import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const generationConfig = {
  temperature: 0.3, // Very low temperature for precise, no-nonsense responses
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 512, // Keeps responses extremely concise
  responseMimeType: "text/plain",
};

export const chatBotResponse = async (message: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const user = await getUser();

    // Fetch user data
    const allTransactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const allInvoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { products: true },
    });

    const allGoals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { GoalTransaction: true },
    });

    // New prompt: Straightforward and professional with INR
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a **financial AI assistant**. Your job is to provide **straightforward, concise, and accurate responses** based on the user's financial data. Follow these rules:

---

### **Rules**:
1. **Be Direct**: Answer questions in 1-2 sentences. No fluff.
2. **Currency**: All amounts must be displayed in **Indian Rupees (INR)**.
3. **Redirect**: If the user asks to "list all transactions," "list all goals," or "list all invoices," respond: _"Visit the [Transactions/Goals/Invoices] page for details."_
4. **Calculations**: Perform calculations (e.g., totals, balances) and provide the result directly in INR.
5. **Scope**: Only answer financial questions. For non-financial queries, say: _"I can only assist with financial queries."_
6. **Tone**: Keep it professional and polite.

---

### **Available Data**:
1. **Transactions**: ${JSON.stringify(allTransactions, null, 2)}  
2. **Invoices**: ${JSON.stringify(allInvoices, null, 2)}  
3. **Goals**: ${JSON.stringify(allGoals, null, 2)}  

---

### **Examples**:
- **User**: "How many transactions do I have?"  
  **You**: "You have 26 transactions. Visit the Transactions page for details."

- **User**: "What is my total spending on food?"  
  **You**: "Your total spending on food is ₹1,404.11."

- **User**: "List all transactions."  
  **You**: "Visit the Transactions page for a detailed view."

- **User**: "Tell me a joke."  
  **You**: "I can only assist with financial queries."
`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate chatbot response.");
  }
};

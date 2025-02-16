"use server";

import { getUser } from "@/utils/getUser";
import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { TransactionValues } from "@/lib/validations";
import TransactionMailer from "../../../../emails/TransactionsMailer";
import { authClient } from "@/lib/auth-client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const addTransactionHandler = async (credentials: TransactionValues) => {
  return await prisma.$transaction(async () => {
    const { amount, note, type, category, TransactionDate } = credentials;

    const user = await getUser();

    // update user wallet
    let walletMoney = user.wallet;

    if (type === "expense") {
      walletMoney -= amount;
    } else {
      walletMoney += amount;
    }

    if (walletMoney < 0) {
      throw new Error("Insufficient funds in wallet.");
    }

    const newUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        wallet: walletMoney,
      },
    });

    // Create new Transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        note,
        type,
        category,
        TransactionDate,
      },
      select: {
        amount: true,
        type: true,
        category: true,
        note: true,
        TransactionDate: true,
      },
    });

    return { newTransaction, newUser };
  });
};

export const deleteTransactionAction = async (transactionId: string) => {
  try {
    await prisma.transaction.delete({
      where: { id: transactionId },
    });
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw new Error("Something went wrong while deleting the transaction.");
  }
};

export const updateTransactionAction = async (
  transactionData: TransactionType,
  transactionId: string,
) => {
  const { amount, note, type, category, TransactionDate } = transactionData;

  if (!amount || !type || !category || !TransactionDate) {
    throw new Error("All required fields must be provided.");
  }

  try {
    const user = await getUser();

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existingTransaction) {
      throw new Error("Transaction not found.");
    }

    if (existingTransaction.userId !== user.id) {
      throw new Error("Unauthorized access to this transaction.");
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount,
        note,
        type,
        category,
        TransactionDate,
      },
    });
  } catch (error) {
    console.error(
      "Failed to update transaction:",
      error instanceof Error ? error.message : error,
    );
    throw new Error("Something went wrong while updating the transaction.");
  }
};

export const sendTransaction = async (
  name: string,
  email: string,
  base64Pdf: string,
) => {
  try {
    const pdfBuffer = Buffer.from(base64Pdf, "base64");

    await TransactionMailer({ name, email, pdf: pdfBuffer });
  } catch (error) {
    console.error(
      "Failed to update transaction:",
      error instanceof Error ? error.message : error,
    );
    throw new Error("Something went wrong while updating the transaction.");
  }
};

export const scanReceipt = async (file: File) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const arrayBuffer = await file.arrayBuffer();

    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Extract and return transaction details from this receipt image in the following JSON format:
{
  "amount": number,
  "note": "string",
  "type": "expense" | "income",
  "category": "string",
  "TransactionDate": "ISO date string"
}
      
Data Extraction Rules:

- amount → Extract the total amount as a number. If the currency is in USD ($), convert it to INR using an exchange rate of **₹83 per USD**. Ensure the final value is in INR.
- note → Provide a short description of the purchase. If no description is found, return "Scanned Transaction".
- type → Always "expense" unless the receipt explicitly mentions income (e.g., salary, refund).
- category → Suggest a category from this list:
  "food", "electronics", "travel", "shopping", "entertainment", "utilities", "groceries", "healthcare", "education", "insurance", "bills", "gifts", "other".
  Default to "other" if no clear category is found.
- TransactionDate → Extract the date from the receipt and return it in ISO format (YYYY-MM-DD).
  If no date is found, return today’s date.

Important:
- If the image is not a receipt, return {}.
- Ensure all numeric values are in **Indian Rupees (INR)**.
- **Only respond with valid JSON in the required format.**`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;

    const text = response.text();

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);

      return data;
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      throw new Error("Failed to parse JSON response.");
    }
  } catch (error) {
    console.error("Failed to scan receipt:", error);
    throw new Error("Failed to scan the receipt.");
  }
};

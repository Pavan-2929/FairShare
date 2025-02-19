# 💰 Personal Finance Tracker & Admin Panel  

A powerful **personal finance management** web application built with **Next.js 15, TypeScript, PostgreSQL, and Prisma**. It includes **AI-powered transaction autofill, goal tracking, authentication, invoicing, and an admin panel** for tracking expenses and income.

---

## 🚀 Features  

### 🔐 Authentication  
- Supports **OTP, Magic Link, Google, and GitHub authentication** using **BetterAuth**.
- Secure and seamless login experience.

### 📊 Transactions Management  
- Add transactions **with category, type, date, and amount** effortlessly.  
- Built using **React Query**, optimizing database queries for better performance.  
- Supports **update and delete transactions** with instant UI updates using caching.  
- **Filters** to quickly find specific transactions.  

### 🖼 AI-Powered Transaction Autofill  
- Users can **upload transaction images** and have details filled automatically using AI.

### 💵 Personal Wallet System  
- Tracks **income and expenses** based on transaction history.  
- Helps users **manage their finances efficiently**.

### 🎯 Goal Tracking System  
- Users can **create financial goals** with:  
  - **Priority, status, dates, and images**  
  - Optimized updates using **React Query** for real-time changes  
  - **Progress bar** and **options to delete/terminate** goals  
- **Wallet-Based Goal Completion**  
  - Users can contribute to goals via **mini transactions**, ensuring they don't exceed their wallet balance.

### 📜 Admin Panel  
- Complete **admin dashboard** to monitor:  
  - **Transactions, income, expenses, and categories**  

### 📝 User Profile  
- Users can **update their personal information**, reflecting changes across the platform in real-time.

### 📄 PDF Export & Email Functionality  
- Users can **download or email transaction data as a PDF** using **jsPDF**.

### 🧾 Invoice Management  
- Users can create invoices with:  
  - **Issue & due dates**  
  - **Client details, product information, and payment info**  
  - Options to **download or send via email** as a **PDF**  

### 🤖 AI Chatbot Integration  
- Users can interact with an **AI chatbot** to:  
  - **Track goals & transactions**  
  - **Receive financial suggestions**  

### ✅ Form Validation & Type Safety  
- **All forms are validated** with **Zod**.  
- Fully **type-safe** implementation using **TypeScript**.

### 🌙 Responsive & Theming  
- **Fully responsive** design with:  
  - **Dark & light mode**  
  - **Consistent UI across all pages**  

---

## 🛠 Tech Stack  

- **Frontend:** Next.js 15, TypeScript  
- **Database:** PostgreSQL, Prisma  
- **State Management & API Handling:** React Query  
- **Authentication:** BetterAuth  
- **Email Services:** Nodemailer  
- **File Storage:** Cloudinary  
- **PDF Generation:** jsPDF  

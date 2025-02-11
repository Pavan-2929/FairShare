// const user: {
//     id: string;
//     email: string;
//     emailVerified: boolean;
//     name: string;
//     createdAt: Date;
//     updatedAt: Date;
//     image?: string | null;
//     phoneNumber?: string | null;
//     age?: number | null;
//     gender?: "male" | "female" | "other" | null;
//     city?

export type UserType = {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  phoneNumber?: string | null;
  age?: number | null;
  gender?: "male" | "female" | "other" | null;
  city?: string | null;
};

export type TransactionType = {
  type: "expense" | "income";
  id: string;
  updatedAt: Date;
  userId: string;
  amount: number;
  category: string;
  note: string | null;
  TransactionDate: Date;
};

export type InvoiceType = {
  id: string;
  draftName: string;
  userId: string;
  totalAmount: number;
  issueDate: Date;
  dueDate: Date;
  clientName: string;
  clientEmail: string;
  clientNumber: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  paymentMethod: "cash" | "creditCard" | "bankTransfer" | "upi" | "other";
  notes: string;
  products: ProductType[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductType = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  invoiceId: string;
};

export type GoalType = {
  id: string;
  userId: string;
  title: string;
  note: string | null;
  targetAmount: number;
  currentAmount: number;
  completionDate: Date;
  status: "active" | "completed" | "cancelled";
  category: string;
  priority: "low" | "medium" | "high";
  image: string;
  reminder: "daily" | "every_3_days" | "weekly" | "biweekly" | "monthly";
  createdAt: Date;
  updatedAt: Date;
};

export type GoalTransactionType = {
  id: string;
  goalId: string;
  amount: number;
  createdAt: Date;
};

import { TransactionValues } from "./validations";

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

export type TransactionsData = {
  transactions: TransactionValues[];
  totalTransactions: number;
};
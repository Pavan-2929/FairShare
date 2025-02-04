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

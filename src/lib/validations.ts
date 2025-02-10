import Category from "@/app/(main)/dashboard/Category";
import { z } from "zod";

const requiredString = z.string().trim().min(1, "required");

export const signinSchema = z.object({
  email: z.string().trim().min(1, "required").email("Invalid email address"),
});

export type SignInValues = z.infer<typeof signinSchema>;

export const transactionSchema = z.object({
  amount: z.coerce.number().min(1, "required"),
  type: z.enum(["income", "expense"]),
  category: requiredString,
  note: z.string().optional(),
  TransactionDate: z.date(),
});

export type TransactionValues = z.infer<typeof transactionSchema>;

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must not exceed 20 characters.")
    .regex(
      /^(?!.*[_.]{2})[a-zA-Z][a-zA-Z0-9._\s]{2,19}$/,
      "Invalid username. Start with a letter and use only letters, numbers, underscores, dots, or spaces without consecutive dots, underscores, or spaces.",
    ),

  phoneNumber: z
    .string()
    .min(10, "It should have 10 digits")
    .max(10, "It should have 10 digits")
    .optional(),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;

export const userOtherDetailsSchema = z.object({
  age: z.coerce.number().min(1, "required"),
  gender: z.enum(["male", "female", "other"]),
  city: z.string().min(2, "City must be at least 2 characters"),
});

export type UserOtherDetailsValues = z.infer<typeof userOtherDetailsSchema>;

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0.01, "Unit price must be greater than 0"),
  totalPrice: z.number().min(0, "Total price must be at least 0"),
});

export const invoiceSchema = z.object({
  draftName: z.string().min(1, "required"),
  totalAmount: z.coerce.number().min(1, "Total amount is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email"),
  clientNumber: z
    .string()
    .min(10, "It should have 10 digits")
    .max(10, "It should have 10 digits"),
  status: z.enum(["pending", "paid", "overdue", "cancelled"]),
  paymentMethod: z.enum(["cash", "creditCard", "bankTransfer", "upi", "other"]),
  products: z.array(productSchema).min(1, "At least one product is required"),
  notes: requiredString,
});

export type InvoiceValues = z.infer<typeof invoiceSchema>;

export const goalSchema = z.object({
  title: requiredString,
  note: z.string().trim().optional(),
  image: z.string().trim().optional(),
  targetAmount: z
    .number()
    .min(1, "Min value should be 1")
    .max(500000, "Max value should be 1000"),
  completionDate: z.date().optional(),
  category: requiredString,
  priority: z.enum(["low", "medium", "high"]),
  reminder: z.enum(["daily", "every_3_days", "weekly", "biweekly", "monthly"]),
});

export type GoalValues = z.infer<typeof goalSchema>;

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

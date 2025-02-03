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
      "Invalid username. Start with a letter and use only letters, numbers, underscores, dots, or spaces without consecutive dots, underscores, or spaces."
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

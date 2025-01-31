import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().trim().min(1, "required").email("Invalid email address"),
});

export type SignInValues = z.infer<typeof signinSchema>;


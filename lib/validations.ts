import { z } from "zod"

export const SignupSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(50, { message: "First name must be less than 50 characters" })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email address" }).trim().toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" })
    .trim(),
})

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }).trim().toLowerCase(),
  password: z.string().min(1, { message: "Password is required" }),
})

export const ProfileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" })
    .max(50, { message: "First name must be less than 50 characters" })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .trim(),
})

export type SignupInput = z.infer<typeof SignupSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>


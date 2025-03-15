//@ts-nocheck
"use server"

import { SignupSchema, LoginSchema } from "@/lib/validations"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export type FormState = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
    email?: string[]
    password?: string[]
  }
  message?: string
  success?: boolean
}

export async function signup(prevState: FormState, formData: FormData): Promise<FormState> {
  // Validate form fields
  const validatedFields = SignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data. Please check the fields above.",
    }
  }

  const { firstName, lastName, email, password } = validatedFields.data

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      message: "A user with this email already exists.",
    }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create the user
  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    })


  } catch (error) {
    console.error("Error creating user:", error)
    return {
      message: "An error occurred while creating your account. Please try again.",
    }
  }
  // Redirect to login page
  redirect("/login?registered=true")
}

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  // Validate form fields
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data. Please check the fields above.",
    }
  }

  const { email, password } = validatedFields.data

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        message: "Invalid email or password.",
      }
    }

    // Verify password
    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (!passwordsMatch) {
      return {
        message: "Invalid email or password.",
      }
    }


  } catch (error) {
    console.error("Login error:", error)
    return {
      message: "An error occurred while signing in. Please try again.",
    }
  }

  return {
    success: true,
  }
}


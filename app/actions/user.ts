//@ts-nocheck
"use server"

import { ProfileUpdateSchema } from "@/lib/validations"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export type ProfileFormState = {
  errors?: {
    firstName?: string[]
    lastName?: string[]
  }
  message?: string
  success?: boolean
}

export async function updateProfile(prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  // Get the current user session
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return {
      message: "You must be signed in to update your profile.",
      success: false,
    }
  }

  // Validate form fields
  const validatedFields = ProfileUpdateSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  })

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data. Please check the fields above.",
      success: false,
    }
  }

  const { firstName, lastName } = validatedFields.data

  try {
    // Update the user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
      },
    })

    // Revalidate the account page
    revalidatePath("/account")

    return {
      message: "Profile updated successfully.",
      success: true,
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return {
      message: "An error occurred while updating your profile. Please try again.",
      success: false,
    }
  }
}


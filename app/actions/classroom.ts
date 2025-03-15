"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

// Validation schema for classroom creation/update
const ClassroomSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(100),
  description: z.string().optional(),
  subject: z.string().min(1, { message: "Subject is required" }),
  gradeLevel: z.string().min(1, { message: "Grade level is required" }),
})

export type ClassroomFormState = {
  errors?: {
    name?: string[]
    description?: string[]
    subject?: string[]
    gradeLevel?: string[]
  }
  message?: string
  success?: boolean
}

export async function createClassroom(prevState: ClassroomFormState, formData: FormData): Promise<ClassroomFormState> {
  // Get the current user session
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return {
      message: "You must be signed in to create a classroom.",
      success: false,
    }
  }

  // Validate form fields
  const validatedFields = ClassroomSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    subject: formData.get("subject"),
    gradeLevel: formData.get("grade"),
  })

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data. Please check the fields above.",
      success: false,
    }
  }

  const { name, description, subject, gradeLevel } = validatedFields.data

  try {
    // Generate a unique join code
    const joinCode = generateJoinCode()

    // Create the classroom
    const classroom = await prisma.classroom.create({
      data: {
        name,
        description,
        subject,
        gradeLevel,
        joinCode,
        owner: {
          connect: { id: session.user.id },
        },
      },
    })

    // Revalidate the classrooms page
    revalidatePath("/classrooms")

    // Redirect to the new classroom
    redirect(`/classrooms/${classroom.id}`)
  } catch (error) {
    console.error("Error creating classroom:", error)
    return {
      message: "An error occurred while creating the classroom. Please try again.",
      success: false,
    }
  }
}

export async function updateClassroom(
    classroomId: string,
    prevState: ClassroomFormState,
    formData: FormData,
): Promise<ClassroomFormState> {
  // Get the current user session
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return {
      message: "You must be signed in to update a classroom.",
      success: false,
    }
  }

  // Validate form fields
  const validatedFields = ClassroomSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    subject: formData.get("subject"),
    gradeLevel: formData.get("grade-level"),
  })

  // If form validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid form data. Please check the fields above.",
      success: false,
    }
  }

  const { name, description, subject, gradeLevel } = validatedFields.data

  try {
    // Check if the user is the owner of the classroom
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      select: { ownerId: true },
    })

    if (!classroom || classroom.ownerId !== session.user.id) {
      return {
        message: "You don't have permission to update this classroom.",
        success: false,
      }
    }

    // Update the classroom
    await prisma.classroom.update({
      where: { id: classroomId },
      data: {
        name,
        description,
        subject,
        gradeLevel,
      },
    })

    // Revalidate the classroom page
    revalidatePath(`/classrooms/${classroomId}`)

    return {
      message: "Classroom updated successfully.",
      success: true,
    }
  } catch (error) {
    console.error("Error updating classroom:", error)
    return {
      message: "An error occurred while updating the classroom. Please try again.",
      success: false,
    }
  }
}

export async function deleteClassroom(classroomId: string): Promise<{ success: boolean; message: string }> {
  // Get the current user session
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return {
      message: "You must be signed in to delete a classroom.",
      success: false,
    }
  }

  try {
    // Check if the user is the owner of the classroom
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      select: { ownerId: true },
    })

    if (!classroom || classroom.ownerId !== session.user.id) {
      return {
        message: "You don't have permission to delete this classroom.",
        success: false,
      }
    }

    // Delete the classroom
    await prisma.classroom.delete({
      where: { id: classroomId },
    })

    // Revalidate the classrooms page
    revalidatePath("/classrooms")

    return {
      message: "Classroom deleted successfully.",
      success: true,
    }
  } catch (error) {
    console.error("Error deleting classroom:", error)
    return {
      message: "An error occurred while deleting the classroom. Please try again.",
      success: false,
    }
  }
}

export async function joinClassroom(joinCode: string): Promise<{ success: boolean; message: string }> {
  // Get the current user session
  const session = await getServerSession(authOptions)

  if (!session || !session.user.id) {
    return {
      message: "You must be signed in to join a classroom.",
      success: false,
    }
  }

  try {
    // Find the classroom by join code
    const classroom = await prisma.classroom.findUnique({
      where: { joinCode },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    })

    if (!classroom) {
      return {
        message: "Invalid join code. Please check and try again.",
        success: false,
      }
    }

    // Check if the user is already a member of the classroom
    if (classroom.members.length > 0) {
      return {
        message: "You are already a member of this classroom.",
        success: false,
      }
    }

    // Add the user to the classroom
    await prisma.classroomMember.create({
      data: {
        classroom: {
          connect: { id: classroom.id },
        },
        user: {
          connect: { id: session.user.id },
        },
        role: "student",
      },
    })

    // Revalidate the classrooms page
    revalidatePath("/classrooms")

    return {
      message: "Successfully joined the classroom.",
      success: true,
    }
  } catch (error) {
    console.error("Error joining classroom:", error)
    return {
      message: "An error occurred while joining the classroom. Please try again.",
      success: false,
    }
  }
}

// Helper function to generate a random join code
function generateJoinCode(length = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}


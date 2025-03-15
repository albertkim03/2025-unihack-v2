"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schema for test creation/update
const TestSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(100),
    description: z.string().optional(),
    subject: z.string().min(1, { message: "Subject is required" }),
    timeLimit: z.coerce.number().min(1, { message: "Time limit must be at least 1 minute" }),
    dueDate: z.string().optional(),
    classroomId: z.string().optional(),
})

// Validation schema for question creation/update
const QuestionSchema = z.object({
    text: z.string().min(1, { message: "Question text is required" }),
    type: z.enum(["multiple-choice", "true-false", "short-answer"]),
    options: z.array(z.string()).optional(),
    answer: z.string().min(1, { message: "Answer is required" }),
    points: z.coerce.number().min(1, { message: "Points must be at least 1" }),
})

export type TestFormState = {
    errors?: {
        name?: string[]
        description?: string[]
        subject?: string[]
        timeLimit?: string[]
        dueDate?: string[]
        classroomId?: string[]
    }
    message?: string
    success?: boolean
    testId?: string
}

export type QuestionFormState = {
    errors?: {
        text?: string[]
        type?: string[]
        options?: string[]
        answer?: string[]
        points?: string[]
    }
    message?: string
    success?: boolean
}

export async function createTest(prevState: TestFormState, formData: FormData): Promise<TestFormState> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to create a test.",
            success: false,
        }
    }

    // Validate form fields
    const validatedFields = TestSchema.safeParse({
        name: formData.get("test-name"),
        description: formData.get("description"),
        subject: formData.get("subject"),
        timeLimit: formData.get("timeLimit"),
        dueDate: formData.get("dueDate"),
        classroomId: formData.get("classroom"),
    })

    // If form validation fails, return errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid form data. Please check the fields above.",
            success: false,
        }
    }

    const { name, description, subject, timeLimit, dueDate, classroomId } = validatedFields.data

    try {
        // Create the test
        const test = await prisma.test.create({
            data: {
                name,
                description,
                subject,
                timeLimit,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status: "draft",
                creator: {
                    connect: { id: session.user.id },
                },
                classroom: classroomId
                    ? {
                        connect: { id: classroomId },
                    }
                    : undefined,
            },
        })

        // Revalidate the tests page
        revalidatePath("/myspace")
        if (classroomId) {
            revalidatePath(`/classrooms/${classroomId}`)
        }

        return {
            message: "Test created successfully.",
            success: true,
            testId: test.id,
        }
    } catch (error) {
        console.error("Error creating test:", error)
        return {
            message: "An error occurred while creating the test. Please try again.",
            success: false,
        }
    }
}

export async function updateTest(testId: string, prevState: TestFormState, formData: FormData): Promise<TestFormState> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to update a test.",
            success: false,
        }
    }

    // Validate form fields
    const validatedFields = TestSchema.safeParse({
        name: formData.get("test-name"),
        description: formData.get("description"),
        subject: formData.get("subject"),
        timeLimit: formData.get("timeLimit"),
        dueDate: formData.get("dueDate"),
        classroomId: formData.get("classroom"),
    })

    // If form validation fails, return errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid form data. Please check the fields above.",
            success: false,
        }
    }

    const { name, description, subject, timeLimit, dueDate, classroomId } = validatedFields.data

    try {
        // Check if the user is the creator of the test
        const test = await prisma.test.findUnique({
            where: { id: testId },
            select: { creatorId: true, classroomId: true },
        })

        if (!test || test.creatorId !== session.user.id) {
            return {
                message: "You don't have permission to update this test.",
                success: false,
            }
        }

        // Update the test
        await prisma.test.update({
            where: { id: testId },
            data: {
                name,
                description,
                subject,
                timeLimit,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                classroom: classroomId
                    ? {
                        connect: { id: classroomId },
                    }
                    : test.classroomId
                        ? { disconnect: true }
                        : undefined,
            },
        })

        // Revalidate the test page
        revalidatePath(`/edit-test/${testId}`)
        revalidatePath("/myspace")
        if (classroomId) {
            revalidatePath(`/classrooms/${classroomId}`)
        }
        if (test.classroomId && test.classroomId !== classroomId) {
            revalidatePath(`/classrooms/${test.classroomId}`)
        }

        return {
            message: "Test updated successfully.",
            success: true,
        }
    } catch (error) {
        console.error("Error updating test:", error)
        return {
            message: "An error occurred while updating the test. Please try again.",
            success: false,
        }
    }
}

export async function deleteTest(testId: string): Promise<{ success: boolean; message: string }> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to delete a test.",
            success: false,
        }
    }

    try {
        // Check if the user is the creator of the test
        const test = await prisma.test.findUnique({
            where: { id: testId },
            select: { creatorId: true, classroomId: true },
        })

        if (!test || test.creatorId !== session.user.id) {
            return {
                message: "You don't have permission to delete this test.",
                success: false,
            }
        }

        // Delete the test
        await prisma.test.delete({
            where: { id: testId },
        })

        // Revalidate the tests page
        revalidatePath("/myspace")
        if (test.classroomId) {
            revalidatePath(`/classrooms/${test.classroomId}`)
        }

        return {
            message: "Test deleted successfully.",
            success: true,
        }
    } catch (error) {
        console.error("Error deleting test:", error)
        return {
            message: "An error occurred while deleting the test. Please try again.",
            success: false,
        }
    }
}

export async function addQuestion(
    testId: string,
    prevState: QuestionFormState,
    formData: FormData,
): Promise<QuestionFormState> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to add a question.",
            success: false,
        }
    }

    const type = formData.get("type") as string
    let options: string[] | undefined

    if (type === "multiple-choice") {
        // Extract options from form data
        const optionsData: string[] = []
        for (let i = 0; i < 10; i++) {
            const option = formData.get(`option-${i}`)
            if (option && typeof option === "string" && option.trim()) {
                optionsData.push(option.trim())
            }
        }
        options = optionsData.length > 0 ? optionsData : undefined
    }

    // Validate form fields
    const validatedFields = QuestionSchema.safeParse({
        text: formData.get("text"),
        type,
        options,
        answer: formData.get("answer"),
        points: formData.get("points"),
    })

    // If form validation fails, return errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid form data. Please check the fields above.",
            success: false,
        }
    }

    const { text, answer, points } = validatedFields.data

    try {
        // Check if the user is the creator of the test
        const test = await prisma.test.findUnique({
            where: { id: testId },
            select: { creatorId: true },
        })

        if (!test || test.creatorId !== session.user.id) {
            return {
                message: "You don't have permission to add questions to this test.",
                success: false,
            }
        }

        // Add the question
        await prisma.question.create({
            data: {
                text,
                type,
                options: options ? JSON.stringify(options) : null,
                answer,
                points,
                test: {
                    connect: { id: testId },
                },
            },
        })

        // Revalidate the test page
        revalidatePath(`/edit-test/${testId}`)

        return {
            message: "Question added successfully.",
            success: true,
        }
    } catch (error) {
        console.error("Error adding question:", error)
        return {
            message: "An error occurred while adding the question. Please try again.",
            success: false,
        }
    }
}

export async function updateQuestion(
    questionId: string,
    prevState: QuestionFormState,
    formData: FormData,
): Promise<QuestionFormState> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to update a question.",
            success: false,
        }
    }

    const type = formData.get("type") as string
    let options: string[] | undefined

    if (type === "multiple-choice") {
        // Extract options from form data
        const optionsData: string[] = []
        for (let i = 0; i < 10; i++) {
            const option = formData.get(`option-${i}`)
            if (option && typeof option === "string" && option.trim()) {
                optionsData.push(option.trim())
            }
        }
        options = optionsData.length > 0 ? optionsData : undefined
    }

    // Validate form fields
    const validatedFields = QuestionSchema.safeParse({
        text: formData.get("text"),
        type,
        options,
        answer: formData.get("answer"),
        points: formData.get("points"),
    })

    // If form validation fails, return errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid form data. Please check the fields above.",
            success: false,
        }
    }

    const { text, answer, points } = validatedFields.data

    try {
        // Get the question with test info
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: {
                test: {
                    select: {
                        id: true,
                        creatorId: true,
                    },
                },
            },
        })

        if (!question || question.test.creatorId !== session.user.id) {
            return {
                message: "You don't have permission to update this question.",
                success: false,
            }
        }

        // Update the question
        await prisma.question.update({
            where: { id: questionId },
            data: {
                text,
                type,
                options: options ? JSON.stringify(options) : null,
                answer,
                points,
            },
        })

        // Revalidate the test page
        revalidatePath(`/edit-test/${question.test.id}`)

        return {
            message: "Question updated successfully.",
            success: true,
        }
    } catch (error) {
        console.error("Error updating question:", error)
        return {
            message: "An error occurred while updating the question. Please try again.",
            success: false,
        }
    }
}

export async function deleteQuestion(questionId: string): Promise<{ success: boolean; message: string }> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to delete a question.",
            success: false,
        }
    }

    try {
        // Get the question with test info
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            include: {
                test: {
                    select: {
                        id: true,
                        creatorId: true,
                    },
                },
            },
        })

        if (!question || question.test.creatorId !== session.user.id) {
            return {
                message: "You don't have permission to delete this question.",
                success: false,
            }
        }

        // Delete the question
        await prisma.question.delete({
            where: { id: questionId },
        })

        // Revalidate the test page
        revalidatePath(`/edit-test/${question.test.id}`)

        return {
            message: "Question deleted successfully.",
            success: true,
        }
    } catch (error) {
        console.error("Error deleting question:", error)
        return {
            message: "An error occurred while deleting the question. Please try again.",
            success: false,
        }
    }
}

export async function publishTest(testId: string): Promise<{ success: boolean; message: string }> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to publish a test.",
            success: false,
        }
    }

    try {
        // Check if the user is the creator of the test
        const test = await prisma.test.findUnique({
            where: { id: testId },
            select: {
                creatorId: true,
                classroomId: true,
                questions: {
                    select: { id: true },
                },
            },
        })

        if (!test || test.creatorId !== session.user.id) {
            return {
                message: "You don't have permission to publish this test.",
                success: false,
            }
        }

        // Check if the test has questions
        if (test.questions.length === 0) {
            return {
                message: "Cannot publish a test with no questions. Please add at least one question.",
                success: false,
            }
        }

        // Update the test status to active
        await prisma.test.update({
            where: { id: testId },
            data: {
                status: "active",
            },
        })

        // Revalidate the test page
        revalidatePath(`/edit-test/${testId}`)
        revalidatePath("/myspace")
        if (test.classroomId) {
            revalidatePath(`/classrooms/${test.classroomId}`)
        }

        return {
            message: "Test published successfully.",
            success: true,
        }
    } catch (error) {
        console.error("Error publishing test:", error)
        return {
            message: "An error occurred while publishing the test. Please try again.",
            success: false,
        }
    }
}


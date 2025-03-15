"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schema for test submission
const TestSubmissionSchema = z.object({
    testId: z.string(),
    answers: z.array(
        z.object({
            questionId: z.string(),
            answer: z.string(),
        }),
    ),
    timeSpent: z.number().min(0),
})

export type TestSubmissionFormState = {
    errors?: {
        testId?: string[]
        answers?: string[]
        timeSpent?: string[]
    }
    message?: string
    success?: boolean
    resultId?: string
}

export async function submitTest(
    prevState: TestSubmissionFormState,
    formData: FormData,
): Promise<TestSubmissionFormState> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to submit a test.",
            success: false,
        }
    }

    // Parse the form data
    const testId = formData.get("testId") as string
    const timeSpent = Number.parseInt(formData.get("timeSpent") as string, 10)

    // Parse answers from form data
    const answersData: { questionId: string; answer: string }[] = []
    for (const [key, value] of formData.entries()) {
        if (key.startsWith("answer-") && typeof value === "string") {
            const questionId = key.replace("answer-", "")
            answersData.push({ questionId, answer: value })
        }
    }

    // Validate form fields
    const validatedFields = TestSubmissionSchema.safeParse({
        testId,
        answers: answersData,
        timeSpent,
    })

    // If form validation fails, return errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Invalid form data. Please check your answers.",
            success: false,
        }
    }

    const { answers } = validatedFields.data

    try {
        // Get the test with questions
        const test = await prisma.test.findUnique({
            where: { id: testId },
            include: {
                questions: true,
            },
        })

        if (!test) {
            return {
                message: "Test not found.",
                success: false,
            }
        }

        // Check if the user has already submitted this test
        const existingResult = await prisma.testResult.findUnique({
            where: {
                testId_userId: {
                    testId,
                    userId: session.user.id,
                },
            },
        })

        if (existingResult) {
            return {
                message: "You have already submitted this test.",
                success: false,
            }
        }

        // Calculate the score
        let totalScore = 0
        let totalPossibleScore = 0

        const answerRecords = []

        for (const question of test.questions) {
            totalPossibleScore += question.points

            const userAnswer = answers.find((a) => a.questionId === question.id)

            if (!userAnswer) continue

            const isCorrect = userAnswer.answer.trim().toLowerCase() === question.answer.trim().toLowerCase()
            const score = isCorrect ? question.points : 0
            totalScore += score

            answerRecords.push({
                text: userAnswer.answer,
                isCorrect,
                score,
                questionId: question.id,
            })
        }

        const percentageScore = (totalScore / totalPossibleScore) * 100

        // Create the test result
        const testResult = await prisma.$transaction(async (prisma) => {
            // Create the test result
            const result = await prisma.testResult.create({
                data: {
                    score: percentageScore,
                    completedAt: new Date(),
                    timeSpent,
                    test: {
                        connect: { id: testId },
                    },
                    user: {
                        connect: { id: session.user.id },
                    },
                },
            })

            // Create the answer records
            for (const answer of answerRecords) {
                await prisma.answer.create({
                    data: {
                        ...answer,
                        testResult: {
                            connect: { id: result.id },
                        },
                    },
                })
            }

            return result
        })

        // Revalidate the test results page
        revalidatePath(`/test-results/${testId}`)
        revalidatePath(`/myspace`)

        return {
            message: "Test submitted successfully.",
            success: true,
            resultId: testResult.id,
        }
    } catch (error) {
        console.error("Error submitting test:", error)
        return {
            message: "An error occurred while submitting the test. Please try again.",
            success: false,
        }
    }
}

export async function updateTestResult(
    resultId: string,
    updates: { [questionId: string]: number },
): Promise<{ success: boolean; message: string }> {
    // Get the current user session
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
        return {
            message: "You must be signed in to update test results.",
            success: false,
        }
    }

    try {
        // Get the test result with test info
        const testResult = await prisma.testResult.findUnique({
            where: { id: resultId },
            include: {
                test: {
                    select: {
                        id: true,
                        creatorId: true,
                    },
                },
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        })

        if (!testResult) {
            return {
                message: "Test result not found.",
                success: false,
            }
        }

        // Check if the user is the creator of the test
        if (testResult.test.creatorId !== session.user.id) {
            return {
                message: "You don't have permission to update this test result.",
                success: false,
            }
        }

        // Update the answers and calculate the new total score
        let totalScore = 0
        let totalPossibleScore = 0

        await prisma.$transaction(async (prisma) => {
            for (const answer of testResult.answers) {
                totalPossibleScore += answer.question.points

                if (updates[answer.questionId] !== undefined) {
                    // Update the answer score
                    await prisma.answer.update({
                        where: { id: answer.id },
                        data: {
                            score: updates[answer.questionId],
                        },
                    })

                    totalScore += updates[answer.questionId]
                } else {
                    totalScore += answer.score
                }
            }

            // Update the test result score
            const percentageScore = (totalScore / totalPossibleScore) * 100
            await prisma.testResult.update({
                where: { id: resultId },
                data: {
                    score: percentageScore,
                },
            })
        })

        // Revalidate the test results page
        revalidatePath(`/test-results/${testResult.test.id}`)
        revalidatePath(`/student-result/${testResult.test.id}/${testResult.userId}`)

        return {
            message: "Test result updated successfully.",
            success: true,
        }
    } catch (error) {
        console.error("Error updating test result:", error)
        return {
            message: "An error occurred while updating the test result. Please try again.",
            success: false,
        }
    }
}


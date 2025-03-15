// @ts-nocheck
"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Start a new test attempt or resume an existing one
export async function startTestAttempt(testId: string, userId: string) {
    try {
        // Check if there's an existing attempt
        const existingAttempt = await prisma.testResult.findUnique({
            where: {
                testId_userId: {
                    testId,
                    userId,
                },
            },
        })

        // If there's an existing attempt that's not completed, return it
        if (existingAttempt && !existingAttempt.completedAt) {
            return {
                success: true,
                attemptId: existingAttempt.id,
                message: "Resumed existing attempt",
            }
        }

        // If there's a completed attempt, don't allow a new one
        if (existingAttempt && existingAttempt.completedAt) {
            return {
                success: false,
                message: "You have already completed this test",
            }
        }

        // Create a new attempt
        const newAttempt = await prisma.testResult.create({
            data: {
                score: 0, // Initial score is 0
                test: {
                    connect: { id: testId },
                },
                user: {
                    connect: { id: userId },
                },
            },
        })

        return {
            success: true,
            attemptId: newAttempt.id,
            message: "New attempt started",
        }
    } catch (error) {
        console.error("Error starting test attempt:", error)
        return {
            success: false,
            message: "Failed to start test attempt",
        }
    }
}

// Save an answer during the test
export async function saveAnswer(attemptId: string, questionId: string, answer: string) {
    try {
        // Check if the attempt exists and is not completed
        const attempt = await prisma.testResult.findUnique({
            where: { id: attemptId },
            include: { test: { include: { questions: true } } },
        })

        if (!attempt) {
            return {
                success: false,
                message: "Test attempt not found",
            }
        }

        if (attempt.completedAt) {
            return {
                success: false,
                message: "Cannot modify answers for a completed test",
            }
        }

        // Find the question
        const question = attempt.test.questions.find((q) => q.id === questionId)
        if (!question) {
            return {
                success: false,
                message: "Question not found",
            }
        }

        let isCorrect = false
        let score = 0

        switch (question.type) {
            case "multiple-choice":
                isCorrect = answer.trim() === question.answer.trim()
                score = isCorrect ? question.points : 0
                break
            case "true-false":
                score = 0
                isCorrect = false;
                console.log(question.answer.trim() + " " + answer.trim())
                if ((question.answer.trim() == "False" || question.answer.trim() == "1") && answer.trim() == "1") {
                    score = question.points;
                    isCorrect = true;
                }

                if ((question.answer.trim() == "True" || question.answer.trim() == "0") && answer.trim() == "0") {
                    score = question.points;
                    isCorrect = true;
                }

                break
            case "short-answer":
                // For short answer, do a case-insensitive comparison
                isCorrect = answer.trim().toLowerCase() === question.answer.trim().toLowerCase()
                score = isCorrect ? question.points : 0
                break
            default:
                break
        }

        // Check if an answer already exists
        const existingAnswer = await prisma.answer.findUnique({
            where: {
                testResultId_questionId: {
                    testResultId: attemptId,
                    questionId,
                },
            },
        })

        if (existingAnswer) {
            // Update existing answer
            await prisma.answer.update({
                where: {
                    id: existingAnswer.id,
                },
                data: {
                    text: answer,
                    isCorrect,
                    score,
                },
            })
        } else {
            // Create new answer
            await prisma.answer.create({
                data: {
                    text: answer,
                    isCorrect,
                    score,
                    testResult: {
                        connect: { id: attemptId },
                    },
                    question: {
                        connect: { id: questionId },
                    },
                },
            })
        }

        return {
            success: true,
            message: "Answer saved",
        }
    } catch (error) {
        console.error("Error saving answer:", error)
        return {
            success: false,
            message: "Failed to save answer",
        }
    }
}

// Submit the completed test
export async function submitTest(attemptId: string, timeSpent: number) {
    try {
        // Get the test attempt with answers
        const attempt = await prisma.testResult.findUnique({
            where: { id: attemptId },
            include: {
                answers: true,
                test: {
                    include: {
                        questions: true,
                    },
                },
            },
        })

        if (!attempt) {
            return {
                success: false,
                message: "Test attempt not found",
            }
        }

        if (attempt.completedAt) {
            return {
                success: false,
                message: "Test has already been submitted",
            }
        }

        const totalPossibleScore = attempt.test.questions.reduce((sum, question) => sum + question.points, 0)

        const earnedScore = attempt.answers.reduce((sum, answer) => sum + answer.score, 0)

        const percentageScore = totalPossibleScore > 0 ? (earnedScore / totalPossibleScore) * 100 : 0

        await prisma.testResult.update({
            where: { id: attemptId },
            data: {
                score: percentageScore,
                completedAt: new Date(),
                timeSpent,
            },
        })

        // Revalidate relevant paths
        revalidatePath(`/test-results/${attempt.testId}`)
        revalidatePath("/myspace")

        return {
            success: true,
            message: "Test submitted successfully",
        }
    } catch (error) {
        console.error("Error submitting test:", error)
        return {
            success: false,
            message: "Failed to submit test",
        }
    }
}


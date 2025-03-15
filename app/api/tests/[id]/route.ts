// @ts-nocheck

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const testId = params.id

        // Get the test with questions
        const test = await prisma.test.findUnique({
            where: {
                id: testId,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                classroom: {
                    select: {
                        id: true,
                        name: true,
                        ownerId: true,
                    },
                },
                questions: {
                    orderBy: {
                        id: "asc",
                    },
                },
                _count: {
                    select: {
                        results: true,
                    },
                },
            },
        })

        if (!test) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 })
        }

        // Check if the user is the creator of the test or a member of the classroom
        const isCreator = test.creator.id === session.user.id
        let canAccess = isCreator

        if (!canAccess && test.classroom) {
            // Check if the user is the owner of the classroom
            if (test.classroom.ownerId === session.user.id) {
                canAccess = true
            } else {
                // Check if the user is a member of the classroom
                const isMember = await prisma.classroomMember.findUnique({
                    where: {
                        classroomId_userId: {
                            classroomId: test.classroom.id,
                            userId: session.user.id,
                        },
                    },
                })

                canAccess = !!isMember
            }
        }

        if (!canAccess) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        // Get the user's result for this test if it exists
        const userResult = await prisma.testResult.findUnique({
            where: {
                testId_userId: {
                    testId,
                    userId: session.user.id,
                },
            },
            include: {
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        })

        // If the user is taking the test, don't include the answers
        if (!isCreator && test.status === "active" && !userResult) {
            // Remove answers from questions
            test.questions = test.questions.map((question) => ({
                ...question,
                answer: "",
            }))
        }

        return NextResponse.json({
            ...test,
            isCreator,
            userResult,
        })
    } catch (error) {
        console.error("Error fetching test:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


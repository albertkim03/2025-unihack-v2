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
        const userId = params.userId

        // Get the test to check permissions
        const test = await prisma.test.findUnique({
            where: {
                id: testId,
            },
            select: {
                creatorId: true,
                classroomId: true,
            },
        })

        if (!test) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 })
        }

        // Check if the user is the creator of the test, the owner of the classroom, or viewing their own result
        const isCreator = test.creatorId === session.user.id
        const isOwnResult = userId === session.user.id
        let canAccess = isCreator || isOwnResult

        if (!canAccess && test.classroomId) {
            // Check if the user is the owner of the classroom
            const classroom = await prisma.classroom.findUnique({
                where: {
                    id: test.classroomId,
                },
                select: {
                    ownerId: true,
                },
            })

            if (classroom && classroom.ownerId === session.user.id) {
                canAccess = true
            }
        }

        if (!canAccess) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        // Get the test result
        const result = await prisma.testResult.findUnique({
            where: {
                testId_userId: {
                    testId,
                    userId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        })

        if (!result) {
            return NextResponse.json({ error: "Test result not found" }, { status: 404 })
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching test result:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


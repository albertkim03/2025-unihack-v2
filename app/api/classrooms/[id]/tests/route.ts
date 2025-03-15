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

        const classroomId = params.id

        // Check if the user is the owner or a member of the classroom
        const classroom = await prisma.classroom.findUnique({
            where: {
                id: classroomId,
            },
            select: {
                ownerId: true,
            },
        })

        if (!classroom) {
            return NextResponse.json({ error: "Classroom not found" }, { status: 404 })
        }

        const isOwner = classroom.ownerId === session.user.id

        if (!isOwner) {
            const isMember = await prisma.classroomMember.findUnique({
                where: {
                    classroomId_userId: {
                        classroomId,
                        userId: session.user.id,
                    },
                },
            })

            if (!isMember) {
                return NextResponse.json({ error: "Access denied" }, { status: 403 })
            }
        }

        // Get the tests for the classroom
        const tests = await prisma.test.findMany({
            where: {
                classroomId,
            },
            include: {
                creator: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        results: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        })

        // Get completion statistics for each test
        const testsWithStats = await Promise.all(
            tests.map(async (test) => {
                const results = await prisma.testResult.findMany({
                    where: {
                        testId: test.id,
                    },
                    select: {
                        score: true,
                    },
                })

                // Get the total number of classroom members
                const memberCount = await prisma.classroomMember.count({
                    where: {
                        classroomId,
                    },
                })

                const completionRate = memberCount > 0 ? (test._count.results / memberCount) * 100 : 0
                const averageScore =
                    results.length > 0 ? results.reduce((sum, result) => sum + result.score, 0) / results.length : 0

                return {
                    ...test,
                    completionRate,
                    averageScore,
                }
            }),
        )

        return NextResponse.json(testsWithStats)
    } catch (error) {
        console.error("Error fetching classroom tests:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


// @ts-nocheck
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const classroomId = params.id

        // Get the classroom details
        const classroom = await prisma.classroom.findUnique({
            where: {
                id: classroomId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        members: true,
                        tests: true,
                    },
                },
            },
        })

        if (!classroom) {
            return NextResponse.json({ error: "Classroom not found" }, { status: 404 })
        }

        // Check if the user is the owner or a member of the classroom
        const isOwner = classroom.owner.id === session.user.id

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

        // Get statistics for the classroom
        const testResults = await prisma.testResult.findMany({
            where: {
                test: {
                    classroomId,
                },
            },
            select: {
                score: true,
            },
        })

        const averageScore =
            testResults.length > 0 ? testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length : 0

        // Get recent activity
        const recentTests = await prisma.test.findMany({
            where: {
                classroomId,
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 5,
            select: {
                id: true,
                name: true,
                updatedAt: true,
            },
        })

        return NextResponse.json({
            ...classroom,
            isOwner,
            averageScore,
            recentTests,
        })
    } catch (error) {
        console.error("Error fetching classroom:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


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

        // Get the members of the classroom
        const members = await prisma.classroomMember.findMany({
            where: {
                classroomId,
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
            },
            orderBy: {
                joinedAt: "desc",
            },
        })

        // Get test completion statistics for each member
        const memberStats = await Promise.all(
            members.map(async (member) => {
                const testResults = await prisma.testResult.findMany({
                    where: {
                        userId: member.user.id,
                        test: {
                            classroomId,
                        },
                    },
                    select: {
                        score: true,
                    },
                })

                const testsCompleted = testResults.length
                const averageScore =
                    testsCompleted > 0 ? testResults.reduce((sum, result) => sum + result.score, 0) / testsCompleted : 0

                return {
                    ...member,
                    testsCompleted,
                    averageScore,
                }
            }),
        )

        return NextResponse.json(memberStats)
    } catch (error) {
        console.error("Error fetching classroom members:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// Add a POST endpoint to invite users by email
export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const classroomId = params.id
        const { email } = await request.json()

        // Check if the user is the owner of the classroom
        const classroom = await prisma.classroom.findUnique({
            where: {
                id: classroomId,
            },
            select: {
                ownerId: true,
                joinCode: true,
            },
        })

        if (!classroom) {
            return NextResponse.json({ error: "Classroom not found" }, { status: 404 })
        }

        if (classroom.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Only the classroom owner can invite members" }, { status: 403 })
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            return NextResponse.json(
                {
                    error: "User not found",
                    message: "The user with this email is not registered in the system.",
                    joinCode: classroom.joinCode,
                },
                { status: 404 },
            )
        }

        // Check if the user is already a member
        const existingMember = await prisma.classroomMember.findUnique({
            where: {
                classroomId_userId: {
                    classroomId,
                    userId: user.id,
                },
            },
        })

        if (existingMember) {
            return NextResponse.json(
                {
                    error: "User is already a member",
                    message: "This user is already a member of the classroom.",
                },
                { status: 400 },
            )
        }

        // Add the user to the classroom
        const member = await prisma.classroomMember.create({
            data: {
                classroom: {
                    connect: { id: classroomId },
                },
                user: {
                    connect: { id: user.id },
                },
                role: "student",
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
            },
        })

        return NextResponse.json({
            success: true,
            message: "User added to classroom successfully",
            member,
        })
    } catch (error) {
        console.error("Error adding classroom member:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


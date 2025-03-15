// @ts-nocheck
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getTestStats } from "@/lib/analytics"

export async function GET(request: Request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const testId = params.id

        // Check if the user is the creator of the test
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

        if (test.creatorId !== session.user.id) {
            // If the test is part of a classroom, check if the user is the owner or a teaching assistant
            if (test.classroomId) {
                const classroom = await prisma.classroom.findUnique({
                    where: {
                        id: test.classroomId,
                    },
                    select: {
                        ownerId: true,
                    },
                })

                if (classroom?.ownerId === session.user.id) {
                    // User is the classroom owner
                } else {
                    // Check if the user is a teaching assistant or co-teacher
                    const membership = await prisma.classroomMember.findUnique({
                        where: {
                            classroomId_userId: {
                                classroomId: test.classroomId,
                                userId: session.user.id,
                            },
                        },
                        select: {
                            role: true,
                        },
                    })

                    if (!membership || !["teaching-assistant", "co-teacher"].includes(membership.role)) {
                        return NextResponse.json({ error: "Access denied" }, { status: 403 })
                    }
                }
            } else {
                return NextResponse.json({ error: "Access denied" }, { status: 403 })
            }
        }

        const stats = await getTestStats(testId)

        return NextResponse.json(stats)
    } catch (error) {
        console.error("Error fetching test analytics:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


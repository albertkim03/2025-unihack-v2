// @ts-nocheck

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get URL parameters
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") || "created" // created, assigned
        const status = searchParams.get("status") // draft, active, completed, archived

        if (type === "created") {
            // Get tests created by the user
            const tests = await prisma.test.findMany({
                where: {
                    creatorId: session.user.id,
                    ...(status ? { status } : {}),
                },
                include: {
                    classroom: {
                        select: {
                            id: true,
                            name: true,
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

            return NextResponse.json(tests)
        } else if (type === "assigned") {
            // Get tests assigned to the user (via classrooms they're members of)
            const memberClassrooms = await prisma.classroomMember.findMany({
                where: {
                    userId: session.user.id,
                },
                select: {
                    classroomId: true,
                },
            })

            const classroomIds = memberClassrooms.map((member) => member.classroomId)

            const tests = await prisma.test.findMany({
                where: {
                    classroomId: {
                        in: classroomIds,
                    },
                    ...(status ? { status } : {}),
                },
                include: {
                    classroom: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    creator: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    _count: {
                        select: {
                            questions: true,
                        },
                    },
                    results: {
                        where: {
                            userId: session.user.id,
                        },
                        select: {
                            id: true,
                            score: true,
                            completedAt: true,
                        },
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
            })

            return NextResponse.json(tests)
        }

        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    } catch (error) {
        console.error("Error fetching tests:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


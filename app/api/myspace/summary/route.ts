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

        // Get tests created by the user
        const createdTests = await prisma.test.count({
            where: {
                creatorId: session.user.id,
            },
        })

        // Get classrooms where the user is a member
        const memberClassrooms = await prisma.classroomMember.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                classroomId: true,
            },
        })

        const classroomIds = memberClassrooms.map((member) => member.classroomId)

        // Get assigned tests count
        const assignedTests = await prisma.test.count({
            where: {
                classroomId: {
                    in: classroomIds,
                },
            },
        })

        // Get completed tests count and total assigned tests for completion rate
        const testResults = await prisma.testResult.findMany({
            where: {
                userId: session.user.id,
                completedAt: {
                    not: null,
                },
            },
        })

        const completedTests = testResults.length
        const completionRate = assignedTests > 0 ? Math.round((completedTests / assignedTests) * 100) : 0

        return NextResponse.json({
            createdTests,
            assignedTests,
            completionRate,
        })
    } catch (error) {
        console.error("Error fetching myspace summary:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
} 
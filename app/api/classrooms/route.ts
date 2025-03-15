// @ts-nocheck
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get classrooms where the user is the owner
        const ownedClassrooms = await prisma.classroom.findMany({
            where: {
                ownerId: session.user.id,
            },
            select: {
                name: true,
                id: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        })

        // Get classrooms where the user is a member
        const memberClassrooms = await prisma.classroom.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id,
                    },
                },
            },
            select: {
                name: true,
                id: true,
                // owner: {
                //     select: {
                //         firstName: true,
                //         lastName: true,
                //     },
                // },
                // _count: {
                //     select: {
                //         members: true,
                //         tests: true,
                //     },
                // },
                // tests: {
                //     orderBy: {
                //         createdAt: "desc",
                //     },
                //     take: 1,
                //     select: {
                //         title: true,
                //     },
                // },
            },
            orderBy: {
                updatedAt: "desc",
            },
        })

        return NextResponse.json({
            owned: ownedClassrooms,
            member: memberClassrooms,
        })
    } catch (error) {
        console.error("Error fetching classrooms:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

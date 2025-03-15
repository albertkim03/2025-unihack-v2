// @ts-nocheck
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Get all members of a classroom
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

        // Get all members of the classroom
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
                user: {
                    firstName: "asc",
                },
            },
        })

        return NextResponse.json(members)
    } catch (error) {
        console.error("Error fetching classroom members:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// Add a member to a classroom
export async function POST(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const classroomId = params.id
        const { email, role = "student" } = await request.json()

        // Check if the user is the owner of the classroom
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

        if (classroom.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Only the classroom owner can add members" }, { status: 403 })
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Check if the user is already a member of the classroom
        const existingMember = await prisma.classroomMember.findUnique({
            where: {
                classroomId_userId: {
                    classroomId,
                    userId: user.id,
                },
            },
        })

        if (existingMember) {
            return NextResponse.json({ error: "User is already a member of this classroom" }, { status: 400 })
        }

        // Add the user to the classroom
        const member = await prisma.classroomMember.create({
            data: {
                classroomId,
                userId: user.id,
                role,
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

        return NextResponse.json(member)
    } catch (error) {
        console.error("Error adding classroom member:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


// @ts-nocheck

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// Update a classroom member's role
export async function PATCH(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const classroomId = params.id
        const memberId = params.memberId
        const { role } = await request.json()

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
            return NextResponse.json({ error: "Only the classroom owner can update member roles" }, { status: 403 })
        }

        // Update the member's role
        const updatedMember = await prisma.classroomMember.update({
            where: {
                id: memberId,
            },
            data: {
                role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        image: true,
                    },
                },
            },
        })

        return NextResponse.json(updatedMember)
    } catch (error) {
        console.error("Error updating classroom member:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// Remove a member from a classroom
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const classroomId = params.id
        const memberId = params.memberId

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
            return NextResponse.json({ error: "Only the classroom owner can remove members" }, { status: 403 })
        }

        // Remove the member from the classroom
        await prisma.classroomMember.delete({
            where: {
                id: memberId,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error removing classroom member:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
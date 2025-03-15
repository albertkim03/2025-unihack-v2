// @ts-nocheck
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserStats } from "@/lib/analytics"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const stats = await getUserStats(session.user.id)

        return NextResponse.json(stats)
    } catch (error) {
        console.error("Error fetching user analytics:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


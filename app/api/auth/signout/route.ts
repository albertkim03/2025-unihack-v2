import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Clear the session cookie
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.set({
        name: authOptions.cookies?.sessionToken?.name || "next-auth.session-token",
        value: "",
        expires: new Date(0),
        path: "/",
    })

    return response
}


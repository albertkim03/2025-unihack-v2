import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// List of paths that require authentication
const protectedPaths = ["/dashboard", "/account", "/myspace", "/classrooms", "/create-test", "/results"]

// List of paths that are accessible only to non-authenticated users
const authPaths = ["/login"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Check if the path is for non-authenticated users only
  const isAuthPath = authPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))

  // Get the token from the request
  const token = await getToken({ req: request })

  // If the path is protected and the user is not authenticated, redirect to login
  if (isProtectedPath && !token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // If the path is for non-authenticated users and the user is authenticated, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}


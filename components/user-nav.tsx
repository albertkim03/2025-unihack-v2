"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

export function UserNav() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const isLoggedIn = !!session?.user

  // Add this effect to refresh the component when session changes
  useEffect(() => {
    // This empty dependency array ensures the component re-renders when session changes
  }, [session])

  const handleLogout = async () => {
    // Use a form submission to trigger a server action
    const form = document.createElement("form")
    form.method = "post"
    form.action = "/api/auth/signout"

    // Add a CSRF token if needed
    const csrfToken = await fetch("/api/auth/csrf")
        .then((res) => res.json())
        .then((data) => data.csrfToken)
    if (csrfToken) {
      const csrfInput = document.createElement("input")
      csrfInput.type = "hidden"
      csrfInput.name = "csrfToken"
      csrfInput.value = csrfToken
      form.appendChild(csrfInput)
    }

    // Add a redirect URL
    const redirectInput = document.createElement("input")
    redirectInput.type = "hidden"
    redirectInput.name = "redirect"
    redirectInput.value = "/login"
    form.appendChild(redirectInput)

    document.body.appendChild(form)
    form.submit()
  }

  if (!isLoggedIn) {
    return (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
    )
  }

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                  src={session.user.image || "/placeholder.svg?height=32&width=32"}
                  alt={session.user.name || "User"}
              />
              <AvatarFallback>
                {session.user.firstName?.[0]}
                {session.user.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/account">
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/myspace">
                <User className="mr-2 h-4 w-4" />
                <span>My Space</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}


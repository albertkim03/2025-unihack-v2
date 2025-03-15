"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/create-test",
      label: "Create Test",
      active: pathname === "/create-test",
    },
    {
      href: "/myspace",
      label: "My Space",
      active: pathname === "/myspace",
    },
    {
      href: "/classrooms",
      label: "Classrooms",
      active: pathname === "/classrooms" || pathname.startsWith("/classrooms/"),
    },
    {
      href: "/results",
      label: "Results",
      active: pathname === "/results",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}


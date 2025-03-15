"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Image from "next/image"

export function MainNav() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  const mainRoutes = [
    { href: "/dashboard", label: "Dashboard", active: pathname === "/dashboard" },
    { href: "/myspace", label: "My Space", active: pathname === "/myspace" },
    { href: "/classrooms", label: "Classrooms", active: pathname === "/classrooms" || pathname.startsWith("/classrooms/") },
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
        <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Image
                src="/images/QuizzieLogo.png"
                alt="Home"
                width={100}
                height={100}
              />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {session && mainRoutes.map((route) => (
          <NavigationMenuItem key={route.href}>
            <Link href={route.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {route.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
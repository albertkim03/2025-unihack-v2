import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getServerSession } from "next-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "STEM Test Generator",
  description: "AI-powered test paper generator for STEM subjects",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
            <div className="flex min-h-screen flex-col">
            <header className="border-b w-full">
              <div className="max-w-screen-xl w-full mx-auto flex h-16 items-center px-4">
                <MainNav />
                <div className="ml-auto flex items-center gap-4">
                  {session && (
                    <Button asChild>
                      <Link href="/create-test">Create Test</Link>
                    </Button>
                  )}
                  <UserNav />
                </div>
              </div>
            </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6 w-full">
                <div className="max-w-screen-xl w-full mx-auto flex items-center justify-center px-4">
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Quizzie - Boost123. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


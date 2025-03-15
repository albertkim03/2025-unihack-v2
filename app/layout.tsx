import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "STEM Test Generator",
  description: "AI-powered test paper generator for STEM subjects",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
            <div className="flex min-h-screen flex-col">
              <header className="border-b">
                <div className="container flex h-16 items-center px-4">
                  <MainNav />
                  <div className="ml-auto flex items-center space-x-4">
                    <UserNav />
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                  <p className="text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} STEM Test Generator. All rights reserved.
                  </p>
                  <nav className="flex gap-4">
                    <a href="/terms" className="text-sm text-muted-foreground hover:underline">
                      Terms
                    </a>
                    <a href="/privacy" className="text-sm text-muted-foreground hover:underline">
                      Privacy
                    </a>
                    <a href="/contact" className="text-sm text-muted-foreground hover:underline">
                      Contact
                    </a>
                  </nav>
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


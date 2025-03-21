"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { AtSign, Lock, ArrowRight } from "lucide-react"
import { login, signup, type FormState } from "@/app/actions/auth"
import { useFormState } from "react-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "next-auth/react"

const initialState: FormState = {}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("login")
  const [loginState, loginAction] = useFormState(login, initialState)
  const [signupState, signupAction] = useFormState(signup, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user just registered
  const registered = searchParams.get("registered")

  useEffect(() => {
    if (registered) {
      setActiveTab("login")
    }
  }, [registered])

  // Handle successful server-side validation
  useEffect(() => {
    if (loginState.success) {
      // Now use the client-side signIn
      const handleClientSignIn = async () => {
        try {
          setIsSubmitting(true)
          const result = await signIn("credentials", {
            email: document.querySelector<HTMLInputElement>('[name="email"]')?.value,
            password: document.querySelector<HTMLInputElement>('[name="password"]')?.value,
            redirect: true,
            callbackUrl: "/dashboard",
          })

          // We don't need to manually redirect as we're using redirect: true
          // The router.push will not be reached as the page will be redirected by NextAuth
        } catch (error) {
          console.error("Client sign-in error:", error)
          setIsSubmitting(false)
        }
      }

      handleClientSignIn()
    }
  }, [loginState.success])

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      await loginAction(formData)

      // The useEffect above will handle successful login
      setIsSubmitting(false)
    } catch (error) {
      console.error("Login error:", error)
      setIsSubmitting(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    await signupAction(formData)

    setIsSubmitting(false)
  }

  return (
      <div className="flex min-h-[calc(100vh-8rem)]  items-center justify-center">
        <Card className="w-full max-w-md">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLoginSubmit}>
                <CardHeader>
                  <CardTitle className="text-2xl">Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                  {registered && (
                      <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>Account created successfully! You can now log in.</AlertDescription>
                      </Alert>
                  )}
                  {loginState.message && (
                      <Alert className="mt-4 bg-red-50 text-red-800 border-red-200">
                        <AlertDescription>{loginState.message}</AlertDescription>
                      </Alert>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          required
                      />
                    </div>
                    {loginState.errors?.email && <p className="text-sm text-red-500">{loginState.errors.email[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="password" name="password" type="password" className="pl-10" required />
                    </div>
                    {loginState.errors?.password && (
                        <p className="text-sm text-red-500">{loginState.errors.password[0]}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" name="remember" />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignupSubmit}>
                <CardHeader>
                  <CardTitle className="text-2xl">Create an account</CardTitle>
                  <CardDescription>Enter your details to create a new account</CardDescription>
                  {signupState.message && (
                      <Alert className="mt-4 bg-red-50 text-red-800 border-red-200">
                        <AlertDescription>{signupState.message}</AlertDescription>
                      </Alert>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" required />
                      {signupState.errors?.firstName && (
                          <p className="text-sm text-red-500">{signupState.errors.firstName[0]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required />
                      {signupState.errors?.lastName && (
                          <p className="text-sm text-red-500">{signupState.errors.lastName[0]}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          required
                      />
                    </div>
                    {signupState.errors?.email && <p className="text-sm text-red-500">{signupState.errors.email[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="signup-password" name="password" type="password" className="pl-10" required />
                    </div>
                    {signupState.errors?.password && (
                        <ul className="text-sm text-red-500 list-disc pl-5 mt-1">
                          {signupState.errors.password.map((error, index) => (
                              <li key={index}>{error}</li>
                          ))}
                        </ul>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters long and include uppercase, lowercase, number, and special
                      character.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create Account"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
  )
}


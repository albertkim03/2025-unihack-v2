//@ts-nocheck
"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AccountStats } from "@/components/account-stats"
import { useSession } from "next-auth/react"
import { updateProfile, type ProfileFormState } from "@/app/actions/user"
import { useFormState } from "react-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save } from "lucide-react"

const initialState: ProfileFormState = {}

export default function AccountPage() {
  const { data: session, update: updateSession } = useSession()
  const [profileState, profileAction] = useFormState(updateProfile, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await profileAction(formData)

    // If profile update was successful, update the session
    if (result.success) {
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          name: `${formData.get("firstName")} ${formData.get("lastName")}`,
        },
      })
    }

    setIsSubmitting(false)
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-8 md:grid-cols-1">
              <Card>
                <form onSubmit={handleProfileSubmit}>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                    {profileState.message && (
                        <Alert
                            className={`mt-4 ${profileState.success ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"}`}
                        >
                          <AlertDescription>{profileState.message}</AlertDescription>
                        </Alert>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                            src={session?.user?.image || "/placeholder.svg?height=80&width=80"}
                            alt={session?.user?.name || "User"}
                        />
                        <AvatarFallback>
                          {session?.user?.firstName?.[0]}
                          {session?.user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button size="sm">Change Avatar</Button>
                        <Button size="sm" variant="outline">
                          Remove
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" name="firstName" defaultValue={session?.user?.firstName || ""} />
                        {profileState.errors?.firstName && (
                            <p className="text-sm text-red-500">{profileState.errors.firstName[0]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" name="lastName" defaultValue={session?.user?.lastName || ""} />
                        {profileState.errors?.lastName && (
                            <p className="text-sm text-red-500">{profileState.errors.lastName[0]}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={session?.user?.email || ""} disabled className="bg-muted" />
                      <p className="text-xs text-muted-foreground">
                        Email address cannot be changed. Contact support if you need to update your email.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="statistics">
            <AccountStats />
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="outline">Enable Two-Factor Authentication</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sessions</h3>
                  <p className="text-sm text-muted-foreground">Manage your active sessions across devices.</p>
                  <Button variant="outline">Manage Sessions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}


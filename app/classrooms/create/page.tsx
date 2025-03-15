// @ts-nocheck

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Mail, LinkIcon, Copy, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createClassroom } from "@/app/actions/classroom"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(100),
  description: z.string().optional(),
  subject: z.string().min(1, { message: "Subject is required" }),
  grade: z.string().min(1, { message: "Grade level is required" }),
})

export default function CreateClassroomPage() {
  const [inviteMethod, setInviteMethod] = useState("email")
  const [emails, setEmails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      subject: "",
      grade: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {

      const result = await createClassroom(null, {
        name: data.name,
        description: data.description,
        subject: data.subject,
        grade: data.grade
      })

      if (!result.success) {
        toast({
          title: "Error",
          description: result.message || "Failed to create classroom",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Classroom created successfully",
        })
        // The server action will handle redirection
      }
    } catch (error) {
      console.error("Error creating classroom:", error)
      // toast({
      //   title: "Error",
      //   description: "An unexpected error occurred. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle copy invite link
  const handleCopyLink = () => {
    // In a real app, this would be a real invite link
    navigator.clipboard.writeText("https://stem-test-generator.app/invite/abc123")
    toast({
      title: "Copied!",
      description: "Invite link copied to clipboard",
    })
  }

  // Handle sending email invites
  const handleSendInvites = () => {
    if (!emails.trim()) {
      toast({
        title: "No emails provided",
        description: "Please enter at least one email address",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would send actual invites
    toast({
      title: "Invites sent!",
      description: `Invitations sent to ${emails.split(/[,\n]/).filter((e) => e.trim()).length} students`,
    })
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create New Classroom</h1>
          <p className="text-muted-foreground">Set up a new classroom and invite students</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Classroom Details</CardTitle>
                  <CardDescription>Enter the basic information about your classroom</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Classroom Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Physics 101" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Physics">Physics</SelectItem>
                                <SelectItem value="Chemistry">Chemistry</SelectItem>
                                <SelectItem value="Biology">Biology</SelectItem>
                                <SelectItem value="Mathematics">Mathematics</SelectItem>
                                <SelectItem value="Computer Science">Computer Science</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Provide a brief description of your classroom..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Primary School">Primary School</SelectItem>
                                <SelectItem value="High School">High School</SelectItem>
                                <SelectItem value="University">University</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invite Students</CardTitle>
                  <CardDescription>Add students to your classroom</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs value={inviteMethod} onValueChange={setInviteMethod}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email">
                        <Mail className="mr-2 h-4 w-4" />
                        Email Invites
                      </TabsTrigger>
                      <TabsTrigger value="link">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Invite Link
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="emails">Student Emails</Label>
                        <Textarea
                            id="emails"
                            placeholder="Enter email addresses (one per line or comma-separated)"
                            value={emails}
                            onChange={(e) => setEmails(e.target.value)}
                            className="min-h-[120px]"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="button" size="sm" variant="outline" onClick={handleSendInvites}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Invites
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="link" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Shareable Invite Link</Label>
                        <div className="flex items-center">
                          <Input
                              readOnly
                              value="https://stem-test-generator.app/invite/abc123"
                              className="rounded-r-none"
                          />
                          <Button
                              type="button"
                              variant="secondary"
                              className="rounded-l-none"
                              size="icon"
                              onClick={handleCopyLink}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Anyone with this link can join your classroom</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiry">Link Expiry</Label>
                        <Select defaultValue="7days">
                          <SelectTrigger id="expiry">
                            <SelectValue placeholder="Select expiry time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="24hours">24 Hours</SelectItem>
                            <SelectItem value="7days">7 Days</SelectItem>
                            <SelectItem value="30days">30 Days</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Student Permissions</Label>
                    <Select defaultValue="view-only">
                      <SelectTrigger>
                        <SelectValue placeholder="Select permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view-only">View Only (Take Tests)</SelectItem>
                        <SelectItem value="contribute">Contribute (Submit Questions)</SelectItem>
                        <SelectItem value="collaborate">Collaborate (Create Tests)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/classrooms")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                ) : (
                    "Create Classroom"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
  )
}


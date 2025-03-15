"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, Mail, LinkIcon, Copy } from "lucide-react"

export default function CreateClassroomPage() {
  const [inviteMethod, setInviteMethod] = useState("email")
  const [emails, setEmails] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Classroom</h1>
        <p className="text-muted-foreground">Set up a new classroom and invite students</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Classroom Details</CardTitle>
            <CardDescription>Enter the basic information about your classroom</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Classroom Name</Label>
              <Input id="name" placeholder="e.g., Physics 101" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" placeholder="Provide a brief description of your classroom..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade Level</Label>
              <Select>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="middle-school">Middle School</SelectItem>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add from Contacts
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="link" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Shareable Invite Link</Label>
                  <div className="flex items-center">
                    <Input readOnly value="https://stem-test-generator.app/invite/abc123" className="rounded-r-none" />
                    <Button variant="secondary" className="rounded-l-none" size="icon">
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
        <Button variant="outline">Cancel</Button>
        <Button>Create Classroom</Button>
      </div>
    </div>
  )
}


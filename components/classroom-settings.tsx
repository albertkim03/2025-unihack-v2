"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Trash2, Copy, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ClassroomSettingsProps {
  classroomId: string
}

export function ClassroomSettings({ classroomId }: ClassroomSettingsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Mock classroom data
  const classroom = {
    id: classroomId,
    name: "Physics 101",
    description: "Introductory physics course covering mechanics, thermodynamics, and waves",
    subject: "Physics",
    gradeLevel: "Undergraduate",
    joinCode: "PHY101",
    visibility: "private",
    notifications: {
      testAssigned: true,
      testCompleted: true,
      newMembers: true,
      announcements: true,
    },
    permissions: {
      allowStudentsToSeeScores: true,
      allowStudentsToSeeAnswers: false,
      allowStudentsToSubmitQuestions: false,
    },
  }

  const handleDeleteClassroom = () => {
    // In a real app, this would delete the classroom
    console.log("Deleting classroom:", classroomId)
    setShowDeleteDialog(false)
    router.push("/classrooms")
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your classroom details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Classroom Name</Label>
                <Input id="name" defaultValue={classroom.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" defaultValue={classroom.description} className="min-h-[100px]" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select defaultValue={classroom.subject.toLowerCase()}>
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
                  <Label htmlFor="grade-level">Grade Level</Label>
                  <Select defaultValue={classroom.gradeLevel.toLowerCase()}>
                    <SelectTrigger id="grade-level">
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
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="join-code">Join Code</Label>
                <div className="flex gap-2">
                  <Input id="join-code" value={classroom.joinCode} readOnly />
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Students can use this code to join your classroom</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility">Classroom Visibility</Label>
                <Select defaultValue={classroom.visibility}>
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Anyone with the code can join)</SelectItem>
                    <SelectItem value="private">Private (Invitation only)</SelectItem>
                    <SelectItem value="restricted">Restricted (Requires approval)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>Control what students can see and do in your classroom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="scores">Allow students to see their scores</Label>
                    <p className="text-xs text-muted-foreground">
                      Students will be able to see their test scores immediately after completion
                    </p>
                  </div>
                  <Switch id="scores" defaultChecked={classroom.permissions.allowStudentsToSeeScores} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="answers">Allow students to see correct answers</Label>
                    <p className="text-xs text-muted-foreground">
                      Students will be able to see the correct answers after completing a test
                    </p>
                  </div>
                  <Switch id="answers" defaultChecked={classroom.permissions.allowStudentsToSeeAnswers} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="submit-questions">Allow students to submit questions</Label>
                    <p className="text-xs text-muted-foreground">
                      Students will be able to submit their own questions for review
                    </p>
                  </div>
                  <Switch id="submit-questions" defaultChecked={classroom.permissions.allowStudentsToSubmitQuestions} />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="default-role">Default Role for New Members</Label>
                <Select defaultValue="student">
                  <SelectTrigger id="default-role">
                    <SelectValue placeholder="Select default role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teaching-assistant">Teaching Assistant</SelectItem>
                    <SelectItem value="co-teacher">Co-Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-visibility">Default Test Visibility</Label>
                <Select defaultValue="after-due-date">
                  <SelectTrigger id="test-visibility">
                    <SelectValue placeholder="Select when tests are visible" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately after creation</SelectItem>
                    <SelectItem value="scheduled">At scheduled time</SelectItem>
                    <SelectItem value="after-due-date">After due date</SelectItem>
                    <SelectItem value="manual">Manual release only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Permissions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications for this classroom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="test-assigned">Test assigned notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications when a new test is assigned</p>
                  </div>
                  <Switch id="test-assigned" defaultChecked={classroom.notifications.testAssigned} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="test-completed">Test completion notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications when students complete tests</p>
                  </div>
                  <Switch id="test-completed" defaultChecked={classroom.notifications.testCompleted} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-members">New member notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications when new members join the classroom
                    </p>
                  </div>
                  <Switch id="new-members" defaultChecked={classroom.notifications.newMembers} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="announcements">Announcement notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive notifications for classroom announcements</p>
                  </div>
                  <Switch id="announcements" defaultChecked={classroom.notifications.announcements} />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notification-method">Notification Method</Label>
                <Select defaultValue="email-app">
                  <SelectTrigger id="notification-method">
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email-only">Email only</SelectItem>
                    <SelectItem value="app-only">In-app only</SelectItem>
                    <SelectItem value="email-app">Email and in-app</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="digest-frequency">Notification Digest Frequency</Label>
                <Select defaultValue="immediate">
                  <SelectTrigger id="digest-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="weekly">Weekly digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions that affect your classroom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border border-destructive p-4">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h3 className="font-medium text-destructive">Delete Classroom</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete this classroom and all associated data. This action cannot be undone.
                    </p>
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="mt-4">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Classroom
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the classroom "{classroom.name}"
                            and all associated data including tests, results, and member information.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteClassroom}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Archive Classroom</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Archive this classroom to make it read-only. You can restore it later.
                    </p>
                    <Button variant="outline" className="mt-4">
                      Archive Classroom
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Transfer Ownership</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Transfer ownership of this classroom to another teacher.
                    </p>
                    <Button variant="outline" className="mt-4">
                      Transfer Ownership
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


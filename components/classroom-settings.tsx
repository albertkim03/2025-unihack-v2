// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Copy, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { updateClassroom, deleteClassroom } from "@/app/actions/classroom"
import { useFormState } from "react-dom"
import { Skeleton } from "@/components/ui/skeleton"

const initialState = {
  errors: {},
  message: "",
  success: false,
}

export function ClassroomSettings({ classroomId }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [classroom, setClassroom] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const updateClassroomWithId = updateClassroom.bind(null, classroomId)
  const [state, formAction] = useFormState(updateClassroomWithId, initialState)

  // Fix: Changed useState to useEffect for fetching classroom data
  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const response = await fetch(`/api/classrooms/${classroomId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch classroom")
        }

        const data = await response.json()
        setClassroom(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching classroom:", error)
        setIsLoading(false)
      }
    }

    fetchClassroom()
  }, [classroomId])

  // Add effect to refresh data after successful update
  useEffect(() => {
    if (state.success) {
      // Refresh the classroom data after successful update
      const refreshClassroom = async () => {
        try {
          const response = await fetch(`/api/classrooms/${classroomId}`)

          if (!response.ok) {
            throw new Error("Failed to fetch updated classroom data")
          }

          const data = await response.json()
          setClassroom(data)

          toast({
            title: "Success",
            description: state.message,
          })
        } catch (error) {
          console.error("Error refreshing classroom data:", error)
        }
      }

      refreshClassroom()
    }
  }, [state.success, classroomId, toast, state.message])

  const handleCopyJoinCode = () => {
    if (classroom?.joinCode) {
      navigator.clipboard.writeText(classroom.joinCode)
      toast({
        title: "Join code copied",
        description: "The join code has been copied to your clipboard.",
      })
    }
  }

  const handleDeleteClassroom = async () => {
    if (confirm("Are you sure you want to delete this classroom? This action cannot be undone.")) {
      setIsDeleting(true)

      const result = await deleteClassroom(classroomId)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push("/classrooms")
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
        setIsDeleting(false)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-[180px] mb-2" />
            <Skeleton className="h-5 w-[240px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[120px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-[120px] w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[80px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[80px]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
              </div>
              <Skeleton className="h-4 w-[280px]" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-10 w-[160px]" />
            <Skeleton className="h-10 w-[120px]" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!classroom) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500">Failed to load classroom settings</p>
          </div>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        <form action={formAction}>
          <Card>
            <CardHeader>
              <CardTitle>Classroom Settings</CardTitle>
              <CardDescription>Update your classroom information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Classroom Name</Label>
                <Input id="name" name="name" defaultValue={classroom.name} required />
                {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={classroom.description || ""} rows={3} />
                {state.errors?.description && <p className="text-sm text-red-500">{state.errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" defaultValue={classroom.subject} required />
                  {state.errors?.subject && <p className="text-sm text-red-500">{state.errors.subject}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade-level">Grade Level</Label>
                  <Select name="grade-level" defaultValue={classroom.grade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primary School">Primary School</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="University">University</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.errors?.grade && <p className="text-sm text-red-500">{state.errors.grade}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Join Code</Label>
                <div className="flex items-center gap-2">
                  <Input value={classroom.joinCode} readOnly />
                  <Button type="button" variant="outline" size="icon" onClick={handleCopyJoinCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Share this code with students to join your classroom</p>
              </div>

              {state.message && !state.success && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="destructive" onClick={handleDeleteClassroom} disabled={isDeleting}>
                <Trash className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Classroom"}
              </Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
  )
}


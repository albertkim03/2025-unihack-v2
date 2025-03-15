"use client"

import React from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Plus, Users } from "lucide-react"

interface Classroom {
  id: string
  name: string
  description: string
  subject: string
  students?: number
  tests?: number
  recent?: string
}

interface ClassroomOverviewProps {
  classrooms: Classroom[]
}

export function ClassroomOverview({ classrooms = [] }: ClassroomOverviewProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Classrooms</h2>
        <Button asChild>
          <Link href="/classrooms/create">
            <Plus className="mr-2 h-4 w-4" /> Create Classroom
          </Link>
        </Button>
      </div>

      {classrooms.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Classrooms Yet</CardTitle>
            <CardDescription>Create your first classroom to get started</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Button asChild>
              <Link href="/classrooms/create">
                <Plus className="mr-2 h-4 w-4" /> Create Classroom
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <Card key={classroom.id}>
              <CardHeader>
                <CardTitle>{classroom.name}</CardTitle>
                <CardDescription>{classroom.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {classroom.students || 0} students
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <p>
                    <strong>Subject:</strong> {classroom.subject}
                  </p>
                  <p>
                    <strong>Tests:</strong> {classroom.tests || 0}
                  </p>
                  {classroom.recent && (
                    <p>
                      <strong>Recent:</strong> {classroom.recent}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/classrooms/${classroom.id}`}>View Classroom</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


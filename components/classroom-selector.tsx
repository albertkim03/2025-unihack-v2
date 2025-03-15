// @ts-nocheck

"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export function ClassroomSelector({ value, onChange }) {
  const [classrooms, setClassrooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch classrooms where the user is the owner
        const response = await fetch("/api/classrooms")

        if (!response.ok) {
          throw new Error("Failed to fetch classrooms")
        }

        const data = await response.json()

        // Format the data for the select component
        const ownedClassrooms = data.owned || []
        console.log(ownedClassrooms)
        setClassrooms(ownedClassrooms)
      } catch (error) {
        console.error("Error fetching classrooms:", error)
        setError("Failed to load classrooms")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassrooms()
  }, [])

  return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="classroom">Select Classroom</Label>
          <Button variant="ghost" size="sm" asChild className="h-8">
            <Link href="/classrooms/create">
              <Plus className="mr-1 h-3 w-3" /> New
            </Link>
          </Button>
        </div>
        <Select value={value} onValueChange={onChange} disabled={isLoading}>
          <SelectTrigger id="classroom">
            {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading classrooms...</span>
                </div>
            ) : (
                <SelectValue placeholder="Select a classroom" />
            )}
          </SelectTrigger>
          <SelectContent>
            {error ? (
                <SelectItem value="error" disabled>
                  {error}
                </SelectItem>
            ) : classrooms.length > 0 ? (
                classrooms.map((classroom) => (
                    <SelectItem key={classroom.id} value={classroom.id}>
                      {classroom.name}
                    </SelectItem>
                ))
            ) : (
                <SelectItem value="no-classrooms" disabled>
                  {isLoading ? "Loading..." : "No classrooms available"}
                </SelectItem>
            )}
          </SelectContent>
        </Select>
        {classrooms.length === 0 && !isLoading && !error && (
            <p className="text-xs text-muted-foreground mt-1">
              You don't have any classrooms yet. Create one to assign tests.
            </p>
        )}
      </div>
  )
}


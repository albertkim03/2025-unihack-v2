import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function ClassroomSelector() {
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
      <Select>
        <SelectTrigger id="classroom">
          <SelectValue placeholder="Select a classroom" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="physics-101">Physics 101</SelectItem>
          <SelectItem value="advanced-chemistry">Advanced Chemistry</SelectItem>
          <SelectItem value="biology-fundamentals">Biology Fundamentals</SelectItem>
          <SelectItem value="calculus-ii">Calculus II</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}


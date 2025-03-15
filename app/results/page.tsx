import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download } from "lucide-react"
import { TestResultsTable } from "@/components/test-results-table"
import { TestResultsGrid } from "@/components/test-results-grid"

export default function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search tests..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="computer-science">Computer Science</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Classrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classrooms</SelectItem>
              <SelectItem value="physics-101">Physics 101</SelectItem>
              <SelectItem value="advanced-chemistry">Advanced Chemistry</SelectItem>
              <SelectItem value="biology-fundamentals">Biology Fundamentals</SelectItem>
              <SelectItem value="calculus-ii">Calculus II</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Results Summary</CardTitle>
          <CardDescription>Overview of all test results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Total Tests</span>
              <span className="text-3xl font-bold">48</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Average Score</span>
              <span className="text-3xl font-bold">76%</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Highest Score</span>
              <span className="text-3xl font-bold">98%</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Lowest Score</span>
              <span className="text-3xl font-bold">42%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="table" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-sm px-2 py-1 text-xs">
              Showing 1-10 of 48
            </Badge>
          </div>
        </div>

        <TabsContent value="table" className="space-y-4">
          <TestResultsTable />
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          <TestResultsGrid />
        </TabsContent>
      </Tabs>
    </div>
  )
}


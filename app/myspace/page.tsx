// @ts-nocheck

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, Clock, CheckCircle } from "lucide-react"
import { PersonalTestsList } from "@/components/personal-tests-list"
import { AssignedTestsList } from "@/components/assigned-tests-list"

export default function MySpacePage() {
  const [viewType, setViewType] = useState("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [summaryData, setSummaryData] = useState({
    createdTests: 0,
    assignedTests: 0,
    completionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSummaryData() {
      console.log("Fetching summary data");
      try {
        const [createdRes, assignedRes] = await Promise.all([
          fetch('/api/tests?type=created'),
          fetch('/api/tests?type=assigned'),
        ]);

        if (!createdRes.ok || !assignedRes.ok) {
          throw new Error('Failed to fetch tests');
        }

        const [createdTests, assignedTests] = await Promise.all([
          createdRes.json(),
          assignedRes.json(),
        ]);

        console.log("assignedTests:", assignedTests);

        // Calculate how many assigned tests are completed using results length
        const completedTests = assignedTests.filter((test) => test.results && test.results.length > 0);

        const completionRate = assignedTests.length > 0
          ? Math.round((completedTests.length / assignedTests.length) * 100)
          : 0;

        // Update summary data
        setSummaryData({
          createdTests: createdTests.length,
          assignedTests: assignedTests.length,
          completionRate,
        });

      } catch (error) {
        console.error('Error fetching summary data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummaryData();
  }, []);

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Space</h1>
          <p className="text-muted-foreground">Manage your personal and assigned tests</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : summaryData.createdTests}</div>
              <p className="text-xs text-muted-foreground">Tests created by you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Tests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : summaryData.assignedTests}</div>
              <p className="text-xs text-muted-foreground">Tests assigned to you</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : `${summaryData.completionRate}%`}</div>
              <p className="text-xs text-muted-foreground">Of assigned tests completed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="personal">My Tests</TabsTrigger>
              <TabsTrigger value="assigned">Assigned Tests</TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tests..."
                  className="pl-8 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by subject" />
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
              <div className="flex gap-2">
                <Button
                    variant={viewType === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewType("list")}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                    variant={viewType === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewType("grid")}
                >
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                    <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                    <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                    <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="personal">
            <PersonalTestsList viewType={viewType} searchQuery={searchQuery} selectedSubject={selectedSubject} />
          </TabsContent>

          <TabsContent value="assigned">
            <AssignedTestsList viewType={viewType} searchQuery={searchQuery} selectedSubject={selectedSubject} />
          </TabsContent>
        </Tabs>
      </div>
  )
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AccountStats() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>View your test creation and classroom statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Total Tests Created</span>
              <span className="text-3xl font-bold">48</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Active Classrooms</span>
              <span className="text-3xl font-bold">4</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Total Students</span>
              <span className="text-3xl font-bold">94</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Avg. Completion Rate</span>
              <span className="text-3xl font-bold">87%</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="h-[300px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
              <span className="text-muted-foreground">Performance chart visualization would appear here</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="by-subject" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-subject">By Subject</TabsTrigger>
          <TabsTrigger value="by-classroom">By Classroom</TabsTrigger>
          <TabsTrigger value="by-time">Over Time</TabsTrigger>
        </TabsList>

        <TabsContent value="by-subject">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Subject</CardTitle>
              <CardDescription>Average scores across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Physics</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "82%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Chemistry</span>
                    <span className="text-sm font-medium">76%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "76%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Biology</span>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "88%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Mathematics</span>
                    <span className="text-sm font-medium">71%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "71%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Computer Science</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-classroom">
          <Card>
            <CardHeader>
              <CardTitle>Performance by Classroom</CardTitle>
              <CardDescription>Average scores across different classrooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Physics 101</span>
                    <span className="text-sm font-medium">79%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "79%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Advanced Chemistry</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "72%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Biology Fundamentals</span>
                    <span className="text-sm font-medium">84%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "84%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Calculus II</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "68%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-time">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Average scores over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
                <span className="text-muted-foreground">Time series chart visualization would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


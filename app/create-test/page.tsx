"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Upload, FileText, BookOpen, CheckCircle } from "lucide-react"
import { TestPreview } from "@/components/test-preview"
import { ClassroomSelector } from "@/components/classroom-selector"

export default function CreateTestPage() {
  const [currentStep, setCurrentStep] = useState("source")
  const [includeAnswers, setIncludeAnswers] = useState(true)
  const [assignmentType, setAssignmentType] = useState("personal")
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file selection via button
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
    } else {
      alert("Only PDF files are allowed!")
    }
  }

  // Handle file drop via drag & drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
    } else {
      alert("Only PDF files are allowed!")
    }
  }

  // Prevent default drag behaviors
  const preventDefaults = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Test</h1>
        <p className="text-muted-foreground">Generate AI-powered test papers for your STEM subjects</p>
      </div>

      <Tabs value={currentStep} onValueChange={setCurrentStep} className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="source">
            <FileText className="mr-2 h-4 w-4" />
            Source Materials
          </TabsTrigger>
          <TabsTrigger value="configure">
            <BookOpen className="mr-2 h-4 w-4" />
            Configure Test
          </TabsTrigger>
          <TabsTrigger value="assign">
            <CheckCircle className="mr-2 h-4 w-4" />
            Assign
          </TabsTrigger>
        </TabsList>

        <TabsContent value="source" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Source Materials</CardTitle>
              <CardDescription>
                Upload documents, textbooks, or notes that will be used to generate test questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
                  ${isHovered ? "border-blue-500 shadow-lg shadow-blue-300/50" : "border-gray-300"}
                  ${isDragging ? "border-green-500 shadow-green-300/50" : ""}
                `}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  preventDefaults(e);
                  setIsDragging(true);
                }}
                onDragEnter={preventDefaults}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drag & Drop PDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse files (PDF)</p>
                  <Button>Select Files</Button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
              />

              {/* Display Selected File */}
              {file && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-center">
                  <strong>Selected File:</strong> {file.name}
                </div>
              )}

              {/* Textarea Input */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Or enter text directly</h3>
                <Textarea placeholder="Paste or type your source material here..." className="min-h-[200px]" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => setCurrentStep("configure")}>Continue</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="configure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configure Test Parameters</CardTitle>
              <CardDescription>Customize your test by selecting subject, topics, and question types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input id="test-name" placeholder="e.g., Physics Midterm Exam" />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics">Topics (comma separated)</Label>
                <Input id="topics" placeholder="e.g., Mechanics, Forces, Motion" />
              </div>

              <div className="space-y-4">
                <Label>Number of Questions</Label>
                <div className="flex items-center space-x-4">
                  <Slider defaultValue={[10]} max={50} step={1} className="flex-1" />
                  <span className="w-12 text-center font-medium">10</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                <Input
                  id="time-limit"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g., 60"
                  className="w-full md:w-1/3"
                />
              </div>

              <div className="space-y-2">
                <Label>Question Types</Label>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="multiple-choice" defaultChecked />
                    <Label htmlFor="multiple-choice">Multiple Choice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="true-false" />
                    <Label htmlFor="true-false">True/False</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="short-answer" />
                    <Label htmlFor="short-answer">Short Answer</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Include Answers</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-answers"
                    checked={includeAnswers}
                    onCheckedChange={(checked) => setIncludeAnswers(checked as boolean)}
                  />
                  <Label htmlFor="include-answers">Include answer key with the test</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("source")}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep("assign")}>Continue</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="assign" className="space-y-6">
          <div className="grid h-full">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Test Assignment</CardTitle>
                <CardDescription>Choose how you want to assign this test</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                <RadioGroup value={assignmentType} onValueChange={setAssignmentType} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal">Keep for personal use only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="classroom" id="classroom" />
                    <Label htmlFor="classroom">Assign to classroom</Label>
                  </div>
                </RadioGroup>

                {assignmentType === "classroom.ts" && (
                  <div className="space-y-4 pt-4">
                    <ClassroomSelector />

                    <div className="space-y-2">
                      <Label>Test Visibility</Label>
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="show-marks" defaultChecked />
                          <Label htmlFor="show-marks">Show marks to students</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="show-answers" />
                          <Label htmlFor="show-answers">Show correct answers after completion</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due Date (Optional)</Label>
                      <Input id="due-date" type="date" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep("configure")}>
                  Back
                </Button>
                <Button>Generate & {assignmentType === "classroom.ts" ? "Assign" : "Save"}</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


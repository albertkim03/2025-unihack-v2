// @ts-nocheck
"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
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
import { Upload, FileText, BookOpen, CheckCircle, AlertCircle } from "lucide-react"
import { TestPreview } from "@/components/test-preview"
import { ClassroomSelector } from "@/components/classroom-selector"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import * as pdfjsLib from 'pdfjs-dist/webpack';
import {createTest} from "../actions/test";


// Ensure workerSrc is set
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Define validation schema
const testSchema = z.object({
  testName: z.string().min(2, "Test name must be at least 2 characters long"),
  subject: z.string().min(1, "Subject is required"),
  topics: z.string().min(1, "At least one topic is required"),
  questionCount: z.number().min(1, "At least one question is required"),
  duration: z.number().min(5, "Duration must be at least 5 minutes"),
  includeAnswers: z.boolean(),
  questionTypes: z
      .object({
        multipleChoice: z.boolean(),
        trueFalse: z.boolean(),
        shortAnswer: z.boolean(),
      })
      .refine((data) => data.multipleChoice || data.trueFalse || data.shortAnswer, {
        message: "At least one question type must be selected",
      }),
  assignmentType: z.enum(["personal", "classroom"]),
  classroomId: z.string().optional(),
  showMarks: z.boolean().optional(),
  showAnswers: z.boolean().optional(),
  dueDate: z.string().optional(),
})

const extractTextFromPDF = async (file: File): Promise<string> => {
  if (file == null) {
    return Promise.resolve("")
  }

  const reader = new FileReader();

  try {
    return new Promise((resolve, reject) => {
      reader.readAsArrayBuffer(file);

      reader.onload = async function () {
        if (!reader.result) {
          reject("Failed to read file");
          return;
        }

        try {
          const pdfData = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

          let extractedText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            extractedText += content.items.map((item: any) => item.str).join(" ") + "\n";
          }

          resolve(extractedText);
        } catch (error) {
          reject(`Error extracting text: ${error}`);
        }
      };

      reader.onerror = () => reject("File reading error");
    });
  } catch (e) {
    return Promise.resolve("")
  }

};


export default function CreateTestPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef(null)

  const [currentStep, setCurrentStep] = useState("source")
  const [includeAnswers, setIncludeAnswers] = useState(true)
  const [assignmentType, setAssignmentType] = useState("personal")
  const [questionCount, setQuestionCount] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [sourceText, setSourceText] = useState("")
  const [testDuration, setTestDuration] = useState(40)

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Form values
  const [testName, setTestName] = useState("")
  const [subject, setSubject] = useState("")
  const [topics, setTopics] = useState("")
  const [questionTypes, setQuestionTypes] = useState({
    multipleChoice: true,
    trueFalse: false,
    shortAnswer: false,
  })
  const [classroomId, setClassroomId] = useState("")
  const [showMarks, setShowMarks] = useState(true)
  const [showAnswers, setShowAnswers] = useState(false)
  const [dueDate, setDueDate] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      setSelectedFile(e.target.files[0])
      console.log(e.target.files[0])
    } else {
      alert("Only PDF files are allowed!")
    }
  }

  const preventDefaults = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile)
      setSelectedFile(event.dataTransfer.files[0])
    } else {
      alert("Only PDF files are allowed!")
    }
  }

  const handleSelectFiles = () => {
    fileInputRef.current?.click()
  }

  const handleQuestionTypeChange = (type, checked) => {
    setQuestionTypes((prev) => ({
      ...prev,
      [type]: checked,
    }))
  }

  const validateCurrentStep = () => {
    if (currentStep === "source") {
      // Source materials step - at least one source is required
      if (!selectedFile && !sourceText.trim()) {
        setError("Please provide at least one source material (file or text)")
        return false
      }
      setError("")
      return true
    }

    if (currentStep === "configure") {
      // Configuration step - validate required fields
      try {
        z.object({
          testName: z.string().min(2, "Test name must be at least 2 characters long"),
          subject: z.string().min(1, "Subject is required"),
          topics: z.string().min(1, "At least one topic is required"),
          questionTypes: z
              .object({
                multipleChoice: z.boolean(),
                trueFalse: z.boolean(),
                shortAnswer: z.boolean(),
              })
              .refine((data) => data.multipleChoice || data.trueFalse || data.shortAnswer, {
                message: "At least one question type must be selected",
              }),
        }).parse({
          testName,
          subject,
          topics,
          questionTypes,
        })
        setError("")
        return true
      } catch (err) {
        if (err instanceof z.ZodError) {
          setError(err.errors[0].message)
        } else {
          setError("Please check the form for errors")
        }
        return false
      }
    }

    return true
  }

  const handleContinue = () => {
    if (validateCurrentStep()) {
      if (currentStep === "source") {
        setCurrentStep("configure")
      } else if (currentStep === "configure") {
        setCurrentStep("assign")
      }
    }
  }

  const handleBack = () => {
    setError("")
    if (currentStep === "configure") {
      setCurrentStep("source")
    } else if (currentStep === "assign") {
      setCurrentStep("configure")
    }
  }

  const handleSubmit = async () => {
    try {
      const content = await extractTextFromPDF(file)
      const content2 = content + sourceText

      // Validate the entire form
      const formData = {
        testName,
        subject,
        topics,
        questionCount,
        questionTypes,
        content: content2,
        classroomId,
        duration: testDuration,
      }

      setIsSubmitting(true)
      setError("")

      // // Create FormData object for file upload
      // const apiFormData = new FormData()
      //
      // // Add file if selected
      // if (selectedFile) {
      //   apiFormData.append("file", selectedFile)
      // }
      //
      // // Add source text if provided
      // if (sourceText) {
      //   apiFormData.append("sourceText", sourceText)
      // }
      //
      // // Add all other form fields
      // apiFormData.append("testName", testName)
      // apiFormData.append("subject", subject)
      // apiFormData.append("topics", topics)
      // apiFormData.append("questionCount", questionCount.toString())
      // apiFormData.append("questionTypes", JSON.stringify(questionTypes))
      // apiFormData.append("assignmentType", assignmentType)
      //
      // if (assignmentType === "classroom") {
      //   apiFormData.append("classroomId", classroomId)
      //   apiFormData.append("showMarks", showMarks.toString())
      //   apiFormData.append("showAnswers", showAnswers.toString())
      //   if (dueDate) {
      //     apiFormData.append("dueDate", dueDate)
      //   }
      // }

      // Send to API
      console.log(formData.testName)
      const response = await fetch("/api/tests/", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create test")
      }

      const questions = JSON.parse(data)

      const resp = await createTest(questions, formData)
      toast({
        title: "Success!",
        description: "Your test has been created successfully.",
      })

      // Redirect to the appropriate page
      if (data.testId) {
        router.push(`/test-details/${data.testId}`)
      } else {
        router.push("/myspace")
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        console.log(err)
        setError(err.message || "An error occurred while creating the test")
      }
      setIsSubmitting(false)
    }
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

          {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}

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


                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Or enter text directly</h3>
                  <Textarea
                      placeholder="Paste or type your source material here..."
                      className="min-h-[200px]"
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
                <Button onClick={handleContinue}>Continue</Button>
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
                    <Input
                        id="test-name"
                        placeholder="e.g., Physics Midterm Exam"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
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
                  <Input
                      id="topics"
                      placeholder="e.g., Mechanics, Forces, Motion"
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                      required
                  />
                </div>

                <div className="space-y-4">
                  <Label>Number of Questions</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                        value={[questionCount]}
                        onValueChange={(values) => setQuestionCount(values[0])}
                        max={50}
                        step={1}
                        className="flex-1"
                    />
                    <span className="w-12 text-center font-medium">{questionCount}</span>
                  </div>
                </div>


                <div className="space-y-4">
                  <Label>Test Duration (minutes)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider
                        value={[testDuration]}
                        onValueChange={(values) => setTestDuration(values[0])}
                        min={5}
                        max={180}
                        step={5}
                        className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                          type="number"
                          value={testDuration}
                          onChange={(e) => setTestDuration(Number(e.target.value))}
                          className="w-20"
                          min={5}
                      />
                      <span>min</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Question Types</Label>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="multiple-choice"
                          checked={questionTypes.multipleChoice}
                          onCheckedChange={(checked) => handleQuestionTypeChange("multipleChoice", checked)}
                      />
                      <Label htmlFor="multiple-choice">Multiple Choice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="true-false"
                          checked={questionTypes.trueFalse}
                          onCheckedChange={(checked) => handleQuestionTypeChange("trueFalse", checked)}
                      />
                      <Label htmlFor="true-false">True/False</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="short-answer"
                          checked={questionTypes.shortAnswer}
                          onCheckedChange={(checked) => handleQuestionTypeChange("shortAnswer", checked)}
                      />
                      <Label htmlFor="short-answer">Short Answer</Label>
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleContinue}>Continue</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="assign" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle>Test Assignment</CardTitle>
                  <CardDescription>Choose how you want to assign this test</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  {assignmentType === "classroom" && (
                      <div className="space-y-4 pt-4">
                        <ClassroomSelector value={classroomId} onChange={setClassroomId} />

                        <div className="space-y-2">
                          <Label htmlFor="due-date">Due Date (Optional)</Label>
                          <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                      </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Generating..." : `Generate & ${assignmentType === "classroom" ? "Assign" : "Save"}`}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  )
}


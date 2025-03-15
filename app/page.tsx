import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Users, FileText, BarChart3 } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="container mx-auto px-4 pt-20 pb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl flex items-center gap-8">
            <Image
              src="/images/QuizzieLogoIcon.png"
              alt="Quizzie Logo"
              width={85}
              height={85}
              className="inline-block"
            />
            AI-Powered STEM Test Generator
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Create customised test papers for STEM subjects using AI. Upload source materials, select topics, and generate
            tests in minutes.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Button asChild size="lg">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative w-full md:w-1/2 h-[400px]">
          <Image
            src="/images/LandingPageGraphic.png"
            alt="STEM Test Generator illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4 pb-8">
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary" />
            <CardTitle className="mt-4">Create Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Generate customised test papers by uploading source materials and selecting specific topics and question
              types.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-primary" />
            <CardTitle className="mt-4">Manage Classrooms</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Create and manage classrooms, invite students, and assign tests to individuals or groups.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-primary" />
            <CardTitle className="mt-4">Track Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Monitor test completion status and control whether students can view their marks or the entire paper.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <BarChart3 className="h-8 w-8 text-primary" />
            <CardTitle className="mt-4">Analyse Results</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              View performance statistics, including average scores by subject, and track progress over time.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


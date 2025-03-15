import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Classroom Not Found</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          The classroom you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/classrooms">Return to Classrooms</Link>
        </Button>
      </div>
    </div>
  )
}


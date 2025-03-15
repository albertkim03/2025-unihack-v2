import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function AccessDenied() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-destructive/10 p-4 mb-4">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
        <p className="text-muted-foreground max-w-md mb-6">
          You don't have permission to view this classroom. Only classroom owners can access this page.
        </p>
        <Button asChild>
          <Link href="/classrooms">Return to Classrooms</Link>
        </Button>
      </div>
    </div>
  )
}


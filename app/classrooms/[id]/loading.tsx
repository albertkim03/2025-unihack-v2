import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingClassrooms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-[250px] mb-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-[180px]" />
          <Skeleton className="h-10 w-[160px]" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Owned Classrooms Section */}
        <div>
          <Skeleton className="h-6 w-[150px] mb-4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={`owned-${i}`}>
                <CardHeader>
                  <Skeleton className="h-6 w-[180px] mb-2" />
                  <Skeleton className="h-4 w-[240px]" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Member Classrooms Section */}
        <div>
          <Skeleton className="h-6 w-[180px] mb-4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={`member-${i}`}>
                <CardHeader>
                  <Skeleton className="h-6 w-[180px] mb-2" />
                  <Skeleton className="h-4 w-[240px]" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-5 w-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-4 w-[140px]" />
                    <Skeleton className="h-4 w-[160px]" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
// @ts-nocheck

import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ClassroomClientWrapper } from "@/components/classroom-client-wrapper"

// This is a server component that fetches data
export default async function ClassroomPage({ params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id

  try {
    // Fetch classroom data from Prisma
    const classroom = await prisma.classroom.findUnique({
      where: {
        id: params.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          take: 5,
        },
        _count: {
          select: {
            members: true,
            tests: true,
          },
        },
      },
    })

    if (!classroom) {
      notFound()
    }

    // Check if the user is the owner or a member of the classroom
    const isOwner = classroom.owner.id === userId

    if (!isOwner) {
      const isMember = await prisma.classroomMember.findUnique({
        where: {
          classroomId_userId: {
            classroomId: params.id,
            userId,
          },
        },
      })

      if (!isMember) {
        redirect(`/classrooms/${params.id}/access-denied`)
      }
    }

    // Get statistics for the classroom
    const testResults = await prisma.testResult.findMany({
      where: {
        test: {
          classroomId: params.id,
        },
      },
      select: {
        score: true,
      },
    })

    const averageScore =
        testResults.length > 0 ? testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length : 0

    const completionRate = await calculateCompletionRate(params.id)

    // Get recent tests
    const recentTests = await prisma.test.findMany({
      where: {
        classroomId: params.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    })

    // Format the data for the component
    const classroomData = {
      ...classroom,
      isOwner,
      averageScore,
      completionRate,
      recentTests,
    }

    return <ClassroomClientWrapper classroom={classroomData} />
  } catch (error) {
    console.error("Error fetching classroom:", error)
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500">Error loading classroom data. Please try again.</p>
            </div>
          </div>
        </div>
    )
  }
}

// Helper function to calculate completion rate
async function calculateCompletionRate(classroomId) {
  try {
    // Get all tests in the classroom
    const tests = await prisma.test.findMany({
      where: {
        classroomId,
      },
      select: {
        id: true,
      },
    })

    if (tests.length === 0) return 0

    // Get all members in the classroom
    const memberCount = await prisma.classroomMember.count({
      where: {
        classroomId,
      },
    })

    if (memberCount === 0) return 0

    // Get all test results for the classroom
    const testResultsCount = await prisma.testResult.count({
      where: {
        test: {
          classroomId,
        },
      },
    })

    // Calculate the completion rate
    // Total possible completions = number of tests * number of members
    const totalPossible = tests.length * memberCount
    const completionRate = (testResultsCount / totalPossible) * 100

    return Math.round(completionRate)
  } catch (error) {
    console.error("Error calculating completion rate:", error)
    return 0
  }
}


// @ts-nocheck
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TestResultsView } from "@/components/test-results-view"

export default async function TestResultsPage({ params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const testId = params.id
  const userId = session.user.id

  // Fetch the test with questions
  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      questions: true,
      creator: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      classroom: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!test) {
    redirect("/myspace?error=test-not-found")
  }

  // Fetch the user's test result
  const testResult = await prisma.testResult.findUnique({
    where: {
      testId_userId: {
        testId,
        userId,
      },
    },
    include: {
      answers: {
        include: {
          question: true,
        },
      },
    },
  })

  if (!testResult || !testResult.completedAt) {
    // If the test hasn't been completed, redirect to take the test
    redirect(`/take-test/${testId}`)
  }

  return <TestResultsView test={test} testResult={testResult} />
}


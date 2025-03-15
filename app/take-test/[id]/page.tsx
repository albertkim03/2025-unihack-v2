// @ts-nocheck
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { TestTaker } from "@/components/test-taker"

export default async function TakeTestPage({ params }) {
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

  // Check if user has permission to take this test
  const canTakeTest = await checkUserPermission(userId, test)

  if (!canTakeTest) {
    redirect("/myspace?error=permission-denied")
  }

  // Check if user already has an attempt
  const existingAttempt = await prisma.testResult.findUnique({
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

  return <TestTaker test={test} existingAttempt={existingAttempt} userId={userId} />
}

async function checkUserPermission(userId: string, test: any) {
  // If the user is the creator, they can take the test
  if (test.creatorId === userId) {
    return true
  }

  // If the test is assigned to a classroom, check if user is a member
  if (test.classroomId) {
    const membership = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: test.classroomId,
          userId,
        },
      },
    })

    return !!membership
  }

  // If the test is directly assigned to the user
  const isAssigned = await prisma.test.findFirst({
    where: {
      id: test.id,
      assignedUsers: {
        some: {
          id: userId,
        },
      },
    },
  })

  return !!isAssigned
}


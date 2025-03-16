// @ts-nocheck
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const testId = params.id
        const userId = params.userId

        // Get the test to check permissions
        const test = await prisma.test.findUnique({
            where: {
                id: testId,
            },
            select: {
                creatorId: true,
                classroomId: true,
            },
        })

        if (!test) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 })
        }

        // Check if the user is the creator of the test, the owner of the classroom, or viewing their own result
        const isCreator = test.creatorId === session.user.id
        const isOwnResult = userId === session.user.id
        let canAccess = isCreator || isOwnResult

        if (!canAccess && test.classroomId) {
            // Check if the user is the owner of the classroom
            const classroom = await prisma.classroom.findUnique({
                where: {
                    id: test.classroomId,
                },
                select: {
                    ownerId: true,
                },
            })

            if (classroom && classroom.ownerId === session.user.id) {
                canAccess = true
            }
        }

        if (!canAccess) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 })
        }

        // Get the test result
        const result = await prisma.testResult.findUnique({
            where: {
                testId_userId: {
                    testId,
                    userId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        })

        if (!result) {
            return NextResponse.json({ error: "Test result not found" }, { status: 404 })
        }

        return NextResponse.json(result)
    } catch (error) {
        console.error("Error fetching test result:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// --- GET code omitted for brevity (your existing code) ---

export async function PATCH(request: Request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const testId = params.id
    const userId = params.userId

    // 1. Check permissions exactly as you did in GET:
    const test = await prisma.test.findUnique({
      where: { id: testId },
      select: { creatorId: true, classroomId: true },
    })
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Is the user the test’s creator, or the classroom owner, or patching their own result?
    const isCreator = test.creatorId === session.user.id
    const isOwnResult = userId === session.user.id
    let canAccess = isCreator || isOwnResult

    // If not already allowed, check if user is the classroom owner
    if (!canAccess && test.classroomId) {
      const classroom = await prisma.classroom.findUnique({
        where: { id: test.classroomId },
        select: { ownerId: true },
      })
      if (classroom?.ownerId === session.user.id) {
        canAccess = true
      }
    }

    if (!canAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // 2. Parse the patch request body
    // { answers: [{ answerId: string, score: number }, ... ] }
    const { answers } = await request.json()

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid request body. 'answers' array is required." },
        { status: 400 }
      )
    }

    // 3. Fetch the existing result & answers from DB
    const existingResult = await prisma.testResult.findUnique({
      where: { testId_userId: { testId, userId } },
      include: {
        answers: true,
      },
    })

    if (!existingResult) {
      return NextResponse.json({ error: "Test result not found" }, { status: 404 })
    }

    // 4. Update each answer’s score
    for (const { answerId, score } of answers) {
      // optional: validate that the answer belongs to this testResult, etc.
      await prisma.answer.update({
        where: { id: answerId },
        data: { score },
      })
    }

    // 5. Recompute the total testResult score if desired
    const updatedAnswers = await prisma.answer.findMany({
      where: {
        testResultId: existingResult.id,
      },
      include: { question: true },
    })

    const newTotalScore = updatedAnswers.reduce((sum, ans) => sum + (ans.score ?? 0), 0)

    // optional: update the testResult’s overall score
    const updatedResult = await prisma.testResult.update({
      where: { id: existingResult.id },
      data: { score: newTotalScore },
      include: {
        answers: {
          include: { question: true },
        },
      },
    })

    return NextResponse.json(updatedResult)
  } catch (error) {
    console.error("Error PATCHing test result:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


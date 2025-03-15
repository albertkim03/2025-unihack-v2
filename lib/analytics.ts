import prisma from "@/lib/prisma"

export async function getUserStats(userId: string) {
    // Get tests created by the user
    const testsCreated = await prisma.test.count({
        where: {
            creatorId: userId,
        },
    })

    // Get classrooms created by the user
    const classroomsCreated = await prisma.classroom.count({
        where: {
            ownerId: userId,
        },
    })

    // Get tests assigned to the user
    const memberClassrooms = await prisma.classroomMember.findMany({
        where: {
            userId,
        },
        select: {
            classroomId: true,
        },
    })

    const classroomIds = memberClassrooms.map((member) => member.classroomId)

    const testsAssigned = await prisma.test.count({
        where: {
            classroomId: {
                in: classroomIds,
            },
            status: {
                in: ["active", "completed"],
            },
        },
    })

    // Get test results for the user
    const testResults = await prisma.testResult.findMany({
        where: {
            userId,
        },
        select: {
            score: true,
        },
    })

    const testsCompleted = testResults.length
    const averageScore =
        testsCompleted > 0 ? testResults.reduce((sum, result) => sum + result.score, 0) / testsCompleted : 0
    const completionRate = testsAssigned > 0 ? (testsCompleted / testsAssigned) * 100 : 0

    // Get subject performance
    const subjectPerformance = await prisma.testResult.groupBy({
        by: ["testId"],
        where: {
            userId,
        },
        _avg: {
            score: true,
        },
    })

    const subjectScores: Record<string, { total: number; count: number }> = {}

    for (const result of subjectPerformance) {
        const test = await prisma.test.findUnique({
            where: {
                id: result.testId,
            },
            select: {
                subject: true,
            },
        })

        if (test) {
            if (!subjectScores[test.subject]) {
                subjectScores[test.subject] = { total: 0, count: 0 }
            }

            subjectScores[test.subject].total += result._avg.score || 0
            subjectScores[test.subject].count += 1
        }
    }

    const subjectPerformanceData = Object.entries(subjectScores).map(([subject, data]) => ({
        subject,
        averageScore: data.count > 0 ? data.total / data.count : 0,
    }))

    return {
        testsCreated,
        classroomsCreated,
        testsAssigned,
        testsCompleted,
        averageScore,
        completionRate,
        subjectPerformance: subjectPerformanceData,
    }
}

export async function getClassroomStats(classroomId: string) {
    // Get tests in the classroom
    const tests = await prisma.test.findMany({
        where: {
            classroomId,
        },
        select: {
            id: true,
            name: true,
            subject: true,
        },
    })

    const testIds = tests.map((test) => test.id)

    // Get test results for the classroom
    const testResults = await prisma.testResult.findMany({
        where: {
            testId: {
                in: testIds,
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
        },
    })

    // Get member count
    const memberCount = await prisma.classroomMember.count({
        where: {
            classroomId,
        },
    })

    // Calculate statistics
    const testStats = tests.map((test) => {
        const results = testResults.filter((result) => result.testId === test.id)
        const completionCount = results.length
        const completionRate = memberCount > 0 ? (completionCount / memberCount) * 100 : 0
        const averageScore =
            completionCount > 0 ? results.reduce((sum, result) => sum + result.score, 0) / completionCount : 0

        return {
            id: test.id,
            name: test.name,
            subject: test.subject,
            completionCount,
            completionRate,
            averageScore,
        }
    })

    // Calculate student performance
    const studentPerformance: Record<string, { total: number; count: number; tests: string[] }> = {}

    for (const result of testResults) {
        const userId = result.user.id

        if (!studentPerformance[userId]) {
            studentPerformance[userId] = {
                total: 0,
                count: 0,
                tests: [],
            }
        }

        studentPerformance[userId].total += result.score
        studentPerformance[userId].count += 1
        studentPerformance[userId].tests.push(result.testId)
    }

    const studentPerformanceData = await Promise.all(
        Object.entries(studentPerformance).map(async ([userId, data]) => {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    firstName: true,
                    lastName: true,
                },
            })

            return {
                userId,
                name: user ? `${user.firstName} ${user.lastName}` : "Unknown",
                testsCompleted: data.count,
                averageScore: data.count > 0 ? data.total / data.count : 0,
                completionRate: tests.length > 0 ? (data.count / tests.length) * 100 : 0,
            }
        }),
    )

    // Calculate overall statistics
    const overallStats = {
        testCount: tests.length,
        memberCount,
        averageScore:
            testResults.length > 0 ? testResults.reduce((sum, result) => sum + result.score, 0) / testResults.length : 0,
        completionRate: tests.length > 0 && memberCount > 0 ? (testResults.length / (tests.length * memberCount)) * 100 : 0,
    }

    return {
        overall: overallStats,
        tests: testStats,
        students: studentPerformanceData,
    }
}

export async function getTestStats(testId: string) {
    // Get the test with questions
    const test = await prisma.test.findUnique({
        where: {
            id: testId,
        },
        include: {
            questions: true,
            classroom: {
                select: {
                    id: true,
                    _count: {
                        select: {
                            members: true,
                        },
                    },
                },
            },
        },
    })

    if (!test) {
        throw new Error("Test not found")
    }

    // Get test results
    const results = await prisma.testResult.findMany({
        where: {
            testId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                },
            },
            answers: {
                include: {
                    question: true,
                },
            },
        },
    })

    // Calculate overall statistics
    const completionCount = results.length
    const memberCount = test.classroom?._count.members || 0
    const completionRate = memberCount > 0 ? (completionCount / memberCount) * 100 : 0
    const averageScore =
        completionCount > 0 ? results.reduce((sum, result) => sum + result.score, 0) / completionCount : 0

    // Calculate question performance
    const questionPerformance = test.questions.map((question) => {
        const answers = results.flatMap((result) => result.answers.filter((answer) => answer.questionId === question.id))

        const correctCount = answers.filter((answer) => answer.isCorrect).length
        const correctRate = answers.length > 0 ? (correctCount / answers.length) * 100 : 0
        const averageScore =
            answers.length > 0 ? answers.reduce((sum, answer) => sum + answer.score, 0) / answers.length : 0

        return {
            id: question.id,
            text: question.text,
            type: question.type,
            correctRate,
            averageScore,
            maxScore: question.points,
        }
    })

    // Calculate student performance
    const studentPerformance = results.map((result) => {
        return {
            userId: result.user.id,
            name: `${result.user.firstName} ${result.user.lastName}`,
            score: result.score,
            timeSpent: result.timeSpent,
            completedAt: result.completedAt,
        }
    })

    return {
        overall: {
            completionCount,
            memberCount,
            completionRate,
            averageScore,
            highestScore: completionCount > 0 ? Math.max(...results.map((result) => result.score)) : 0,
            lowestScore: completionCount > 0 ? Math.min(...results.map((result) => result.score)) : 0,
        },
        questions: questionPerformance,
        students: studentPerformance,
    }
}


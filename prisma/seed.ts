import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    console.log("Starting database seed...")

    // Create users
    const hashedPassword = await bcrypt.hash("Password123!", 10)

    const teacher = await prisma.user.upsert({
        where: { email: "teacher@example.com" },
        update: {},
        create: {
            email: "teacher@example.com",
            firstName: "John",
            lastName: "Doe",
            password: hashedPassword,
        },
    })

    const student1 = await prisma.user.upsert({
        where: { email: "student1@example.com" },
        update: {},
        create: {
            email: "student1@example.com",
            firstName: "Emma",
            lastName: "Miller",
            password: hashedPassword,
        },
    })

    const student2 = await prisma.user.upsert({
        where: { email: "student2@example.com" },
        update: {},
        create: {
            email: "student2@example.com",
            firstName: "James",
            lastName: "Chen",
            password: hashedPassword,
        },
    })

    console.log("Created users")

    // Create classroom
    const classroom = await prisma.classroom.upsert({
        where: { joinCode: "PHY101" },
        update: {},
        create: {
            name: "Physics 101",
            description: "Introductory physics course covering mechanics, thermodynamics, and waves",
            subject: "Physics",
            gradeLevel: "Undergraduate",
            joinCode: "PHY101",
            ownerId: teacher.id,
        },
    })

    console.log("Created classroom")

    // Add students to classroom
    await prisma.classroomMember.upsert({
        where: {
            classroomId_userId: {
                classroomId: classroom.id,
                userId: student1.id,
            },
        },
        update: {},
        create: {
            classroomId: classroom.id,
            userId: student1.id,
            role: "student",
        },
    })

    await prisma.classroomMember.upsert({
        where: {
            classroomId_userId: {
                classroomId: classroom.id,
                userId: student2.id,
            },
        },
        update: {},
        create: {
            classroomId: classroom.id,
            userId: student2.id,
            role: "student",
        },
    })

    console.log("Added students to classroom")

    // Create test
    const test = await prisma.test.upsert({
        where: { id: "test-mechanics" },
        update: {},
        create: {
            id: "test-mechanics",
            name: "Mechanics Quiz",
            description: "A comprehensive quiz covering Newton's laws of motion, kinematics, and dynamics.",
            subject: "Physics",
            timeLimit: 30,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: "active",
            creatorId: teacher.id,
            classroomId: classroom.id,
        },
    })

    console.log("Created test")

    // Create questions
    const questions = [
        {
            id: "q1",
            text: "What is Newton's First Law of Motion?",
            type: "short-answer",
            answer:
                "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
            points: 10,
            testId: test.id,
        },
        {
            id: "q2",
            text: "A 2 kg object moving at 5 m/s has a momentum of:",
            type: "multiple-choice",
            options: JSON.stringify(["5 kg·m/s", "10 kg·m/s", "15 kg·m/s", "20 kg·m/s"]),
            answer: "10 kg·m/s",
            points: 5,
            testId: test.id,
        },
        {
            id: "q3",
            text: "The SI unit of force is:",
            type: "multiple-choice",
            options: JSON.stringify(["Joule", "Newton", "Watt", "Pascal"]),
            answer: "Newton",
            points: 5,
            testId: test.id,
        },
        {
            id: "q4",
            text: "An object accelerates at 10 m/s² when a force of 5 N is applied. What is the mass of the object?",
            type: "short-answer",
            answer: "0.5 kg",
            points: 10,
            testId: test.id,
        },
        {
            id: "q5",
            text: "The principle of conservation of momentum applies when:",
            type: "multiple-choice",
            options: JSON.stringify([
                "No external forces act on the system",
                "When two objects collide",
                "Only in elastic collisions",
                "Only in inelastic collisions",
            ]),
            answer: "No external forces act on the system",
            points: 10,
            testId: test.id,
        },
    ]

    for (const question of questions) {
        await prisma.question.upsert({
            where: { id: question.id },
            update: {},
            create: question,
        })
    }

    console.log("Created questions")

    // Create test result for student1
    const testResult = await prisma.testResult.upsert({
        where: {
            testId_userId: {
                testId: test.id,
                userId: student1.id,
            },
        },
        update: {},
        create: {
            score: 85,
            startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000), // 25 minutes after starting
            timeSpent: 25 * 60, // 25 minutes in seconds
            testId: test.id,
            userId: student1.id,
        },
    })

    console.log("Created test result")

    // Create answers for student1
    const answers = [
        {
            id: "a1",
            text: "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
            isCorrect: true,
            score: 10,
            testResultId: testResult.id,
            questionId: "q1",
        },
        {
            id: "a2",
            text: "10 kg·m/s",
            isCorrect: true,
            score: 5,
            testResultId: testResult.id,
            questionId: "q2",
        },
        {
            id: "a3",
            text: "Newton",
            isCorrect: true,
            score: 5,
            testResultId: testResult.id,
            questionId: "q3",
        },
        {
            id: "a4",
            text: "0.5 kg",
            isCorrect: true,
            score: 10,
            testResultId: testResult.id,
            questionId: "q4",
        },
        {
            id: "a5",
            text: "When two objects collide",
            isCorrect: false,
            score: 0,
            testResultId: testResult.id,
            questionId: "q5",
        },
    ]

    for (const answer of answers) {
        await prisma.answer.upsert({
            where: { id: answer.id },
            update: {},
            create: answer,
        })
    }

    console.log("Created answers")

    console.log("Database seed completed successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


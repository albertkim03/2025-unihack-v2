// @ts-nocheck

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get URL parameters
        const { searchParams } = new URL(request.url)
        const type = searchParams.get("type") || "created" // created, assigned
        const status = searchParams.get("status") // draft, active, completed, archived

        if (type === "created") {
            // Get tests created by the user
            const tests = await prisma.test.findMany({
                where: {
                    creatorId: session.user.id,
                    ...(status ? { status } : {}),
                },
                include: {
                    classroom: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    _count: {
                        select: {
                            questions: true,
                            results: true,
                        },
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
            })

            return NextResponse.json(tests)
        } else if (type === "assigned") {
            // Get tests assigned to the user (via classrooms they're members of)
            const memberClassrooms = await prisma.classroomMember.findMany({
                where: {
                    userId: session.user.id,
                },
                select: {
                    classroomId: true,
                },
            })

            const classroomIds = memberClassrooms.map((member) => member.classroomId)

            const tests = await prisma.test.findMany({
                where: {
                    classroomId: {
                        in: classroomIds,
                    },
                    ...(status ? { status } : {}),
                },
                include: {
                    classroom: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    creator: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                    _count: {
                        select: {
                            questions: true,
                        },
                    },
                    results: {
                        where: {
                            userId: session.user.id,
                        },
                        select: {
                            id: true,
                            score: true,
                            completedAt: true,
                        },
                    },
                },
                orderBy: {
                    updatedAt: "desc",
                },
            })

            return NextResponse.json(tests)
        }

        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    } catch (error) {
        console.error("Error fetching tests:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        const {testName, subject, topics, questionCount, questionTypes, content} = body

        console.log(body)
        let types = "";
        if (questionTypes.multipleChoice) {
            types += "multiple choice"
        }

        console.log(types)

        if (questionTypes.trueFalse) {
            if (types.length > 0) {
                types += ", "
            }
            types += "true / false"
        }

        console.log(types)


        if (questionTypes.shortAnswer) {
            if (types.length > 0) {
                types += ", "
            }
            types += "short answer"
        }

        console.log(types)

        console.log("hit3")

        if (!testName || !subject || !topics || !questionCount || !types || !content) {
            return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log("hit4")
        try {
            const prompt = `Generate ${questionCount} questions for a test named "${testName}" on the subject "${subject}" covering topics ${topics}. 
    Use the following content as reference:
    """
    ${content}
    """
    The questions should be of types: ${types}.
    Format each question as:
    {
      "text": "The question text",
      "type": "multiple-choice | true-false | short-answer",
      "options": ["option 1", "option 2", "option 3", "option 4"] (only for multiple-choice or true-false),
      "answer": "Correct answer" (give the 0-index position of the correct option for multiple choice / true false, give an exemplar sample answer for short answer question),
      "points": 1 (or allocated marks for short-answer based on context)
    }
    The overall format MUST be {"questions": [{question1}, {question2}]}
    you MUST just answer with the json data beginning with { and ending with }`;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'system', content: 'You are an AI that generates test questions in JSON format.' }, { role: 'user', content: prompt }],
                    temperature: 0.7,
                }),
            });

            const data = await response.json();
            console.log(JSON.stringify(data))
            return new Response(JSON.stringify(data.choices[0].message.content), { status: 200 });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {

    }

}

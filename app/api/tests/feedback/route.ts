// @ts-nocheck

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { questionText, correctAnswer } = await request.json()

    // Build a prompt to generate a short explanation
    const prompt = `Provide a short explanation (1-2 sentences) for why the following answer is correct.

Question: "${questionText}"
Correct Answer: "${correctAnswer}"

Explanation:`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert tutor who provides concise and clear explanations." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    })

    const data = await response.json()
    const feedback = data.choices[0].message.content.trim()

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error generating AI feedback:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

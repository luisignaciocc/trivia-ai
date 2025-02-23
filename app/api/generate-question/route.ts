import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  const { topic, previousQuestions } = await req.json()

  const prompt = `Generate a multiple-choice trivia question about ${topic} with 4 options. 
  Provide the correct answer and a brief explanation. 
  Format the response as a JSON object with the following structure:
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of the correct answer"
  }
  Ensure the question is not too similar to any of these previous questions: ${previousQuestions.join(", ")}`

  try {
    const result = await streamText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    const questionData = JSON.parse(result.text)

    // Generate embedding for the new question
    const embeddingResponse = await openaiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: questionData.question,
    })
    const embedding = embeddingResponse.data[0].embedding

    // Store the embedding in Supabase
    await supabase.from("question_embeddings").insert({
      question: questionData.question,
      embedding: embedding,
    })

    return NextResponse.json(questionData)
  } catch (error) {
    console.error("Error generating question:", error)
    return NextResponse.json({ error: "Failed to generate question" }, { status: 500 })
  }
}


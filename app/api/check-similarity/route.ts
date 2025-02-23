import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  const { question } = await req.json()

  try {
    // Generate embedding for the new question
    const embeddingResponse = await openaiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: question,
    })
    const embedding = embeddingResponse.data[0].embedding

    // Query Supabase for similar questions
    const { data: similarQuestions, error } = await supabase.rpc("match_questions", {
      query_embedding: embedding,
      match_threshold: 0.8,
      match_count: 5,
    })

    if (error) {
      throw error
    }

    const isSimilar = similarQuestions.length > 0

    return NextResponse.json({ isSimilar, similarQuestions })
  } catch (error) {
    console.error("Error checking similarity:", error)
    return NextResponse.json({ error: "Failed to check similarity" }, { status: 500 })
  }
}


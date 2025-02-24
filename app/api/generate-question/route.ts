import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TriviaQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
  explanation: z.string(),
  hint: z.string(),
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function retryOperation<T>(
  operation: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
  throw new Error("Maximum retries reached");
}

export async function POST(req: Request) {
  const { topic, previousQuestions, language } = await req.json();

  try {
    const completion = await retryOperation(() =>
      openaiClient.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a trivia question generator. Create engaging and accurate multiple-choice questions with helpful hints that don't directly give away the answer. Generate the content in ${
              language === "es" ? "Spanish" : "English"
            }.`,
          },
          {
            role: "user",
            content: `Generate a multiple-choice trivia question about ${topic} with a subtle hint that helps think about the answer without giving it away directly. 
              Ensure it's not similar to these previous questions: ${previousQuestions.join(
                ", "
              )}`,
          },
        ],
        response_format: zodResponseFormat(TriviaQuestion, "trivia_question"),
      })
    );

    const questionData = completion.choices[0]?.message.parsed;
    if (!questionData) {
      return NextResponse.json(
        { error: "Failed to generate question data" },
        { status: 500 }
      );
    }

    return NextResponse.json(questionData);
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}

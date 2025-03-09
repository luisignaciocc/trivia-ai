import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

export const maxDuration = 60;

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1. Define el esquema de tu pregunta.
const TriviaQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number(),
  explanation: z.string(),
  hint: z.string(),
});

// 2. Define el esquema de evaluación (los campos que esperamos del evaluador).
const EvaluationSchema = z.object({
  clarity: z.number(),
  difficulty: z.number(),
  uniqueness: z.number(),
  explanationQuality: z.number(),
  hintQuality: z.number(),
  overallVerdict: z.enum(["pass", "fail"]),
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const MAX_EVAL_ITERATIONS = 2; // Controla cuántas veces intentas "arreglar" la pregunta

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

  // 1. Generación inicial
  async function generateQuestion() {
    return await retryOperation(() =>
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
  }

  // 2. Evaluación de la pregunta (ahora incluye la lista de `previousQuestions`)
  async function evaluateQuestion(
    questionData: z.infer<typeof TriviaQuestion>,
    previousQs: string[]
  ) {
    // Incluimos aquí la lógica para que el modelo evalúe originalidad también.
    const evaluationPrompt = `
    You are an expert trivia evaluator. 

    We have a trivia question with the following fields:
    Question: ${questionData.question}
    Options: ${JSON.stringify(questionData.options)}
    Correct answer index: ${questionData.correctAnswer}
    Explanation: ${questionData.explanation}
    Hint: ${questionData.hint}

    We also have these previously asked questions:
    ${previousQs.map((q, i) => `Q${i + 1}: ${q}`).join("\n")}

    Please evaluate the following criteria on a scale from 1 to 10:
    1. Clarity: Is the question well-phrased and clear?
    2. Difficulty: Is it neither too easy nor too difficult?
    3. Uniqueness: Does this question differ enough from any in the list above?
       - If it is too similar to any previous question, set uniqueness < 7.
       - If it is essentially a repeat, you may set uniqueness very low (e.g., 1 or 2).
    4. ExplanationQuality: Does the explanation match the correct answer and is it helpful?
    5. HintQuality: Is the hint subtle yet helpful?

    Then provide an overall "pass" or "fail" based on whether each score is >=7
    or if it is too similar (i.e., uniqueness <7) to any existing question in the list.
    `;

    return await retryOperation(() =>
      openaiClient.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a professional quiz evaluator. Provide a numeric evaluation of the question data.",
          },
          {
            role: "user",
            content: evaluationPrompt,
          },
        ],
        response_format: zodResponseFormat(EvaluationSchema, "eval"),
      })
    );
  }

  // 3. Optimizar/Reintentar si la evaluación no pasa
  async function optimizeQuestion(
    questionData: z.infer<typeof TriviaQuestion>,
    evaluation: z.infer<typeof EvaluationSchema>
  ) {
    const improvementPrompt = `
      The question did not pass the evaluation.
      Scores were:
      - Clarity: ${evaluation.clarity}
      - Difficulty: ${evaluation.difficulty}
      - Uniqueness: ${evaluation.uniqueness}
      - ExplanationQuality: ${evaluation.explanationQuality}
      - HintQuality: ${evaluation.hintQuality}

      Provide an improved version of the question that addresses the shortcomings:
      - If clarity < 7, make it clearer.
      - If difficulty < 7, adjust difficulty.
      - If uniqueness < 7, make it more original so it differs enough from previous questions.
      - If explanationQuality < 7, provide a more coherent or complete explanation.
      - If hintQuality < 7, improve the hint so it's subtle but useful.

      Current question:
      Question: ${questionData.question}
      Options: ${JSON.stringify(questionData.options)}
      Correct answer index: ${questionData.correctAnswer}
      Explanation: ${questionData.explanation}
      Hint: ${questionData.hint}
    `;

    // Reutilizamos el mismo schema TriviaQuestion para parsear la respuesta corregida
    return await retryOperation(() =>
      openaiClient.beta.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a trivia question generator. Improve the question based on the evaluation feedback. Generate the content in ${
              language === "es" ? "Spanish" : "English"
            }.`,
          },
          {
            role: "user",
            content: improvementPrompt,
          },
        ],
        response_format: zodResponseFormat(TriviaQuestion, "trivia_question"),
      })
    );
  }

  try {
    // ---- Paso 1: Generar la pregunta inicial
    let completion = await generateQuestion();
    let questionData = completion.choices[0]?.message.parsed;

    if (!questionData) {
      return NextResponse.json(
        { error: "Failed to generate question data" },
        { status: 500 }
      );
    }

    // ---- Paso 2: Intentar evaluar y optimizar, con un máximo de iteraciones
    let iterations = 0;
    while (iterations < MAX_EVAL_ITERATIONS) {
      const evaluationResult = await evaluateQuestion(
        questionData,
        previousQuestions
      );
      const evalData = evaluationResult.choices[0]?.message.parsed;

      if (!evalData) {
        // Si no podemos evaluar por algún error, devolvemos la pregunta como está
        break;
      }

      if (evalData.overallVerdict === "pass") {
        // La pregunta pasa; la devolvemos
        return NextResponse.json(questionData);
      }

      // Si falló la evaluación (por ejemplo, por ser duplicada o cualquier otro criterio),
      // tratamos de "arreglarla" en otra llamada
      const optimized = await optimizeQuestion(questionData, evalData);
      const optimizedData = optimized.choices[0]?.message.parsed;
      if (!optimizedData) {
        // Si no se pudo optimizar, salimos
        break;
      }

      questionData = optimizedData;
      iterations++;
    }

    // Si terminas las iteraciones de mejora y no obtuviste un pass, devuelves
    // lo último que generaste (incluso si no cumple criterios).
    return NextResponse.json(questionData);
  } catch (error) {
    console.error("Error generating or optimizing question:", error);
    return NextResponse.json(
      { error: "Failed to generate or optimize question" },
      { status: 500 }
    );
  }
}

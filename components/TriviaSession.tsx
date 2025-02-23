"use client"

import { useState, useEffect } from "react"
import Question from "./Question"

interface TriviaSessionProps {
  topic: string
}

interface QuestionData {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function TriviaSession({ topic }: TriviaSessionProps) {
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [sessionEnded, setSessionEnded] = useState(false)

  useEffect(() => {
    // Here we'll add the logic to fetch the first question
  }, [])

  const handleAnswer = (selectedAnswer: number) => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < 29) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      // Here we'll add the logic to fetch the next question
    } else {
      setSessionEnded(true)
    }
  }

  if (sessionEnded) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Trivia Session Ended</h2>
        <p className="text-xl mb-4">Your score: {score} / 30</p>
        {score >= 27 ? (
          <p className="text-green-500 font-bold">Congratulations! You won!</p>
        ) : (
          <p className="text-red-500 font-bold">Sorry, you didn't reach the winning score.</p>
        )}
      </div>
    )
  }

  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    return <div>Loading question...</div>
  }

  return (
    <Question
      questionData={questions[currentQuestionIndex]}
      onAnswer={handleAnswer}
      questionNumber={currentQuestionIndex + 1}
    />
  )
}


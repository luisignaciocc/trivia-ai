"use client";

import { useState } from "react";

interface QuestionProps {
  questionData: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  onAnswer: (selectedAnswer: number) => void;
  questionNumber: number;
}

export default function Question({
  questionData,
  onAnswer,
  questionNumber,
}: QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    onAnswer(selectedAnswer!);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Question {questionNumber}</h2>
      <p className="text-xl">{questionData.question}</p>
      <div className="space-y-2">
        {questionData.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelectAnswer(index)}
            className={`w-full p-2 text-left border rounded ${
              selectedAnswer === index
                ? index === questionData.correctAnswer
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : "bg-white"
            }`}
            disabled={showExplanation}
          >
            {option}
          </button>
        ))}
      </div>
      {showExplanation && (
        <div className="mt-4">
          <p className="font-bold">Explanation:</p>
          <p>{questionData.explanation}</p>
          <button
            onClick={handleNextQuestion}
            className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}

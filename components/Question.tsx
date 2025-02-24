"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const translations = {
  en: {
    question: "Oracle's Query",
    score: "Knowledge Points",
    correct: "The Oracle acknowledges your wisdom! ✨",
    incorrect: "The Oracle reveals the truth:",
    nextQuestion: "Face Next Challenge",
    hint: "Consult the Grimoire",
    hintsRemaining: "Grimoire charges",
    hintReveal: "The Grimoire whispers:",
  },
  es: {
    question: "Pregunta del Oráculo",
    score: "Puntos de Conocimiento",
    correct: "¡El Oráculo reconoce tu sabiduría! ✨",
    incorrect: "El Oráculo revela la verdad:",
    nextQuestion: "Enfrentar Siguiente Desafío",
    hint: "Consultar el Grimorio",
    hintsRemaining: "Cargas del Grimorio",
    hintReveal: "El Grimorio susurra:",
  },
};

interface QuestionProps {
  questionData: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    hint: string;
  };
  onAnswer: (selectedAnswer: number) => void;
  questionNumber: number;
  score: number;
  hintsRemaining: number;
  onUseHint: () => void;
}

export default function Question({
  questionData,
  onAnswer,
  questionNumber,
  score,
  hintsRemaining,
  onUseHint,
}: QuestionProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    onAnswer(selectedAnswer!);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowHint(false);
  };

  const handleUseHint = () => {
    if (hintsRemaining > 0 && !showHint) {
      setShowHint(true);
      onUseHint();
      // Agregar efecto de sonido o vibración aquí si lo deseas
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-3 sm:p-4 md:p-6 bg-gray-900/60 backdrop-blur-md rounded-xl border border-yellow-400/20"
    >
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-sm font-medium text-yellow-400">
              {t.question} {questionNumber}
            </span>
            {hintsRemaining > 0 && !showHint && (
              <button
                onClick={handleUseHint}
                className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-yellow-400 bg-purple-900/50 rounded-full hover:bg-purple-800/50 transition-colors border border-yellow-400/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm1-11h-2v5h2v-5zm0 6h-2v2h2v-2z" />
                </svg>
                {t.hint}
                <span className="bg-purple-800/50 px-1.5 rounded-full">
                  {hintsRemaining}
                </span>
              </button>
            )}
          </div>
          <span className="px-3 py-1 text-sm font-medium text-yellow-400 bg-purple-900/50 rounded-full border border-yellow-400/30 self-start sm:self-auto">
            {t.score}: {score}/30
          </span>
        </div>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-3 p-4 bg-purple-900/50 border border-yellow-400/30 rounded-lg text-yellow-400 text-sm backdrop-blur-sm relative overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              <div className="flex items-center gap-2 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 1.5c-1.921 0-3.816.111-5.68.327-1.497.174-2.57 1.46-2.57 2.93V21.75a.75.75 0 001.029.696l3.471-1.388 3.472 1.388a.75.75 0 00.556 0l3.472-1.388 3.471 1.388a.75.75 0 001.029-.696V4.757c0-1.47-1.073-2.756-2.57-2.93A49.255 49.255 0 0012 1.5z" />
                </svg>
                <span className="font-semibold">{t.hintReveal}</span>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                {questionData.hint}
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.1 }}
              className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"
            />
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl font-bold text-yellow-200"
        >
          {questionData.question}
        </motion.h2>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {questionData.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelectAnswer(index)}
            className={`w-full p-3 sm:p-4 text-left border-2 rounded-lg transition-all transform hover:scale-[1.01] ${
              showExplanation
                ? index === questionData.correctAnswer
                  ? "border-green-400 bg-green-900/50 text-green-300"
                  : selectedAnswer === index
                  ? "border-red-400 bg-red-900/50 text-red-300"
                  : "border-gray-600 bg-gray-800/50 text-gray-300"
                : "border-gray-600 hover:border-yellow-400/50 hover:bg-purple-800/50 text-gray-200"
            } backdrop-blur-sm`}
            disabled={showExplanation}
          >
            <div className="flex items-center">
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mr-3 text-sm ${
                  showExplanation && index === questionData.correctAnswer
                    ? "border-green-400 bg-green-900/50"
                    : showExplanation && selectedAnswer === index
                    ? "border-red-400 bg-red-900/50"
                    : "border-gray-600 bg-gray-800/50"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </div>
          </motion.button>
        ))}
      </div>

      {showExplanation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/90 rounded-xl p-6 max-w-xl w-full border border-yellow-400/20"
          >
            <div className="flex items-center gap-2 mb-4">
              {selectedAnswer === questionData.correctAnswer ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-green-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-red-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <p className="font-bold text-lg">
                {selectedAnswer === questionData.correctAnswer ? (
                  <span className="text-green-400">{t.correct}</span>
                ) : (
                  <span className="text-red-400">
                    {t.incorrect}{" "}
                    {questionData.options[questionData.correctAnswer]}
                  </span>
                )}
              </p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg border border-yellow-400/10 mb-6">
              <p className="text-gray-300">{questionData.explanation}</p>
            </div>

            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg hover:shadow-yellow-400/20 transition-all shadow-lg font-medium"
              >
                {t.nextQuestion}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

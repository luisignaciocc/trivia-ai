"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Question from "./Question";
import { useLanguage } from "../contexts/LanguageContext";
import { TOTAL_QUESTIONS, REQUIRED_SCORE } from "../constants/game";

interface TriviaSessionProps {
  topic: string;
  totalHints: number; // Add this line
}

interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint: string;
}

const loadingMessages = {
  es: [
    "El Oráculo hojea sus pergaminos prohibidos en busca de un acertijo digno de desafiarte...",
    "El Oráculo convoca a los espíritus del desconocimiento para forjar su siguiente desafío...",
    "Un antiguo códice se despliega lentamente... la próxima pregunta está por revelarse.",
    "El Oráculo bucea en el Abismo de la Ignorancia... ¿Qué misterio sacará a la luz?",
    "El Oráculo mezcla verdades y mentiras en su caldero de enigmas… ¿Qué surgirá?",
    "Los ecos del conocimiento perdido resuenan en la cámara… La siguiente pregunta se materializa.",
    "Las estrellas del saber se alinean... Una nueva pregunta emerge del cosmos.",
    "El Oráculo consulta con las sombras de la sabiduría antigua...",
    "Los engranajes del conocimiento giran lentamente... preparando tu próximo desafío.",
    "El velo del misterio se agita... una nueva pregunta toma forma.",
  ],
  en: [
    "The Oracle browses through forbidden scrolls in search of a riddle worthy of challenging you...",
    "The Oracle summons the spirits of unknowing to forge the next challenge...",
    "An ancient codex unfolds slowly... the next question is about to be revealed.",
    "The Oracle dives into the Abyss of Ignorance... What mystery will come to light?",
    "The Oracle mixes truths and lies in their cauldron of enigmas... What will emerge?",
    "The echoes of lost knowledge resonate in the chamber... The next question materializes.",
    "The stars of knowledge align... A new question emerges from the cosmos.",
    "The Oracle consults with the shadows of ancient wisdom...",
    "The gears of knowledge turn slowly... preparing your next challenge.",
    "The veil of mystery stirs... a new question takes shape.",
  ],
};

const translations = {
  en: {
    loading: "Generating question...",
    progress: "Battle Progress",
    completed: "The Challenge Ends!",
    congratulations:
      "The Oracle has been defeated! The Flame of Knowledge is yours! ✨",
    keepTrying: "The Oracle's wisdom prevails... Try again, brave soul!",
    playAgain: "Challenge the Oracle Again",
    error: {
      title: "The Oracle is Meditating",
      message:
        "The Oracle has retreated into deep meditation to restore their cosmic energy. Please try again in a few moments, brave seeker of knowledge.",
      retryButton: "Try to Challenge Again",
    },
    exitButton: "Abandon Trial",
    exitConfirm: {
      title: "Abandon the Challenge?",
      message:
        "Are you sure you wish to retreat from the Oracle's trial? Your progress will be lost in the mists of time.",
      confirmButton: "Yes, I Yield",
      cancelButton: "No, Continue the Trial",
    },
  },
  es: {
    loading: "Generando pregunta...",
    progress: "Progreso de la Batalla",
    completed: "¡El Desafío Termina!",
    congratulations:
      "¡Has derrotado al Oráculo! ¡La Llama del Conocimiento es tuya! ✨",
    keepTrying:
      "La sabiduría del Oráculo prevalece... ¡Inténtalo de nuevo, alma valiente!",
    playAgain: "Desafiar al Oráculo de Nuevo",
    error: {
      title: "El Oráculo está Meditando",
      message:
        "El Oráculo se ha retirado a meditar profundamente para restaurar su energía cósmica. Por favor, intenta de nuevo en unos momentos, valiente buscador del conocimiento.",
      retryButton: "Intentar Desafiar de Nuevo",
    },
    exitButton: "Abandonar Prueba",
    exitConfirm: {
      title: "¿Abandonar el Desafío?",
      message:
        "¿Estás seguro de que deseas retirarte de la prueba del Oráculo? Tu progreso se perderá en las brumas del tiempo.",
      confirmButton: "Sí, Me Rindo",
      cancelButton: "No, Continuar la Prueba",
    },
  },
};

export default function TriviaSession({
  topic,
  totalHints,
}: TriviaSessionProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [loadingMessage, setLoadingMessage] = useState("");

  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hintsRemaining, setHintsRemaining] = useState(totalHints);
  const [error, setError] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const fetchQuestionWithRetry = async (retries = 3) => {
    try {
      setError(false);
      setIsLoading(true);

      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          const response = await fetch("/api/generate-question", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic,
              previousQuestions: questions.map((q) => q.question),
              language,
            }),
          });

          if (!response.ok) throw new Error("Failed to fetch question");

          const questionData = await response.json();
          setQuestions((prev) => [...prev, questionData]);
          setIsLoading(false);
          return;
        } catch (err) {
          if (attempt === retries - 1) throw err;
          // Esperar 1 segundo antes de reintentar
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionWithRetry();
  }, []);

  useEffect(() => {
    if (isLoading) {
      const messages = loadingMessages[language];
      const randomIndex = Math.floor(Math.random() * messages.length);
      setLoadingMessage(messages[randomIndex]);
    }
  }, [isLoading, language]);

  const handleAnswer = async (selectedAnswer: number) => {
    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      // Usar constante
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsLoading(true);
      await fetchQuestionWithRetry();
    } else {
      setSessionEnded(true);
    }
  };

  const handleUseHint = () => {
    setHintsRemaining((prev) => prev - 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-full py-4 sm:py-8 backdrop-blur-md">
        <div className="max-w-2xl mx-auto p-3 sm:p-4 md:p-6 bg-gray-900/60 backdrop-blur-md rounded-xl border border-yellow-400/20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <span className="inline-block px-6 py-3 text-yellow-200 rounded-xl text-lg font-medium backdrop-blur-sm">
              {loadingMessage}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-full flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4"
      >
        <div className="max-w-md w-full bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-8 border border-yellow-400/20 text-center">
          <h2 className="text-3xl font-bold mb-4 text-yellow-400">
            {t.error.title}
          </h2>
          <p className="text-gray-300 mb-8">{t.error.message}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-medium shadow-lg hover:shadow-yellow-400/20 transition-all"
          >
            {t.error.retryButton}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (sessionEnded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-full flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full bg-gray-900/90 backdrop-blur-md rounded-xl shadow-lg p-8 border border-yellow-400/20">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            {t.completed}
          </h2>
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold mb-4 text-yellow-400">
              {score}/{TOTAL_QUESTIONS}
            </div>
            <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
                style={{ width: `${(score / TOTAL_QUESTIONS) * 100}%` }}
              ></div>
            </div>
            {score >= REQUIRED_SCORE ? (
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-400 font-bold text-xl"
              >
                {t.congratulations}
              </motion.p>
            ) : (
              <p className="text-yellow-200 text-xl">{t.keepTrying}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.reload()}
              className="mt-6 w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-medium shadow-lg hover:shadow-yellow-400/20 transition-all duration-200"
            >
              {t.playAgain}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-full py-4 sm:py-8 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-yellow-400 bg-purple-900/50 rounded-lg hover:bg-purple-800/50 transition-colors border border-yellow-400/30 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M7.28 7.72a.75.75 0 010 1.06l-2.47 2.47H21a.75.75 0 010 1.5H4.81l2.47 2.47a.75.75 0 11-1.06 1.06l-3.75-3.75a.75.75 0 010-1.06l3.75-3.75a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
            {t.exitButton}
          </button>
        </div>
        <div className="mb-3 sm:mb-8 bg-gray-900/60 p-3 sm:p-4 rounded-lg border border-yellow-400/20">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-yellow-400 font-medium">{t.progress}</h3>
            <span className="text-sm text-yellow-400 bg-purple-900/50 px-3 py-1 rounded-full border border-yellow-400/30">
              {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
            </span>
          </div>
          <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100
                }%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-yellow-400/60">
            <span>Trial Begins</span>
            <span>Victory</span>
          </div>
        </div>
        <Question
          questionData={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          score={score}
          hintsRemaining={hintsRemaining}
          onUseHint={handleUseHint}
        />
        {showExitConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900/90 rounded-xl p-6 max-w-md w-full border border-yellow-400/20"
            >
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                {t.exitConfirm.title}
              </h3>
              <p className="text-gray-300 mb-6">{t.exitConfirm.message}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 px-4 py-2 bg-red-600/50 hover:bg-red-600/70 text-white rounded-lg transition-colors border border-red-500/30"
                >
                  {t.exitConfirm.confirmButton}
                </button>
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 px-4 py-2 bg-purple-900/50 hover:bg-purple-800/50 text-yellow-400 rounded-lg transition-colors border border-yellow-400/30"
                >
                  {t.exitConfirm.cancelButton}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TriviaSession from "../components/TriviaSession";
import { useLanguage } from "../contexts/LanguageContext";
import StoryPopup from "../components/StoryPopup";
import { TOTAL_QUESTIONS, REQUIRED_SCORE } from "../constants/game";

const translations = {
  en: {
    title: "Trivia Wars",
    subtitle: "The Oracle's Challenge",
    description: `Face the Oracle of Ignorance in a battle of knowledge. Answer ${REQUIRED_SCORE} out of ${TOTAL_QUESTIONS} questions correctly to claim the Flame of Knowledge and save humanity from eternal ignorance.`,
    topicLabel: "Choose Your Battlefield",
    topicPlaceholder: "Enter the domain of knowledge you wish to challenge...",
    startButton: "Accept the Challenge",
    infoButton: "The Legend",
    hintsLabel: "Grimoire of Wisdom Charges",
    hintsDescription: "Choose your mystical aids wisely",
  },
  es: {
    title: "Trivia Wars",
    subtitle: "El Desafío del Oráculo",
    description: `Enfrenta al Oráculo de la Ignorancia en una batalla de conocimiento. Responde ${REQUIRED_SCORE} de ${TOTAL_QUESTIONS} preguntas correctamente para reclamar la Llama del Conocimiento y salvar a la humanidad de la ignorancia eterna.`,
    topicLabel: "Elige tu Campo de Batalla",
    topicPlaceholder:
      "Ingresa el dominio de conocimiento que deseas desafiar...",
    startButton: "Aceptar el Desafío",
    infoButton: "La Leyenda",
    hintsLabel: "Cargas del Grimorio de la Sabiduría",
    hintsDescription: "Elige tus ayudas místicas sabiamente",
  },
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [showStory, setShowStory] = useState(false);
  const [hints, setHints] = useState(3);
  const t = translations[language];

  useEffect(() => {
    const hasSeenStory = sessionStorage.getItem("hasSeenStory");
    if (!hasSeenStory) {
      setShowStory(true);
    }
  }, []);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      setSessionStarted(true);
    }
  };

  const handleCloseStory = () => {
    setShowStory(false);
    sessionStorage.setItem("hasSeenStory", "true");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-3 sm:p-4 flex items-center">
      <div className="w-full">
        {!sessionStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-4 sm:p-8 md:p-12 max-w-md mx-auto border border-white/20"
          >
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setShowStory(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 transition-all"
                aria-label={t.infoButton}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="inline-flex rounded-lg border border-gray-200">
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-4 py-2 rounded-l-lg ${
                    language === "es"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  🇪🇸 ES
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 rounded-r-lg ${
                    language === "en"
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  🇬🇧 EN
                </button>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-1 sm:mb-2 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-3 sm:mb-6 text-purple-200">
              {t.subtitle}
            </h2>
            <p className="text-sm sm:text-base text-gray-200 text-center mb-4 sm:mb-8 leading-relaxed">
              {t.description}
            </p>
            <form
              onSubmit={handleStartSession}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  {t.topicLabel}
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t.topicPlaceholder}
                  className="w-full p-3 border border-purple-300/20 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">
                  {t.hintsLabel}
                </label>
                <input
                  type="range"
                  min="0"
                  max={TOTAL_QUESTIONS} // Cambiar el máximo de hints para que coincida con el total de preguntas
                  value={hints}
                  onChange={(e) => setHints(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-300/20 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <div className="flex justify-between text-sm text-purple-200 mt-1">
                  <span>{hints}</span>
                  <span>{t.hintsDescription}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-medium shadow-lg hover:shadow-yellow-400/20 transition-all duration-200"
              >
                {t.startButton}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <TriviaSession topic={topic} totalHints={hints} />
        )}
      </div>
      <StoryPopup isOpen={showStory} onClose={handleCloseStory} />
    </main>
  );
}

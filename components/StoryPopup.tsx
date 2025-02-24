"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { TOTAL_QUESTIONS, REQUIRED_SCORE } from "../constants/game";

interface StoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const storyContent = {
  es: {
    title: "Trivia Wars: El Desafío del Oráculo",
    content: `En un mundo donde el conocimiento es poder, una oscura entidad conocida como El Oráculo de la Ignorancia ha sumido a la humanidad en un letargo de desinformación. Este ser enigmático, un sabio caído obsesionado con borrar el saber de la faz de la Tierra, desafía a los más brillantes a un duelo de inteligencia en su enigmática Cámara del Olvido.

    Cada mil años, un valiente es seleccionado para enfrentarlo en el Gran Desafío, un duelo de preguntas donde solo la astucia y la erudición pueden salvar a la humanidad de caer en la ignorancia eterna. Ahora, el elegido eres tú.

    El Oráculo te lanzará ${TOTAL_QUESTIONS} preguntas de todo tipo, desde historia hasta ciencia, pasando por cultura general y lógica. Para derrotarlo y reclamar la Llama del Conocimiento, debes demostrar tu dominio respondiendo al menos ${REQUIRED_SCORE} preguntas correctamente. Si no alcanzas este nivel de sabiduría, el Oráculo sellará tu mente en la Cámara del Olvido, condenando al mundo a su reinado de confusión.

    Pero no estás solo. En tu travesía, contarás con El Grimorio de la Sabiduría, un antiguo tomo que puede ofrecerte pistas limitadas si las usas sabiamente. Sin embargo, el Oráculo es astuto y te pondrá trampas en forma de preguntas con engaños sutiles.

    ¿Podrás vencerlo y restaurar el conocimiento en el mundo? ¿O serás otro alma perdida en el laberinto de la ignorancia?

    ¡La batalla por la verdad comienza ahora!`,
    closeButton: "¡Entendido!",
  },
  en: {
    title: "Trivia Wars: The Oracle's Challenge",
    content: `In a world where knowledge is power, a dark entity known as The Oracle of Ignorance has plunged humanity into a state of misinformation. This enigmatic being, a fallen sage obsessed with erasing knowledge from the face of the Earth, challenges the brightest minds to a battle of wits in their mysterious Chamber of Oblivion.

    Every thousand years, a brave soul is selected to face them in the Great Challenge, a duel of questions where only wit and erudition can save humanity from falling into eternal ignorance. Now, you are the chosen one.

    The Oracle will pose ${TOTAL_QUESTIONS} questions of all kinds, from history to science, including general knowledge and logic. To defeat them and claim the Flame of Knowledge, you must prove your mastery by answering at least ${REQUIRED_SCORE} questions correctly. If you fail to reach this level of wisdom, the Oracle will seal your mind in the Chamber of Oblivion, condemning the world to their reign of confusion.

    But you're not alone. In your journey, you'll have the Grimoire of Wisdom, an ancient tome that can offer limited hints if used wisely. However, the Oracle is cunning and will set traps in the form of questions with subtle deceptions.

    Can you defeat them and restore knowledge to the world? Or will you be another lost soul in the labyrinth of ignorance?

    The battle for truth begins now!`,
    closeButton: "Got it!",
  },
};

export default function StoryPopup({ isOpen, onClose }: StoryPopupProps) {
  const { language } = useLanguage();
  const t = storyContent[language];

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Solo cerrar si el clic fue directamente en el backdrop
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900/90 rounded-xl max-w-2xl max-h-[80vh] overflow-y-auto p-6 md:p-8 relative cursor-default border border-yellow-400/20"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              {t.title}
            </h2>

            <div className="prose prose-sm md:prose-base prose-invert">
              {t.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 rounded-lg font-medium shadow-lg hover:shadow-yellow-400/20 transition-all duration-200"
            >
              {t.closeButton}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

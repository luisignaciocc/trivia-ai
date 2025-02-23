"use client";

import type React from "react";

import { useState } from "react";
import TriviaSession from "../components/TriviaSession";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      setSessionStarted(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">AI Trivia Generator</h1>
      {!sessionStarted ? (
        <form onSubmit={handleStartSession} className="space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic for your trivia"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Start Trivia Session
          </button>
        </form>
      ) : (
        <TriviaSession topic={topic} />
      )}
    </main>
  );
}

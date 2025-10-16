"use client";

import { useEffect, useState } from "react";
import {
  getCardsServer,
  checkAnswerServer,
  getNextCardServer,
} from "./serverside";

interface Card {
  id: number;
  category_id: number;
  question: string;
  answer: string;
}

export default function PlayPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<"sequential" | "random">("sequential");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  useEffect(() => {
    getCardsServer().then((data) => setCards(data || []));
  }, []);

  const handleCheck = async () => {
    const currentCard = cards[currentIndex];
    const { correct, correctAnswer } = await checkAnswerServer(
      currentCard.id,
      userAnswer
    );

    if (correct) {
      setResult("Correct!");
      setCorrectCount((c) => c + 1);
    } else {
      setResult(`Wrong! The correct answer is: ${correctAnswer}`);
      setWrongCount((w) => w + 1);
    }
  };

  const handleNext = async () => {
    const nextIndex = await getNextCardServer(cards, currentIndex, mode);
    setCurrentIndex(nextIndex);
    setUserAnswer("");
    setResult(null);
  };

  if (!cards.length)
    return <p className="text-center mt-10">Loading cards...</p>;

  const card = cards[currentIndex];

  return (
    <main className="p-6 max-w-md mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold">Play Mode</h1>

      {/* modevisuals */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setMode("sequential")}
          className={`px-3 py-1 rounded ${
            mode === "sequential" ? "bg-gray-800 text-white" : "bg-gray-950"
          }`}
        >
          Sequential
        </button>
        <button
          onClick={() => setMode("random")}
          className={`px-3 py-1 rounded ${
            mode === "random" ? "bg-gray-800 text-white" : "bg-gray-950"
          }`}
        >
          Random
        </button>
      </div>

      {/* flashcard visuasl */}
      <div className="border rounded p-4 text-left">
        <p className="font-semibold mb-2">{card.question}</p>
        <input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer"
          className="border p-2 w-full rounded mb-2"
        />
        {result ? (
          <>
            <p
              className={`${
                result.includes("Correct") ? "text-green-600" : "text-red-600"
              }`}
            >
              {result}
            </p>
            <button
              onClick={handleNext}
              className="bg-gray-700 text-white px-4 py-1 rounded mt-2"
            >
              Next
            </button>
          </>
        ) : (
          <button
            onClick={handleCheck}
            className="bg-gray-700 text-white px-4 py-1 rounded"
          >
            check
          </button>
        )}
      </div>
      <div className="text-sm text-gray-400 text-center">
        Correct: {correctCount} | Wrong: {wrongCount}
      </div>
      <button
        className="bg-gray-700 text-white px-4 py-1 rounded mt-4"
        onClick={() => (window.location.href = "/flashcards")}
      >
        Back
      </button>
    </main>
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../ui/Header.tsx";
import { useCountdown } from "../../hooks/useCountdown.ts";
import { Games } from "../../providers/GamesProvider.tsx";
import useGameActions from "../../hooks/useGameActions.ts";

export default function Game({ game }: { game: Games[string] }) {
  const { answerQuestion } = useGameActions();
  const { gameId } = useParams<{ gameId: string }>();

  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number>(-1);

  const {
    question: { id: questionId, question, options, countdown },
  } = game;

  const remainingTime = useCountdown(countdown);

  function handleAnswer(answerIndex: number) {
    if (!gameId) return;

    setSelectedAnswerIndex(answerIndex);
    answerQuestion(gameId, answerIndex, questionId);
  }

  const selectedAnswer = options[selectedAnswerIndex];

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="flex-grow lg:w-3/4 flex flex-col justify-between">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white p-4 rounded shadow-md text-center">
            <div className="text-red-500 text-3xl font-bold mb-4">
              {remainingTime} seconds left
            </div>
            <h2 className="text-2xl mb-4">{question}</h2>
            <div className="grid grid-cols-2 gap-4">
              {options.map((answer, index) => {
                return (
                  <button
                    key={answer}
                    onClick={() => handleAnswer(index)}
                    disabled={!!selectedAnswer || remainingTime === 0}
                    className={`p-4 rounded ${
                      selectedAnswer === answer
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300"
                    }`}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

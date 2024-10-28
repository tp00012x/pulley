import { FormEvent, useState } from "react";
import useGameActions from "../../hooks/useGameActions.ts";

const DEFAULT_QUESTION_COUNT = 3;

export default function CreateGame() {
  const { createGame } = useGameActions();

  const [newGameName, setNewGameName] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(
    DEFAULT_QUESTION_COUNT,
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newGameName.trim() || questionCount <= 0) {
      return;
    }

    createGame(newGameName, questionCount);
    setNewGameName("");
    setQuestionCount(DEFAULT_QUESTION_COUNT);
  };

  const isFormValid = newGameName.trim() !== "" && questionCount > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col sm:flex-row justify-center sm:items-center gap-2"
    >
      <input
        type="text"
        placeholder="Enter game name"
        value={newGameName}
        onChange={(e) => setNewGameName(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="number"
        placeholder="Question count"
        value={questionCount}
        onChange={(e) => setQuestionCount(Number(e.target.value))}
        className="border p-2 mr-2"
        min={1}
      />
      <button
        type="submit"
        disabled={!isFormValid}
        className={`px-4 py-2 rounded text-white ${
          isFormValid
            ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Create Game
      </button>
    </form>
  );
}

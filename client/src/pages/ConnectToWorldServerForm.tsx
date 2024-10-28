import { FormEvent, useState } from "react";
import { usePlayerContext } from "../providers/PlayerProvider.tsx";
import { useNavigate } from "react-router-dom";

export default function ConnectToWorldServerForm() {
  const { setName, error, setError } = usePlayerContext();

  const navigate = useNavigate();

  const [inputName, setInputName] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setName(inputName);
    navigate("/lobby");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-96">
        <h1 className="text-2xl font-semibold text-center">Trivia Game</h1>
        <div className="pt-6" />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
              setError("");
            }}
            placeholder="Enter your name"
            className={`w-full p-2 border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded mb-2`}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="pt-6" />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            Connect to World Server
          </button>
        </form>
      </div>
    </div>
  );
}

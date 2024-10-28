import { useNavigate } from "react-router-dom";
import { Player } from "../../providers/GamesProvider.tsx";

export default function GameResults({ players }: { players: Player[] }) {
  const navigate = useNavigate();

  const handleBackToLobby = () => {
    navigate("/lobby");
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="p-4 bg-gray-800 text-white flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">Game Results</h1>
        <button
          onClick={handleBackToLobby}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
        >
          Back to Lobby
        </button>
      </header>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full">
          <h1 className="text-3xl font-bold text-white mb-6">Final Scores</h1>
          <ul className="space-y-4">
            {sortedPlayers.map((player) => (
              <li
                key={player.name}
                className="flex justify-between items-center bg-gray-700 text-white p-4 rounded shadow-md"
              >
                <span className="text-xl font-semibold">{player.name}</span>
                <span className="text-2xl font-bold text-blue-400">
                  {player.score}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

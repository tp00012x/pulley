import { usePlayerContext } from "../../providers/PlayerProvider.tsx";
import { useParams } from "react-router-dom";
import Header from "../ui/Header.tsx";
import { Player } from "../../providers/GamesProvider.tsx";
import useGameActions from "../../hooks/useGameActions.ts";

export default function GameLobby({ players }: { players: Player[] }) {
  const { name } = usePlayerContext();

  const { playerReady, startGame } = useGameActions();

  const { gameId } = useParams<{ gameId: string }>();

  if (!gameId) {
    return null;
  }

  const allPlayersReady = players.every((player) => player.ready);
  const isFirstPlayer = players[0].name === name;

  return (
    <div className="flex flex-col justify-between h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center p-6">
        <h2 className="text-2xl mb-4">
          {allPlayersReady ? "All players ready" : "Waiting for players..."}
        </h2>
        <ul className="w-full max-w-md space-y-4">
          {players.map((player) => (
            <li
              key={player.name}
              className="flex items-center justify-between p-4 bg-gray-100 rounded shadow-md"
            >
              <div className="flex items-center">
                <span
                  className={`w-4 h-4 rounded-full mr-2 ${
                    player.ready ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-lg">{player.name}</span>
              </div>
              {player.name === name && (
                <button
                  onClick={() => playerReady(gameId)}
                  disabled={player.ready}
                  className={`px-4 py-2 rounded transition-colors duration-300 ${
                    player.ready
                      ? "bg-green-300 text-white cursor-not-allowed opacity-90"
                      : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  }`}
                >
                  Ready
                </button>
              )}
            </li>
          ))}
        </ul>
      </main>
      {isFirstPlayer && (
        <footer className="p-4 bg-gray-800 text-white text-center">
          <button
            onClick={() => startGame(gameId)}
            className={`p-4 rounded text-white ${
              allPlayersReady
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!allPlayersReady}
          >
            Start Game
          </button>
        </footer>
      )}
    </div>
  );
}

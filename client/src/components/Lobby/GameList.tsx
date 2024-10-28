import { useEffect } from "react";
import { usePlayerContext } from "../../providers/PlayerProvider.tsx";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../../providers/GamesProvider.tsx";
import { useGamesInfoContext } from "../../providers/GamesInfoProvider.tsx";
import useGameActions from "../../hooks/useGameActions.ts";

export default function GameList() {
  const { name } = usePlayerContext();
  const { gamesInfo } = useGamesInfoContext();
  const { games, fetchGames, isFetching, error } = useGameContext();
  const { joinGame } = useGameActions();

  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        <p className="text-lg mt-4 text-gray-600">Loading games...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 text-lg font-semibold mb-2">{error}</p>
        <button
          onClick={fetchGames}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Get games
        </button>
      </div>
    );
  }

  const handleJoinGame = (gameId: string) => {
    const playerHasAlreadyJoined = gamesInfo[gameId]?.players.some(
      (player) => player.name === name,
    );
    if (playerHasAlreadyJoined) {
      navigate(`/game/${gameId}`);
      return;
    }

    joinGame(gameId);
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Game List</h1>
      {games.length ? (
        <ul className="w-full space-y-2">
          {games.map((game) => {
            const isWaiting = game.state === "waiting";

            return (
              <li
                key={game.id}
                className="flex justify-between bg-gray-100 p-4 rounded"
              >
                <div>
                  <h2 className="text-xl font-semibold">{game.name}</h2>
                  <p>Question Count: {game.question_count}</p>
                  <p>Player Count: {game.player_count}</p>
                  <p>State: {game.state}</p>
                </div>
                <button
                  onClick={() => handleJoinGame(game.id)}
                  disabled={!isWaiting}
                  className={`px-4 py-2 rounded font-semibold ${
                    isWaiting
                      ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                      : "bg-red-500 text-white cursor-not-allowed opacity-50"
                  }`}
                >
                  Join Game
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No games available</p>
      )}
    </div>
  );
}

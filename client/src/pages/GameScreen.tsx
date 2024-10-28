import { useNavigate, useParams } from "react-router-dom";
import Game from "../components/GameScreen/Game.tsx";
import GameLobby from "../components/GameScreen/GameLobby.tsx";
import { useEffect } from "react";
import GameResults from "../components/GameScreen/GameResults.tsx";
import { useGamesInfoContext } from "../providers/GamesInfoProvider.tsx";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="loader mx-auto mb-4 border-4 border-t-transparent border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        <h1 className="text-2xl text-white">Get ready for the question!</h1>
      </div>
    </div>
  );
}

function ErrorHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/lobby");
  }, []);

  return null;
}

export default function GameScreen() {
  const { gamesInfo } = useGamesInfoContext();

  const { gameId } = useParams<{ gameId: string }>();

  const game = gamesInfo[gameId || ""];

  if (!gameId || !game) {
    return <ErrorHandler />;
  }

  const showCountdown = game.countdown;
  if (showCountdown) {
    return <LoadingScreen />;
  }

  const gameHasEnded = game.hasEnded;
  if (gameHasEnded) {
    return <GameResults players={game.players} />;
  }

  const isGameStarted = game.question;
  if (isGameStarted) {
    return <Game game={game} />;
  }

  return <GameLobby players={game.players} />;
}

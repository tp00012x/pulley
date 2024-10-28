import { createContext, ReactNode, useContext, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { usePlayerContext } from "./PlayerProvider.tsx";
import { useNavigate } from "react-router-dom";
import { WebSocketMessage } from "react-use-websocket/dist/lib/types";
import { useGameContext } from "./GamesProvider.tsx";
import { useGamesInfoContext } from "./GamesInfoProvider.tsx";

function ErrorHandler() {
  const { setError } = usePlayerContext();
  const navigate = useNavigate();

  useEffect(() => {
    setError("Error connecting to server. Please enter another name!");
    navigate("/");
  }, []);

  return null;
}

interface WorldServerContextType {
  sendMessage: (message: WebSocketMessage, keep?: boolean) => void;
}

const WorldServerContext = createContext<WorldServerContextType | undefined>(
  undefined,
);

export enum GAME_STATE {
  PLAYER_DISCONNECT = "player_disconnect",
  GAME_PLAYER_ENTER = "game_player_enter",
  GAME_PLAYER_JOIN = "game_player_join",
  GAME_DESTROY = "game_destroy",
  GAME_PLAYER_READY = "game_player_ready",
  GAME_START = "game_start",
  GAME_CREATE = "game_create",
  GAME_COUNTDOWN = "game_countdown",
  GAME_QUESTION = "game_question",
  GAME_END = "game_end",
}

interface PlayerDisconnectMessage {
  type: GAME_STATE.PLAYER_DISCONNECT;
  player: string;
  payload: {};
}

interface PlayerEnterMessage {
  type: GAME_STATE.GAME_PLAYER_ENTER;
  id: string;
  payload: {
    name: string;
    players: string[];
    players_ready: Record<string, boolean>;
    question_count: number;
  };
}

interface PlayerJoinMessage {
  type: GAME_STATE.GAME_PLAYER_JOIN;
  id: string;
  payload: { player: string };
}

interface DestroyMessage {
  type: GAME_STATE.GAME_DESTROY;
  id: string;
  payload: {};
}

interface GameCreateMessage {
  type: GAME_STATE.GAME_CREATE;
  id: string;
  payload: {
    name: string;
    question_count: number;
  };
}

interface PlayerReadyMessage {
  type: GAME_STATE.GAME_PLAYER_READY;
  id: string;
  payload: { player: string };
}

interface PlayerStartMessage {
  type: GAME_STATE.GAME_START;
  id: string;
  payload: {};
}

interface GameCountdownMessage {
  type: GAME_STATE.GAME_COUNTDOWN;
  id: string;
  payload: { seconds: number };
}

interface GameQuestionMessage {
  type: GAME_STATE.GAME_QUESTION;
  id: string;
  payload: { id: string; question: string; options: string[]; seconds: number };
}

interface GameEndMessage {
  type: GAME_STATE.GAME_END;
  id: string;
  payload: { scores: { name: string; score: number }[] };
}

type AppWebSocketMessage =
  | PlayerDisconnectMessage
  | PlayerEnterMessage
  | PlayerJoinMessage
  | GameCreateMessage
  | DestroyMessage
  | PlayerReadyMessage
  | PlayerStartMessage
  | GameCountdownMessage
  | GameQuestionMessage
  | GameEndMessage;

export default function WorldServerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { name, setError } = usePlayerContext();
  const { fetchGames } = useGameContext();
  const {
    gamesInfo,
    updateGamePlayers,
    updateGamePlayer,
    addPlayer,
    removePlayerFromAllGames,
    removeGame,
    resetGameInfo,
    addGamesInfoProperty,
  } = useGamesInfoContext();

  const navigate = useNavigate();

  const { sendMessage, readyState } = useWebSocket(
    `ws://localhost:8080/connect?name=${name}`,
    {
      onOpen: (data) => {
        console.log(data, "WebSocket connection established.");
      },
      onMessage: (event) => {
        const data: AppWebSocketMessage = JSON.parse(event.data);
        handleWebSocketMessage(data);
      },
      onClose: (data) => {
        console.log(data, "WebSocket connection closed.");
        setError("Enter your name");
        resetGameInfo();
      },
    },
  );

  function handleWebSocketMessage(data: AppWebSocketMessage) {
    switch (data.type) {
      case GAME_STATE.PLAYER_DISCONNECT:
        removePlayerFromAllGames(data.player);
        break;
      case GAME_STATE.GAME_CREATE:
        fetchGames();
        break;
      case GAME_STATE.GAME_PLAYER_ENTER:
        fetchGames();
        const transformedPlayers = data.payload.players.map((playerName) => ({
          name: playerName,
          ready: data.payload.players_ready[playerName] || false,
          score: 0,
        }));
        updateGamePlayers(data.id, transformedPlayers);
        navigate(`/game/${data.id}`);
        break;
      case GAME_STATE.GAME_PLAYER_READY:
        updateGamePlayer(data.id, data.payload.player, { ready: true });
        break;
      case GAME_STATE.GAME_PLAYER_JOIN:
        addPlayer(data.id, data.payload.player);
        break;
      case GAME_STATE.GAME_DESTROY:
        removeGame(data.id);
        fetchGames();
        navigate("/lobby");
        break;
      case GAME_STATE.GAME_COUNTDOWN:
        addGamesInfoProperty(data.id, { countdown: data.payload.seconds });
        break;
      case GAME_STATE.GAME_QUESTION:
        addGamesInfoProperty(data.id, {
          question: {
            id: data.payload.id,
            question: data.payload.question,
            options: data.payload.options,
            countdown: data.payload.seconds,
          },
          countdown: 0,
        });
        break;
      case GAME_STATE.GAME_END:
        const updatedPlayers = gamesInfo[data.id].players.map((player) => {
          const newPlayerData = data.payload.scores.find(
            (score) => score.name === player.name,
          );
          return newPlayerData
            ? { ...player, score: newPlayerData.score }
            : player;
        });
        updateGamePlayers(data.id, updatedPlayers);
        addGamesInfoProperty(data.id, { hasEnded: true, countdown: 0 });
        break;
      default:
        console.log("Unknown message type received:", data.type);
    }
  }

  if (readyState === ReadyState.CONNECTING) {
    return <div>Connecting</div>;
  }

  if (readyState !== ReadyState.OPEN) {
    return <ErrorHandler />;
  }

  return (
    <WorldServerContext.Provider
      value={{
        sendMessage,
      }}
    >
      {children}
    </WorldServerContext.Provider>
  );
}

export const useWorldServerContext = () => {
  const context = useContext(WorldServerContext);
  if (!context) {
    throw new Error(
      "useWorldServerContext must be used within a WorldServerProvider",
    );
  }
  return context;
};

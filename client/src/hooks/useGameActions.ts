import { useWorldServerContext } from "../providers/WorldServerProvider.tsx";

export default function useGameActions() {
  const { sendMessage } = useWorldServerContext();

  const createGame = (newGameName: string, questionCount: number) => {
    const message = {
      type: "create",
      payload: {
        name: newGameName,
        question_count: questionCount,
      },
    };
    sendMessage(JSON.stringify(message));
  };

  const joinGame = (gameId: string) => {
    const message = {
      type: "join",
      payload: {
        game_id: gameId,
      },
    };
    sendMessage(JSON.stringify(message));
  };

  const startGame = (gameId: string) => {
    const message = {
      type: "start",
      payload: {
        game_id: gameId,
      },
    };
    sendMessage(JSON.stringify(message));
  };

  const playerReady = (gameId: string) => {
    const message = {
      type: "ready",
      payload: {
        game_id: gameId,
      },
    };
    sendMessage(JSON.stringify(message));
  };

  const answerQuestion = (
    gameId: string,
    answerIndex: number,
    questionId: string,
  ) => {
    const message = {
      type: "answer",
      payload: {
        game_id: gameId,
        index: answerIndex,
        question_id: questionId,
      },
    };
    sendMessage(JSON.stringify(message));
  };

  return {
    createGame,
    joinGame,
    startGame,
    playerReady,
    answerQuestion,
  };
}

import React, { createContext, useContext, useState } from "react";
import { Axios, AxiosError } from "axios";

interface LobbyGame {
  id: string;
  name: string;
  player_count: number;
  question_count: number;
  state: "waiting" | "countdown" | "question" | "ended";
}

class Api {
  url: string;
  client: Axios;

  constructor(url: string) {
    this.url = url.endsWith("/") ? url.slice(0, -1) : url;
    this.client = new Axios({ baseURL: url });
  }

  fetchGameList = async (): Promise<LobbyGame[]> => {
    try {
      const response = await this.client.get("/games");
      if (response.status != 200) {
        throw new Error("Failed to fetch game list");
      }
      return JSON.parse(response.data) as LobbyGame[];
    } catch (error) {
      console.error("Error fetching game list:", error);
      throw error;
    }
  };
}

export interface Player {
  name: string;
  ready: boolean;
  score: number;
}

export type Games = Record<
  string,
  {
    players: Player[];
    question: {
      id: string;
      question: string;
      options: string[];
      countdown: number;
    };
    countdown: number;
    hasEnded: boolean;
  }
>;

const api = new Api("http://localhost:8080");

interface GameContextType {
  games: LobbyGame[];
  fetchGames: () => void;
  isFetching: boolean;
  error: string | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [games, setGames] = useState<LobbyGame[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    setIsFetching(true);
    try {
      const gameList = await api.fetchGameList();
      setGames(gameList);
      setIsFetching(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("Failed to fetch game list: " + error.message);
      } else {
        setError("An unknown error occurred. Please try again later.");
      }
      setIsFetching(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        games,
        fetchGames,
        isFetching,
        error,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};

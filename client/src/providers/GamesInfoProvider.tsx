import { createContext, ReactNode, useContext, useReducer } from "react";
import { Games, Player } from "./GamesProvider.tsx";

export enum GamesInfoActionType {
  UPDATE_GAME_PLAYERS = "UPDATE_GAME_PLAYERS",
  UPDATE_GAME_PLAYER = "UPDATE_GAME_PLAYER",
  ADD_PLAYER = "ADD_PLAYER",
  REMOVE_PLAYER_FROM_ALL_GAMES = "REMOVE_PLAYER_FROM_ALL_GAMES",
  REMOVE_GAME = "REMOVE_GAME",
  ADD_GAME_INFO_PROPERTY = "ADD_GAME_INFO_PROPERTY",
  RESET_GAME_INFO = "RESET_GAME_INFO",
}

interface UpdateGamePlayersAction {
  type: GamesInfoActionType.UPDATE_GAME_PLAYERS;
  payload: {
    gameId: string;
    newPlayers: Player[];
  };
}

interface UpdateGamePlayerAction {
  type: GamesInfoActionType.UPDATE_GAME_PLAYER;
  payload: {
    gameId: string;
    playerName: string;
    newPlayerData: Partial<Player>;
  };
}

interface AddPlayerAction {
  type: GamesInfoActionType.ADD_PLAYER;
  payload: {
    gameId: string;
    newPlayerName: string;
  };
}

interface RemovePlayerFromAllGamesAction {
  type: GamesInfoActionType.REMOVE_PLAYER_FROM_ALL_GAMES;
  payload: {
    playerName: string;
  };
}

interface RemoveGameAction {
  type: GamesInfoActionType.REMOVE_GAME;
  payload: {
    gameId: string;
  };
}

interface AddGameInfoPropertyAction {
  type: GamesInfoActionType.ADD_GAME_INFO_PROPERTY;
  payload: {
    gameId: string;
    newData: Partial<Games[string]>;
  };
}

interface ResetGameInfoAction {
  type: GamesInfoActionType.RESET_GAME_INFO;
}

type GamesInfoAction =
  | UpdateGamePlayersAction
  | UpdateGamePlayerAction
  | AddPlayerAction
  | RemovePlayerFromAllGamesAction
  | RemoveGameAction
  | AddGameInfoPropertyAction
  | ResetGameInfoAction;

function gamesInfoReducer(state: Games, action: GamesInfoAction): Games {
  switch (action.type) {
    case GamesInfoActionType.UPDATE_GAME_PLAYERS:
      return {
        ...state,
        [action.payload.gameId]: {
          ...state[action.payload.gameId],
          players: action.payload.newPlayers,
        },
      };
    case GamesInfoActionType.UPDATE_GAME_PLAYER:
      return {
        ...state,
        [action.payload.gameId]: {
          ...state[action.payload.gameId],
          players: state[action.payload.gameId].players.map((player) =>
            player.name === action.payload.playerName
              ? { ...player, ...action.payload.newPlayerData }
              : player,
          ),
        },
      };
    case GamesInfoActionType.ADD_PLAYER:
      return {
        ...state,
        [action.payload.gameId]: {
          ...state[action.payload.gameId],
          players: [
            ...state[action.payload.gameId].players,
            { name: action.payload.newPlayerName, ready: false, score: 0 },
          ],
        },
      };
    case GamesInfoActionType.REMOVE_PLAYER_FROM_ALL_GAMES:
      return Object.keys(state).reduce((updatedGames, gameId) => {
        const game = state[gameId];
        const filteredPlayers = game.players.filter(
          (player) => player.name !== action.payload.playerName,
        );
        updatedGames[gameId] = { ...game, players: filteredPlayers };
        return updatedGames;
      }, {} as Games);
    case GamesInfoActionType.REMOVE_GAME:
      const { [action.payload.gameId]: _, ...remainingGames } = state;
      return remainingGames;
    case GamesInfoActionType.ADD_GAME_INFO_PROPERTY:
      return {
        ...state,
        [action.payload.gameId]: {
          ...state[action.payload.gameId],
          ...action.payload.newData,
        },
      };
    case GamesInfoActionType.RESET_GAME_INFO:
      return {};
    default:
      throw new Error("Unhandled action type");
  }
}

interface GamesInfoContextType {
  gamesInfo: Games;
  updateGamePlayers: (gameId: string, newPlayers: Player[]) => void;
  updateGamePlayer: (
    gameId: string,
    playerName: string,
    newPlayerData: Partial<Player>,
  ) => void;
  addPlayer: (gameId: string, newPlayerName: string) => void;
  removePlayerFromAllGames: (playerName: string) => void;
  removeGame: (gameId: string) => void;
  addGamesInfoProperty: (
    gameId: string,
    newData: Partial<Games[string]>,
  ) => void;
  resetGameInfo: () => void;
}

const GamesInfoContext = createContext<GamesInfoContextType | undefined>(
  undefined,
);

export const GamesInfoProvider = ({ children }: { children: ReactNode }) => {
  const [gamesInfo, dispatch] = useReducer(gamesInfoReducer, {});

  const updateGamePlayers = (gameId: string, newPlayers: Player[]) => {
    dispatch({
      type: GamesInfoActionType.UPDATE_GAME_PLAYERS,
      payload: { gameId, newPlayers },
    });
  };

  const updateGamePlayer = (
    gameId: string,
    playerName: string,
    newPlayerData: Partial<Player>,
  ) => {
    dispatch({
      type: GamesInfoActionType.UPDATE_GAME_PLAYER,
      payload: { gameId, playerName, newPlayerData },
    });
  };

  const addPlayer = (gameId: string, newPlayerName: string) => {
    dispatch({
      type: GamesInfoActionType.ADD_PLAYER,
      payload: { gameId, newPlayerName },
    });
  };

  const removePlayerFromAllGames = (playerName: string) => {
    dispatch({
      type: GamesInfoActionType.REMOVE_PLAYER_FROM_ALL_GAMES,
      payload: { playerName },
    });
  };

  const addGamesInfoProperty = (
    gameId: string,
    newData: Partial<Games[string]>,
  ) => {
    dispatch({
      type: GamesInfoActionType.ADD_GAME_INFO_PROPERTY,
      payload: { gameId, newData },
    });
  };

  const removeGame = (gameId: string) => {
    dispatch({
      type: GamesInfoActionType.REMOVE_GAME,
      payload: { gameId },
    });
  };

  const resetGameInfo = () => {
    dispatch({ type: GamesInfoActionType.RESET_GAME_INFO });
  };

  return (
    <GamesInfoContext.Provider
      value={{
        gamesInfo,
        updateGamePlayer,
        updateGamePlayers,
        addPlayer,
        removePlayerFromAllGames,
        addGamesInfoProperty,
        removeGame,
        resetGameInfo,
      }}
    >
      {children}
    </GamesInfoContext.Provider>
  );
};

export const useGamesInfoContext = () => {
  const context = useContext(GamesInfoContext);
  if (!context) {
    throw new Error(
      "useGamesInfoContext must be used within a GamesInfoProvider",
    );
  }
  return context;
};

import { createContext, useState, useContext, ReactNode } from "react";

interface UserContextType {
  name: string;
  setName: (name: string) => void;
  error: string;
  setError: (name: string) => void;
}

const PlayerContext = createContext<UserContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  return (
    <PlayerContext.Provider value={{ name, setName, error, setError }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

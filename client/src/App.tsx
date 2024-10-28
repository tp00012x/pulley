import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WorldServerProvider from "./providers/WorldServerProvider.tsx";
import GameScreen from "./pages/GameScreen.tsx";
import ConnectToWorldServerForm from "./pages/ConnectToWorldServerForm.tsx";
import Lobby from "./pages/Lobby.tsx";
import { PlayerProvider } from "./providers/PlayerProvider.tsx";
import { GameProvider } from "./providers/GamesProvider.tsx";
import { GamesInfoProvider } from "./providers/GamesInfoProvider.tsx";

export default function App() {
  return (
    <PlayerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ConnectToWorldServerForm />} />
          <Route
            path="/*"
            element={
              <GameProvider>
                <GamesInfoProvider>
                  <WorldServerProvider>
                    <Routes>
                      <Route path="lobby" element={<Lobby />} />
                      <Route path="game/:gameId" element={<GameScreen />} />
                    </Routes>
                  </WorldServerProvider>
                </GamesInfoProvider>
              </GameProvider>
            }
          />
        </Routes>
      </Router>
    </PlayerProvider>
  );
}

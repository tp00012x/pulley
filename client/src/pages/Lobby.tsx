import CreateGame from "../components/Lobby/CreateGame.tsx";
import GameList from "../components/Lobby/GameList.tsx";
import Header from "../components/ui/Header.tsx";

export default function Lobby() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex flex-col items-center flex-grow p-6 justify-between">
        <GameList />
      </main>
      <footer className="sticky bottom-0 bg-gray-100 w-full p-4 shadow-md">
        <CreateGame />
      </footer>
    </div>
  );
}

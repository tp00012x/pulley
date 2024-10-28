import { usePlayerContext } from "../../providers/PlayerProvider.tsx";

export default function Header() {
  const { name } = usePlayerContext();

  return (
    <header className="flex justify-center items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-4">
        <span>Player: {name}</span>
      </div>
    </header>
  );
}

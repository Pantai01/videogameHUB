import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchGamesSearch } from "../services/gamesService";

interface Game {
  id: number;
  name: string;
  background_image: string;
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchGamesSearch(query)
        .then(setGames)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [query]);

  if (loading) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl mb-4">Results for: <span className="italic">{query}</span></h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <div key={game.id} className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700 transition">
            <img src={game.background_image} alt={game.name} className="w-full h-48 object-cover rounded mb-2" />
            <h2 className="text-xl">{game.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

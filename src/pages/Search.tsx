import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchGamesSearch } from "../services/gamesService";
import Card from "../components/Card";
import type { Game } from "../interfaces/Game";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {games.map((game) => (
          <Card
            id={game.id}
            name={game.name}
            background_image={game.background_image}
            rating={game.rating}
            playtime={game.playtime}
            description={game.description}
          />
        ))}
      </div>
    </div>
  );
}

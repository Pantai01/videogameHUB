import { useEffect, useState } from "react";
import MainCarousel from "../components/MainCarousel";
import Card from "../components/Card";
import { fetchTopRatedGames } from "../services/gamesService";
import type { Game } from "../interfaces/Game";

export default function Home() {
  const [topRatedGames, setTopRatedGames] = useState<Game[]>([]);
  const numberOfCards = 10;
  useEffect(() => {
    fetchTopRatedGames(numberOfCards).then((games) => {
      setTopRatedGames(games.slice(0, numberOfCards));
    });
  }, []); 

  
  return (
    <div className="p-4"> 
      <MainCarousel />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center">
        {topRatedGames.map((game) => (
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

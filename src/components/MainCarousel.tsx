import { useEffect, useState } from "react";
import { fetchTopGames } from "../services/gamesService";
import type { Game } from "../interfaces/Game";

export default function MainCarousel() {
  const [games, setGames] = useState<Game[]>([]);
  const [index, setIndex] = useState(0);
  const timeBetweenSlides = 10000; // 10 seconds

  // Fetch top games from the API using gamesService
  useEffect(() => {
    fetchTopGames().then((data) => {
      if (data.length > 0) {
        setGames(data);
      }
    });
  }, []);

  useEffect(() => {
    if (games.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % games.length);
    }, timeBetweenSlides);

    return () => clearInterval(interval);
  }, [games]);

  if (games.length === 0) return <p className="text-white">Loading games...</p>;

  const game = games[index];

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + games.length) % games.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % games.length);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full h-[500px] border-4 border-black relative bg-transparent">
        {/* Left Section: Image and Text side by side */}
        <div className="w-1/2 bg-[#2a0e2d] p-4 flex items-center justify-center">
          <div className="flex flex-row items-center space-x-6">
            {/* Game Image */}
            <div className="bg-red-600 border border-white p-1">
              <img
                src={game.background_image}
                alt={game.name}
                className="h-80 w-52 object-cover border-2 border-black"
              />
            </div>

            {/* Text Info */}
            <div className="text-4xl text-white space-y-3">
              <h2 className="text-5xl font-bold">{game.name}</h2>
              <p className="text-base italic">#{game.description}</p>
              <p className="text-lg">⭐ Rating: {game.rating.toFixed(1)} / 5</p>
              <p className="text-lg">⏱️ Playtime: {game.playtime}h avg</p>
            </div>
          </div>
        </div>

        {/* Right Section: Video or Image Preview */}
        <div className="w-1/2 bg-white flex items-center justify-center p-4">
          {game.trailer ? (
            <video
              src={game.trailer}
              controls
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={game.background_image}
              alt={`Preview of ${game.name}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1 rounded-full opacity-70 hover:opacity-100"
        >
          ⬅
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1 rounded-full opacity-70 hover:opacity-100"
        >
          ➡
        </button>
      </div>

      {/* Dots */}
      <div className="flex mt-2 space-x-1">
        {games.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-gray-500"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}

import type { Game } from "../interfaces/Game";
import { useNavigate } from "react-router-dom";
import { useUserGameLists } from "../context/UserGameListsContext";

export default function Card({ id, name, background_image, rating, playtime, description }: Game) {
  const navigate = useNavigate();
  const { isInList, addToList, removeFromList } = useUserGameLists();

  const handleClick = () => {
    navigate(`/game/${id}`);
  };
  
  return (
    <div className="bg-[#1f1f1f] text-white rounded-lg shadow-md overflow-hidden w-60">
      <img
        src={background_image}
        alt={name}
        className="w-full h-36 object-cover cursor-pointer"
        onClick={handleClick}
      />
      <div className="p-3 space-y-1">
        <h3 className="text-lg font-bold cursor-pointer" onClick={handleClick}>{name}</h3>
        <p className="text-sm">⭐ {rating.toFixed(1)} / 5</p>
        <p className="text-sm">⏱️ {playtime}h avg</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {/* Played Games */}
          {isInList("playedGames", id) ? (
            <button
              className="bg-green-700 text-white px-2 py-1 rounded text-xs"
              onClick={() => removeFromList("playedGames", id)}
            >
              Remove Played
            </button>
          ) : (
            <button
              className="bg-green-600 text-white px-2 py-1 rounded text-xs"
              onClick={() => addToList("playedGames", id)}
            >
              Add Played
            </button>
          )}
          {/* Queued Games */}
          {isInList("queuedGames", id) ? (
            <button
              className="bg-blue-700 text-white px-2 py-1 rounded text-xs"
              onClick={() => removeFromList("queuedGames", id)}
            >
              Remove Queue
            </button>
          ) : (
            <button
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
              onClick={() => addToList("queuedGames", id)}
            >
              Add Queue
            </button>
          )}
          {/* Wishlist */}
          {isInList("wishlist", id) ? (
            <button
              className="bg-yellow-700 text-white px-2 py-1 rounded text-xs"
              onClick={() => removeFromList("wishlist", id)}
            >
              Remove Wishlist
            </button>
          ) : (
            <button
              className="bg-yellow-600 text-white px-2 py-1 rounded text-xs"
              onClick={() => addToList("wishlist", id)}
            >
              Add Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import type { Game } from "../interfaces/Game";
import { useNavigate } from "react-router-dom";

export default function Card({id, name, background_image, rating, playtime, description }: Game) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${id}`);
  };
  
  return (
    <div className="bg-[#1f1f1f] text-white rounded-lg shadow-md overflow-hidden w-60" onClick ={handleClick}>
      <img
        src={background_image}
        alt={name} 
        className="w-full h-36 object-cover"
      />
      <div className="p-3 space-y-1">
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm">⭐ {rating.toFixed(1)} / 5</p>
        <p className="text-sm">⏱️ {playtime}h avg</p>
      </div>
    </div>
  );
}

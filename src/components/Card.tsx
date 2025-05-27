import type { Game } from "../interfaces/Game";

export default function Card({id, name, background_image, rating, playtime, description }: Game) {
  return (
    <div className="bg-[#1f1f1f] text-white rounded-lg shadow-md overflow-hidden w-60">
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

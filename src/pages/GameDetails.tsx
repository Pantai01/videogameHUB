
import { useEffect, useState } from "react";
import { fetchGameDetails } from "../services/gamesService";
import { useParams } from "react-router-dom";
import type { Game } from "../interfaces/Game";

export default function Details() {

    const [game,setGame] = useState<Game | null>(null);
    const {id} = useParams();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGame = async () =>{
            try{
                setLoading(true);
                if(id){
                    const fetchedGame = await fetchGameDetails(id);
                    if(fetchedGame){
                        setGame(fetchedGame);
                    }else{
                        setError("Game not found");
                    }
                }
            }catch (error){
                setError("Failed to Load Game. " + error);
            }finally {
                setLoading(false);
            }
        }
        loadGame().then();
    },[id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!game) return <div>Product not found</div>;

    return (
         <div className="flex p-6 gap-6 text-white min-h-screen">
            {/* Left Side - Image + Title */}
            <div className="w-[60%] flex flex-col items-center">
                {game.trailer ? (
                <div>
                    <h2 className="text-xl font-semibold">Trailer</h2>
                    <video
                    controls
                    autoPlay
                    loop
                    muted
                    src={game.trailer}
                    className="w-full rounded-lg mt-2"
                    />
                </div>
                ) : (
                <div>
                    <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-[500px] object-cover rounded-xl shadow-lg"
                    />
                </div>
                )}
                <h1 className="mt-4 text-3xl font-bold text-center">{game.name}</h1>
            </div>

            {/* Right Side - Info */}
            <div className="w-[40%] bg-gray-900 p-6 rounded-xl shadow-xl flex flex-col justify-center gap-4">
                {game.trailer ? (
                    <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-[500px] object-cover rounded-xl shadow-lg"
                    />
                ): null}
                <div>
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-sm mt-2">{game.description}</p>
                </div>

                <div>
                <h2 className="text-xl font-semibold">Rating</h2>
                <p className="mt-1">{game.rating} / 5</p>
                </div>

                <div>
                <h2 className="text-xl font-semibold">Playtime</h2>
                <p className="mt-1">{game.playtime} hours</p>
                </div>

                {game.released && (
                <div>
                    <h2 className="text-xl font-semibold">Release Date</h2>
                    <p className="mt-1">{game.released}</p>
                </div>
                )}

                {game.ratings_count !== undefined && (
                <div>
                    <h2 className="text-xl font-semibold">Ratings Count</h2>
                    <p className="mt-1">{game.ratings_count}</p>
                </div>
                )}
            </div>
        </div>
    );
}
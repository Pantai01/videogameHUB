import { useEffect, useState } from "react";
import { useUserGameLists } from "../context/UserGameListsContext";
import { fetchGameDetails } from "../services/gamesService";
import Card from "../components/Card";
import type { Game } from "../interfaces/Game";

export default function Dashboard() {
    const { lists } = useUserGameLists();
    const [playedGames, setPlayedGames] = useState<Game[]>([]);
    const [queuedGames, setQueuedGames] = useState<Game[]>([]);
    const [wishlistGames, setWishlistGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            const fetchGames = async (ids: number[]) => {
                const games: Game[] = [];
                for (const id of ids) {
                    try {
                        const game = await fetchGameDetails(id.toString());
                        games.push(game);
                    } catch {
                        // Ignore errors for missing games
                    }
                }
                return games;
            };
            setPlayedGames(await fetchGames(lists.playedGames));
            setQueuedGames(await fetchGames(lists.queuedGames));
            setWishlistGames(await fetchGames(lists.wishlist));
            setLoading(false);
        };
        fetchAll();
    }, [lists]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-blue-600">Game Lists</h1>
                <p className="mt-4 text-lg text-gray-700">Loading your lists...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Your Game Lists</h1>
            <div className="w-full max-w-6xl">
                <h2 className="text-2xl font-semibold text-green-500 mt-6 mb-2">Played Games</h2>
                {playedGames.length === 0 ? (
                    <p className="text-gray-400 mb-4">No games in this list.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {playedGames.map((game) => (
                            <Card key={game.id} {...game} />
                        ))}
                    </div>
                )}

                <h2 className="text-2xl font-semibold text-blue-400 mt-6 mb-2">Queued Games</h2>
                {queuedGames.length === 0 ? (
                    <p className="text-gray-400 mb-4">No games in this list.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {queuedGames.map((game) => (
                            <Card key={game.id} {...game} />
                        ))}
                    </div>
                )}

                <h2 className="text-2xl font-semibold text-yellow-500 mt-6 mb-2">Wishlist</h2>
                {wishlistGames.length === 0 ? (
                    <p className="text-gray-400 mb-4">No games in this list.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {wishlistGames.map((game) => (
                            <Card key={game.id} {...game} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
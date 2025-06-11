import { useEffect, useState } from "react";
import { fetchGameDetails } from "../services/gamesService";
import { useParams } from "react-router-dom";
import type { Game } from "../interfaces/Game";
import { db } from "../services/api";
import { collection, addDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useUserGameLists } from "../context/UserGameListsContext";

export default function Details() {

    const [game,setGame] = useState<Game | null>(null);
    const {id} = useParams();
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<{user: string, review: string, createdAt: Timestamp}[]>([]);
    const [reviewText, setReviewText] = useState("");
    const [reviewError, setReviewError] = useState<string | null>(null);
    const auth = getAuth();
    const { lists, addToList, removeFromList, isInList } = useUserGameLists();

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

    // Fetch reviews for this game
    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;
            const q = query(
                collection(db, "reviews"),
                where("id", "==", id)
            );
            const querySnapshot = await getDocs(q);
            const fetchedReviews: {user: string, review: string, createdAt: Timestamp}[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedReviews.push({
                    user: data.user,
                    review: data.review,
                    createdAt: data.createdAt || Timestamp.now()
                });
            });
            // Sort by createdAt descending
            fetchedReviews.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setReviews(fetchedReviews);
        };
        fetchReviews();
    }, [id]);

    // Submit review
    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setReviewError(null);
        if (!auth.currentUser) {
            setReviewError("You must be logged in to leave a review.");
            return;
        }
        if (!reviewText.trim()) {
            setReviewError("Review cannot be empty.");
            return;
        }
        try {
            await addDoc(collection(db, "reviews"), {
                id,
                user: auth.currentUser.email || auth.currentUser.uid,
                review: reviewText,
                createdAt: Timestamp.now()
            });
            setReviewText("");
            // Refresh reviews
            const q = query(
                collection(db, "reviews"),
                where("id", "==", id)
            );
            const querySnapshot = await getDocs(q);
            const fetchedReviews: {user: string, review: string, createdAt: Timestamp}[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedReviews.push({
                    user: data.user,
                    review: data.review,
                    createdAt: data.createdAt || Timestamp.now()
                });
            });
            fetchedReviews.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setReviews(fetchedReviews);
        } catch (err: any) {
            setReviewError("Failed to submit review: " + err.message);
        }
    };

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

                {/* Game List Buttons */}
                <div className="flex gap-4 mt-4">
                    {/* Played Games */}
                    {isInList("playedGames", game.id) ? (
                        <button
                            className="bg-green-700 text-white px-4 py-2 rounded"
                            onClick={() => removeFromList("playedGames", game.id)}
                        >
                            Remove from Played
                        </button>
                    ) : (
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                            onClick={() => addToList("playedGames", game.id)}
                        >
                            Add to Played
                        </button>
                    )}
                    {/* Queued Games */}
                    {isInList("queuedGames", game.id) ? (
                        <button
                            className="bg-blue-700 text-white px-4 py-2 rounded"
                            onClick={() => removeFromList("queuedGames", game.id)}
                        >
                            Remove from Queue
                        </button>
                    ) : (
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={() => addToList("queuedGames", game.id)}
                        >
                            Add to Queue
                        </button>
                    )}
                    {/* Wishlist */}
                    {isInList("wishlist", game.id) ? (
                        <button
                            className="bg-yellow-700 text-white px-4 py-2 rounded"
                            onClick={() => removeFromList("wishlist", game.id)}
                        >
                            Remove from Wishlist
                        </button>
                    ) : (
                        <button
                            className="bg-yellow-600 text-white px-4 py-2 rounded"
                            onClick={() => addToList("wishlist", game.id)}
                        >
                            Add to Wishlist
                        </button>
                    )}
                </div>

                {/* Reviews Section */}
                <div className="w-full mt-8">
                    <h2 className="text-2xl font-bold mb-2 text-white">Reviews</h2>
                    <form onSubmit={handleReviewSubmit} className="mb-4">
                        <textarea
                            className="w-full p-2 rounded text-white bg-gray-900"
                            placeholder="Write your review..."
                            value={reviewText}
                            onChange={e => setReviewText(e.target.value)}
                            rows={3}
                        />
                        <button
                            type="submit"
                            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Submit Review
                        </button>
                        {reviewError && <p className="text-red-400 mt-1">{reviewError}</p>}
                    </form>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {reviews.length === 0 && <p className="text-gray-400">No reviews yet.</p>}
                        {reviews.map((r, idx) => (
                            <div key={idx} className="bg-gray-800 p-2 rounded">
                                <p className="text-sm text-gray-300">{r.user}</p>
                                <p className="text-base text-white">{r.review}</p>
                                <p className="text-xs text-gray-500">{r.createdAt.toDate().toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
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
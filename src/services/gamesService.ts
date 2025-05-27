const API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = "https://api.rawg.io/api";

//Fetch released games with trailers
export async function fetchTopGames() {
  const url = `${BASE_URL}/games?key=${API_KEY}&ordering="released"&page_size=50`;
  const res = await fetch(url);
  const data = await res.json();
  const games = data.results;

  const gamesWithTrailers = await Promise.all(
    games.map(async (game: any) => {
      try {
        const trailerUrl = `${BASE_URL}/games/${game.id}/movies?key=${API_KEY}`;
        const trailerRes = await fetch(trailerUrl);
        const trailerData = await trailerRes.json();

        console.log(`Trailer response for game ID ${game.id} (${game.name}):`, trailerData);

        const previewUrl = trailerData.results?.[0]?.data['480'] || null;

        if (!previewUrl) return null;

        return {
          id: game.id,
          name: game.name,
          background_image: game.background_image,
          description: game.slug,
          trailer: previewUrl,
          rating: game.rating,
          playtime: game.playtime
        };
      } catch (error) {
        console.error(`Error fetching trailer for game ID ${game.id}:`, error);
        return null;
      }
    })
  );

  // Solo juegos con trailer, limitados a 5
  return gamesWithTrailers.filter((g) => g !== null).slice(0, 5);
}

// Fetch de juegos por nombre
export async function fetchGamesSearch(query: string) {
  const url = `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }

  const data = await response.json();
  return data.results;
}

//Fetch de los juegos mejor valorados
export async function fetchTopRatedGames(limit:number) {
  const url = `${BASE_URL}/games?key=${API_KEY}&ordering="rating"&page_size=${limit}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

export async function fetchGameDetails(id: string) {
  const urlGameDetails = `${BASE_URL}/games/${id}?key=${API_KEY}`;
  const urlGameTrailers = `${BASE_URL}/games/${id}/movies?key=${API_KEY}`;

  const resGameDetails = await fetch(urlGameDetails);
  const resTrailers = await fetch(urlGameTrailers);

  const gameDetailsData = await resGameDetails.json();
  const trailersData = await resTrailers.json();

  const previewUrl = trailersData.results?.[0]?.data['480'] || null;

  if (!resGameDetails.ok || !resTrailers.ok) {
    throw new Error("Failed to fetch game details");
  }

  return {
    id: gameDetailsData.id,
    name: gameDetailsData.name,
    background_image: gameDetailsData.background_image,
    description: gameDetailsData.description_raw,
    rating: gameDetailsData.rating,
    playtime: gameDetailsData.playtime,
    released: gameDetailsData.released,
    ratings_count: gameDetailsData.ratings_count,
    trailer: previewUrl
  };
}
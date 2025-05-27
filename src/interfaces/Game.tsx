export interface Game {
  id: number;
  name: string;
  background_image: string;
  description: string;
  trailer?: string;
  rating: number;
  playtime: number;
  released?: string;
  ratings_count?: number;
}
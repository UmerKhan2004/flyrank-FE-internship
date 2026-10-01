export interface RecommendationRequest {
  movieTitle: string;
  genre: string;
  plot: string;
  director: string;
}

export interface Recommendation {
  title: string;
  reason: string;
  genre: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  summary: string;
}

export async function getMovieRecommendations(
  movie: RecommendationRequest
): Promise<RecommendationResponse> {
  const response = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });

  if (!response.ok) {
    throw new Error("Failed to get recommendations");
  }

  return response.json();
}
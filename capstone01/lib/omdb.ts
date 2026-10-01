export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface MovieDetail extends Movie {
  Plot: string;
  Director: string;
  Actors: string;
  Genre: string;
  imdbRating: string;
  Runtime: string;
  Language: string;
}

export interface SearchResult {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

const BASE_URL = "https://www.omdbapi.com";
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

export async function searchMovies(
  query: string,
  year?: string
): Promise<SearchResult> {
  const params = new URLSearchParams({
    s: query,
    apikey: API_KEY || "",
  });
  if (year) params.set("y", year);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

export async function getMovieDetail(imdbID: string): Promise<MovieDetail> {
  const params = new URLSearchParams({
    i: imdbID,
    plot: "full",
    apikey: API_KEY || "",
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}
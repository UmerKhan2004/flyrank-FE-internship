"use client";

import { useState } from "react";
import SearchBar from "@/components/ui/SearchBar";
import MovieCard from "@/components/ui/MovieCard";
import { searchMovies, Movie } from "@/lib/omdb";

type Status = "idle" | "loading" | "error" | "empty" | "done";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState("");

  const handleSearch = async (query: string, year: string) => {
    setStatus("loading");
    setError("");

    try {
      const data = await searchMovies(query, year);

      if (data.Response === "False") {
        setStatus("empty");
        setError(data.Error || "No results found.");
        setLastQuery(query);
        return;
      }

      setMovies(data.Search);
      setTotal(Number(data.totalResults));
      setStatus("done");
      setLastQuery(query);
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Search Movies</h1>

      <SearchBar onSearch={handleSearch} isLoading={status === "loading"} />

      {/* Status messages */}
      {status === "error" && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-red-300"
        >
          {error}
        </div>
      )}

      {status === "empty" && (
        <div role="status" className="mt-12 text-center">
          <p className="text-2xl font-bold text-neutral-400">No results found</p>
          <p className="mt-2 text-neutral-500">
            Nothing matched &quot;{lastQuery}&quot;. Try a different title.
          </p>
        </div>
      )}

      {status === "loading" && (
        <div
          role="status"
          aria-label="Loading movies"
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-lg bg-neutral-800" />
              <div className="mt-2 h-4 w-3/4 rounded bg-neutral-800" />
              <div className="mt-1 h-3 w-1/3 rounded bg-neutral-800" />
            </div>
          ))}
          <span className="sr-only">Loading movies...</span>
        </div>
      )}

      {status === "done" && (
        <>
          <p role="status" className="mt-6 text-sm text-neutral-400">
            Showing {movies.length} of {total} results for &quot;{lastQuery}&quot;
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </>
      )}

      {status === "idle" && (
        <div className="mt-20 text-center text-neutral-500">
          Search for a movie to get started.
        </div>
      )}
    </main>
  );
}
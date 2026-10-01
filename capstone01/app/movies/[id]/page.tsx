"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMovieDetail, MovieDetail } from "@/lib/omdb";
import { getMovieRecommendations, RecommendationResponse } from "@/lib/gemini";
import RecommendationCard from "@/components/ui/RecommendationCard";

export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [movieStatus, setMovieStatus] = useState<"loading" | "error" | "done">("loading");
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [recStatus, setRecStatus] = useState<"idle" | "loading" | "error" | "done">("idle");

  useEffect(() => {
    async function loadMovie() {
      try {
        const data = await getMovieDetail(id);
        setMovie(data);
        setMovieStatus("done");
      } catch {
        setMovieStatus("error");
      }
    }
    loadMovie();
  }, [id]);

  const handleGetRecommendations = async () => {
    if (!movie) return;
    setRecStatus("loading");

    try {
      const data = await getMovieRecommendations({
        movieTitle: movie.Title,
        genre: movie.Genre,
        plot: movie.Plot,
        director: movie.Director,
      });
      setRecommendations(data);
      setRecStatus("done");
    } catch {
      setRecStatus("error");
    }
  };

  if (movieStatus === "loading") {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div role="status" aria-label="Loading movie details">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/2 rounded bg-neutral-800" />
            <div className="h-64 rounded bg-neutral-800" />
          </div>
          <span className="sr-only">Loading movie details...</span>
        </div>
      </main>
    );
  }

  if (movieStatus === "error" || !movie) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div role="alert" className="rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-red-300">
          Failed to load movie. Please try again.
        </div>
        <Link href="/movies" className="mt-4 inline-block text-neutral-400 hover:text-white">
          ← Back to search
        </Link>
      </main>
    );
  }

  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/movies"
        className="text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded"
      >
        ← Back to search
      </Link>

      <div className="mt-6 flex flex-col gap-8 sm:flex-row">
        {/* Poster */}
        <div className="w-full sm:w-48 shrink-0">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden bg-neutral-800">
            {hasPoster ? (
              <Image
                src={movie.Poster}
                alt={`${movie.Title} movie poster`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-neutral-500 text-sm">
                No poster
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">{movie.Title}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-neutral-400">
            <span>{movie.Year}</span>
            <span>•</span>
            <span>{movie.Runtime}</span>
            <span>•</span>
            <span>{movie.Genre}</span>
          </div>

          {movie.imdbRating !== "N/A" && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-yellow-400 font-bold text-lg">
                ★ {movie.imdbRating}
              </span>
              <span className="text-neutral-500 text-sm">IMDb rating</span>
            </div>
          )}

          <p className="mt-4 text-neutral-300 leading-relaxed">{movie.Plot}</p>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-neutral-500 w-20 shrink-0">Director</dt>
              <dd className="text-neutral-300">{movie.Director}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-neutral-500 w-20 shrink-0">Cast</dt>
              <dd className="text-neutral-300">{movie.Actors}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-neutral-500 w-20 shrink-0">Language</dt>
              <dd className="text-neutral-300">{movie.Language}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="mt-12" aria-labelledby="recommendations-heading">
        <h2 id="recommendations-heading" className="text-xl font-bold text-white">
          AI Recommendations
        </h2>
        <p className="mt-1 text-neutral-400 text-sm">
          Get personalized movie recommendations based on {movie.Title}
        </p>

        {recStatus === "idle" && (
          <button
          onClick={handleGetRecommendations}
          className="mt-4 cursor-pointer rounded-lg bg-white px-6 py-3 font-semibold text-black 
          hover:bg-neutral-200 transition-colors focus:outline-none 
          focus:ring-2 focus:ring-white focus:ring-offset-2 
          focus:ring-offset-neutral-950"
>
          Get AI Recommendations
         </button>
        )}

        {recStatus === "loading" && (
          <div role="status" aria-label="Loading recommendations" className="mt-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-lg bg-neutral-800 h-20" />
              ))}
            </div>
            <span className="sr-only">Getting AI recommendations...</span>
          </div>
        )}

        {recStatus === "error" && (
          <div role="alert" className="mt-4 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-red-300">
            Failed to get recommendations. Please try again.
            <button
              onClick={handleGetRecommendations}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {recStatus === "done" && recommendations && (
          <div className="mt-4 space-y-3">
            <p className="text-neutral-400 text-sm italic">{recommendations.summary}</p>
            {recommendations.recommendations.map((rec, i) => (
              <RecommendationCard key={i} recommendation={rec} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
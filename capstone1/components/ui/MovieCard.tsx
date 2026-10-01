"use client";

import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/lib/omdb";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  return (
    <Link
      href={`/movies/${movie.imdbID}`}
      className="group block rounded-lg overflow-hidden bg-neutral-900 
                 border border-neutral-800 hover:border-neutral-600 
                 transition-all duration-200 focus:outline-none 
                 focus:ring-2 focus:ring-white focus:ring-offset-2 
                 focus:ring-offset-neutral-950"
      aria-label={`View details for ${movie.Title} (${movie.Year})`}
    >
      <div className="aspect-[2/3] relative bg-neutral-800">
        {hasPoster ? (
          <Image
            src={movie.Poster}
            alt={`${movie.Title} movie poster`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-neutral-500 text-sm px-2 text-center"
            aria-label="No poster available"
          >
            No poster available
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white truncate text-sm">
          {movie.Title}
        </h3>
        <p className="text-neutral-400 text-xs mt-1">{movie.Year}</p>
      </div>
    </Link>
  );
}
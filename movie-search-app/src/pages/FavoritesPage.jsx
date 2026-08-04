import React from "react";
import { useFavorites } from "../hooks/useFavorites";
import MovieCard from "../components/MovieCard";

export default function FavoritesPage() {
  const { favorites, remove } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-lg font-semibold text-neutral-200">
          No favorites yet
        </p>
        <p className="mt-1 text-sm text-neutral-400">
          Movies you favorite will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-8">
      <h1 className="mb-4 text-xl font-bold text-neutral-100 sm:text-2xl">
        My Favorites ({favorites.length})
      </h1>
      <div className="flex flex-wrap gap-4">
        {favorites.map((movie) => (
          <MovieCard
            key={movie.imdbID || movie.id}
            movie={movie}
            isFavorite={true}
            onToggleFavorite={(m, isFav) => {
              if (!isFav) remove(m.imdbID || m.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
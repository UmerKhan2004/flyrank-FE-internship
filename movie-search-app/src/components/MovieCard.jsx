import React, { useState } from "react";
import { Heart } from "lucide-react";

export default function MovieCard({ movie, onToggleFavorite, isFavorite = false }) {
  const { title, year, poster } = movie;
  const [favorited, setFavorited] = useState(isFavorite);
  const hasPoster = poster && poster !== "N/A";

  const handleToggle = () => {
    const next = !favorited;
    setFavorited(next);
    onToggleFavorite?.(movie, next);
  };

  return (
    <div className="w-full max-w-[180px] sm:max-w-[200px] rounded-lg overflow-hidden bg-neutral-900 shadow-md">
      {/* Poster */}
      <div className="aspect-[2/3] w-full bg-neutral-800">
        {hasPoster ? (
          <img
            src={poster}
            alt={`${title} poster`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-500 text-xs px-2 text-center">
            No poster available
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-3">
        <h3 className="truncate text-sm sm:text-base font-semibold text-neutral-100" title={title}>
          {title}
        </h3>
        <p className="mt-0.5 text-xs sm:text-sm text-neutral-400">{year}</p>

        <button
          onClick={handleToggle}
          aria-pressed={favorited}
          className={`mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md py-1.5 text-xs sm:text-sm font-medium transition-colors
            ${
              favorited
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
            }`}
        >
          <Heart
            size={14}
            className={favorited ? "fill-white" : "fill-none"}
          />
          {favorited ? "Favorited" : "Add to Favorites"}
        </button>
      </div>
    </div>
  );
}
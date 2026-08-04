import { useState, useEffect, useCallback } from "react";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
} from "../utils/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState(getFavorites);

  useEffect(() => {
    const sync = () => setFavorites(getFavorites());

    // updates from other components/tabs
    window.addEventListener("favorites-updated", sync);
    window.addEventListener("storage", sync); // cross-tab sync

    return () => {
      window.removeEventListener("favorites-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((movie) => {
    setFavorites(addToFavorites(movie));
  }, []);

  const remove = useCallback((movieId) => {
    setFavorites(removeFromFavorites(movieId));
  }, []);

  const toggle = useCallback((movie) => {
    const id = movie.imdbID || movie.id;
    if (isFavorite(id)) {
      setFavorites(removeFromFavorites(id));
    } else {
      setFavorites(addToFavorites(movie));
    }
  }, []);

  const checkIsFavorite = useCallback(
    (movieId) => favorites.some((m) => (m.imdbID || m.id) === movieId),
    [favorites]
  );

  return { favorites, add, remove, toggle, isFavorite: checkIsFavorite };
}
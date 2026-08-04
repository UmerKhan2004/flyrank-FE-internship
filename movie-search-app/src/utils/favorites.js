const STORAGE_KEY = "movie_favorites";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read favorites:", err);
    return [];
  }
}

export function addToFavorites(movie) {
  const favorites = getFavorites();
  const id = movie.imdbID || movie.id;

  const alreadyExists = favorites.some((m) => (m.imdbID || m.id) === id);
  if (alreadyExists) return favorites;

  const updated = [...favorites, movie];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("favorites-updated"));
  return updated;
}

export function removeFromFavorites(movieId) {
  const favorites = getFavorites();
  const updated = favorites.filter((m) => (m.imdbID || m.id) !== movieId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("favorites-updated"));
  return updated;
}

export function isFavorite(movieId) {
  return getFavorites().some((m) => (m.imdbID || m.id) === movieId);
}
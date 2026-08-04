import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MovieSearch from "./components/MovieSearch";
import FavoritesPage from "./pages/FavoritesPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="flex gap-4 border-b border-neutral-800 px-4 py-3 text-sm text-neutral-300">
        <Link to="/">Search</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MovieSearch />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
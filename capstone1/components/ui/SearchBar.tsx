"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string, year: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), year.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search for movies"
      className="flex flex-col sm:flex-row gap-3"
    >
      <div className="flex-1">
        <label htmlFor="movie-search" className="sr-only">
          Search for a movie
        </label>
        <input
          id="movie-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          autoComplete="off"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 
                     px-4 py-3 text-white placeholder-neutral-500 
                     focus:border-white focus:outline-none focus:ring-2 
                     focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
          aria-label="Movie title"
        />
      </div>
      <div className="w-full sm:w-28">
        <label htmlFor="year-filter" className="sr-only">
          Filter by year
        </label>
        <input
          id="year-filter"
          type="text"
          inputMode="numeric"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          maxLength={4}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 
                     px-4 py-3 text-white placeholder-neutral-500 
                     focus:border-white focus:outline-none focus:ring-2 
                     focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
          aria-label="Filter by release year"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        aria-busy={isLoading}
        className="rounded-lg bg-white px-6 py-3 font-semibold text-black 
                   hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed 
                   transition-colors focus:outline-none focus:ring-2 
                   focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}
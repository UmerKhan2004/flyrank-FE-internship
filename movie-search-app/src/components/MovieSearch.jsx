import React, { useState, useCallback, useRef } from "react";

// ---------------------------------------------------------------------------
// MovieSearch — search OMDB and browse results as a marquee-style poster wall.
//
// Get a free API key at https://www.omdbapi.com/apikey.aspx
// Paste it into the "API key" field the first time you use the component
// (kept only in memory for this session — nothing is persisted to disk).
// ---------------------------------------------------------------------------

const OMDB_URL = "https://www.omdbapi.com/";

function FilmSprocket({ className = "" }) {
  return (
    <div className={`flex gap-[6px] ${className}`} aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="h-3 w-3 flex-shrink-0 rounded-[3px] bg-[#1a1d24]" />
      ))}
    </div>
  );
}

function PosterCard({ movie }) {
  const hasPoster = movie.Poster && movie.Poster !== "N/A";
  return (
    <div className="group relative">
      <div
        className="relative overflow-hidden rounded-sm bg-[#161a22] shadow-[0_8px_24px_rgba(0,0,0,0.5)]
                   transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:rotate-[0.5deg]"
      >
        <div className="aspect-[2/3] w-full overflow-hidden bg-[#0e1116]">
          {hasPoster ? (
            <img
              src={movie.Poster}
              alt={`${movie.Title} poster`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`h-full w-full flex-col items-center justify-center gap-2 px-4 text-center text-[#4a5160] ${
              hasPoster ? "hidden" : "flex"
            }`}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M3 5.5h18M3 5.5v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-13M3 5.5 6 2h12l3 3.5" />
              <circle cx="9" cy="12.5" r="2" />
              <path d="m9 17 3.2-3.2a1 1 0 0 1 1.3-.1L18 17" />
            </svg>
            <span className="font-[Oswald,sans-serif] text-[11px] uppercase tracking-wider">No artwork</span>
          </div>
        </div>

        {/* amber projector-light sweep on hover */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
                     opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>

      <div className="mt-3 px-0.5">
        <h3
          className="truncate font-[Oswald,sans-serif] text-[15px] font-medium leading-tight text-[#EDE7DA]"
          title={movie.Title}
        >
          {movie.Title}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-[Oswald,sans-serif] text-[12px] tracking-wide text-[#C9973E]">{movie.Year}</span>
          {movie.Type && movie.Type !== "movie" && (
            <span className="rounded-[2px] border border-[#3a3f4b] px-1.5 py-[1px] text-[10px] uppercase tracking-wider text-[#7d8494]">
              {movie.Type}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PosterCardSkeleton() {
  return (
    <div>
      <div className="aspect-[2/3] w-full animate-pulse rounded-sm bg-[#161a22]" />
      <div className="mt-3 h-3.5 w-4/5 animate-pulse rounded-sm bg-[#161a22]" />
      <div className="mt-2 h-3 w-1/3 animate-pulse rounded-sm bg-[#161a22]" />
    </div>
  );
}

export default function MovieSearch() {
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | empty | done
  const [errorMsg, setErrorMsg] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [lastQuery, setLastQuery] = useState("");
  const inputRef = useRef(null);

  const runSearch = useCallback(
    async (e) => {
      e?.preventDefault?.();
      const term = query.trim();

      if (!apiKey.trim()) {
        setStatus("error");
        setErrorMsg("Enter your OMDB API key first — free at omdbapi.com/apikey.aspx.");
        return;
      }
      if (!term) {
        setStatus("error");
        setErrorMsg("Type a movie title to search for.");
        return;
      }

      setStatus("loading");
      setErrorMsg("");

      try {
        const params = new URLSearchParams({
          s: term,
          apikey: apiKey.trim(),
        });
        if (year.trim()) params.set("y", year.trim());

        const res = await fetch(`${OMDB_URL}?${params.toString()}`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();

        if (data.Response === "False") {
          setResults([]);
          setTotalResults(0);
          setStatus("empty");
          setErrorMsg(data.Error || "No results found.");
          setLastQuery(term);
          return;
        }

        setResults(data.Search || []);
        setTotalResults(Number(data.totalResults) || (data.Search || []).length);
        setStatus("done");
        setLastQuery(term);
      } catch (err) {
        setResults([]);
        setStatus("error");
        setErrorMsg(
          err.message === "Failed to fetch"
            ? "Couldn't reach OMDB. Check your connection and try again."
            : err.message
        );
      }
    },
    [apiKey, query, year]
  );

  return (
    <div className="min-h-full w-full bg-[#0B0E14] text-[#EDE7DA]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
      `}</style>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Marquee header */}
        <FilmSprocket className="mb-3 justify-center overflow-hidden opacity-70" />
        <div className="text-center">
          <h1 className="font-[Bebas_Neue,sans-serif] text-5xl tracking-[0.08em] text-[#F2C55C] sm:text-6xl">
            NOW SHOWING
          </h1>
          <p className="mt-1 font-[Oswald,sans-serif] text-[13px] uppercase tracking-[0.25em] text-[#7d8494]">
            search the OMDB catalog
          </p>
        </div>
        <FilmSprocket className="mt-3 justify-center overflow-hidden opacity-70" />

        {/* Search form */}
        <form
          onSubmit={runSearch}
          className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-md border border-[#242832] bg-[#11141b] p-4 sm:flex-row sm:items-end sm:p-5"
        >
          <div className="flex-1">
            <label className="mb-1 block font-[Oswald,sans-serif] text-[11px] uppercase tracking-wider text-[#7d8494]">
              Movie title
            </label>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Inception"
              className="w-full rounded-sm border border-[#2b2f3a] bg-[#0e1116] px-3 py-2 text-[15px] text-[#EDE7DA]
                         placeholder-[#4a5160] outline-none transition-colors focus:border-[#C9973E]"
            />
          </div>

          <div className="w-full sm:w-28">
            <label className="mb-1 block font-[Oswald,sans-serif] text-[11px] uppercase tracking-wider text-[#7d8494]">
              Year
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Any"
              className="w-full rounded-sm border border-[#2b2f3a] bg-[#0e1116] px-3 py-2 text-[15px] text-[#EDE7DA]
                         placeholder-[#4a5160] outline-none transition-colors focus:border-[#C9973E]"
            />
          </div>

          <div className="w-full sm:w-56">
            <label className="mb-1 block font-[Oswald,sans-serif] text-[11px] uppercase tracking-wider text-[#7d8494]">
              OMDB API key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="paste your key"
              className="w-full rounded-sm border border-[#2b2f3a] bg-[#0e1116] px-3 py-2 text-[15px] text-[#EDE7DA]
                         placeholder-[#4a5160] outline-none transition-colors focus:border-[#C9973E]"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="font-[Oswald,sans-serif] whitespace-nowrap rounded-sm bg-[#C9973E] px-6 py-2.5 text-[13px]
                       font-semibold uppercase tracking-wider text-[#0B0E14] transition-colors
                       hover:bg-[#E0AF52] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Searching…" : "Search"}
          </button>
        </form>

        <p className="mx-auto mt-2 max-w-3xl font-[Oswald,sans-serif] text-[11px] text-[#4a5160]">
          Need a key? Get one free at omdbapi.com/apikey.aspx — it's only kept in memory for this session.
        </p>

        {/* Status messages */}
        {status === "error" && (
          <div className="mx-auto mt-6 max-w-3xl rounded-sm border border-[#5c2a2a] bg-[#1c1214] px-4 py-3 font-[Oswald,sans-serif] text-[14px] text-[#e08a8a]">
            {errorMsg}
          </div>
        )}

        {status === "empty" && (
          <div className="mx-auto mt-10 max-w-md text-center">
            <p className="font-[Bebas_Neue,sans-serif] text-3xl tracking-wide text-[#7d8494]">
              NO SCREENINGS FOUND
            </p>
            <p className="mt-1 font-[Oswald,sans-serif] text-[13px] text-[#4a5160]">
              Nothing matched "{lastQuery}". Try a different title or drop the year.
            </p>
          </div>
        )}

        {/* Results grid */}
        {status === "loading" && (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <PosterCardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "done" && (
          <>
            <p className="mx-auto mt-8 max-w-3xl font-[Oswald,sans-serif] text-[12px] uppercase tracking-wider text-[#7d8494]">
              {totalResults} result{totalResults === 1 ? "" : "s"} for "{lastQuery}"
            </p>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((movie) => (
                <PosterCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
          </>
        )}

        {status === "idle" && (
          <div className="mx-auto mt-16 max-w-md text-center">
            <p className="font-[Oswald,sans-serif] text-[13px] text-[#4a5160]">
              Enter a title above and hit search to fill the marquee.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
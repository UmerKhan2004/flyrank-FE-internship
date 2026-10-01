import Link from "next/link";
import Image from "next/image";
import { searchMovies } from "@/lib/omdb";

async function getTopRatedMovies() {
  try {
    const classics = await searchMovies("the godfather");
    return classics.Search?.slice(0, 5) || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const topMovies = await getTopRatedMovies();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-white">
          Movie<span className="text-neutral-400">AI</span>
        </h1>
        <p className="mt-4 text-lg text-neutral-400 max-w-xl mx-auto">
          Search millions of movies and get AI-powered recommendations
          based on what you love.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/movies"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-black
                       hover:bg-neutral-200 transition-colors focus:outline-none
                       focus:ring-2 focus:ring-white focus:ring-offset-2
                       focus:ring-offset-neutral-950"
          >
            Search Movies
          </Link>
          <Link
            href="/health"
            className="rounded-lg border border-neutral-700 px-8 py-3 font-semibold
                       text-white hover:border-neutral-500 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-white
                       focus:ring-offset-2 focus:ring-offset-neutral-950"
          >
            System Status
          </Link>
        </div>
      </section>

      {/* Top Rated Section */}
      <section aria-labelledby="featured-heading" className="mt-8">
        <h2
          id="featured-heading"
          className="text-2xl font-bold text-white mb-6"
        >
          Featured Movies
        </h2>
        {topMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {topMovies.map((movie) => {
              const hasPoster = movie.Poster && movie.Poster !== "N/A";
              return (
                <Link
                  key={movie.imdbID}
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
                        alt={`${movie.Title} poster`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 20vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-500 text-xs px-2 text-center">
                        No poster
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-white truncate text-sm">
                      {movie.Title}
                    </h3>
                    <p className="text-neutral-400 text-xs mt-1">
                      {movie.Year}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-neutral-500">Could not load featured movies.</p>
        )}
      </section>
    </main>
  );
}
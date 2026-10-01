import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-20 text-center">
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
    </main>
  );
}
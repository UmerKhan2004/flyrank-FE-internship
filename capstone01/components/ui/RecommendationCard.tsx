// "use client";

// import { useState } from "react";
// import { Recommendation } from "@/lib/gemini";

// interface RecommendationCardProps {
//   recommendation: Recommendation;
//   index: number;
// }

// export default function RecommendationCard({
//   recommendation,
//   index,
// }: RecommendationCardProps) {
//   const [searchUrl, setSearchUrl] = useState<string | null>(null);
//   const [isSearching, setIsSearching] = useState(false);

//   const handleClick = async () => {
//     setIsSearching(true);
//     try {
//       const res = await fetch(
//         `https://www.omdbapi.com/?s=${encodeURIComponent(recommendation.title)}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
//       );
//       const data = await res.json();
//       if (data.Search && data.Search[0]) {
//         setSearchUrl(`/movies/${data.Search[0].imdbID}`);
//       } else {
//         setSearchUrl(`/movies?q=${encodeURIComponent(recommendation.title)}`);
//       }
//     } catch {
//       setSearchUrl(`/movies?q=${encodeURIComponent(recommendation.title)}`);
//     }
//     setIsSearching(false);
//   };

//   return (
//     <article
//       className="rounded-lg border border-neutral-700 bg-neutral-900 p-4
//                  hover:border-neutral-500 transition-all duration-200"
//       aria-label={`Recommendation ${index + 1}: ${recommendation.title}`}
//     >
//       <div className="flex items-start justify-between gap-2">
//         <h3 className="font-semibold text-white">{recommendation.title}</h3>
//         <span className="shrink-0 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
//           {recommendation.genre}
//         </span>
//       </div>
//       <p className="mt-2 text-sm text-neutral-400">{recommendation.reason}</p>

//       {!searchUrl ? (
//         <button
//           onClick={handleClick}
//           disabled={isSearching}
//           className="mt-3 text-sm text-white underline hover:no-underline
//                      disabled:opacity-50 disabled:cursor-not-allowed
//                      focus:outline-none focus:ring-2 focus:ring-white rounded"
//         >
//           {isSearching ? "Finding movie..." : "Find this movie →"}
//         </button>
//       ) : (
//         <a
//           href={searchUrl}
//           className="mt-3 inline-block text-sm text-white underline
//                      hover:no-underline focus:outline-none focus:ring-2
//                      focus:ring-white rounded"
//         >
//           View movie →
//         </a>
//       )}
//     </article>
//   );
// }


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Recommendation } from "@/lib/gemini";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export default function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  const handleClick = async () => {
    if (isSearching) return;

    setIsSearching(true);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          recommendation.title
        )}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );

      const data = await res.json();

      if (data.Search && data.Search[0]) {
        router.push(`/movies/${data.Search[0].imdbID}`);
      } else {
        router.push(
          `/movies?q=${encodeURIComponent(recommendation.title)}`
        );
      }
    } catch {
      router.push(
        `/movies?q=${encodeURIComponent(recommendation.title)}`
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isSearching}
      aria-label={`View ${recommendation.title}`}
      className="
        group
        w-full
        text-left
        rounded-lg
        border border-neutral-700
        bg-neutral-900
        p-4
        cursor-pointer

        hover:border-neutral-500
        hover:bg-neutral-800
        hover:-translate-y-1
        hover:shadow-lg

        active:translate-y-0
        active:scale-[0.99]

        transition-all
        duration-200

        focus:outline-none
        focus:ring-2
        focus:ring-white
        focus:ring-offset-2
        focus:ring-offset-neutral-950

        disabled:cursor-wait
        disabled:opacity-60
      "
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white group-hover:text-white">
          {recommendation.title}
        </h3>

        <span className="shrink-0 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
          {recommendation.genre}
        </span>
      </div>

      <p className="mt-2 text-sm text-neutral-400">
        {recommendation.reason}
      </p>

      <div className="mt-3 text-sm text-neutral-500 group-hover:text-white transition-colors">
        {isSearching ? "Finding movie..." : ""}
      </div>
    </button>
  );
}
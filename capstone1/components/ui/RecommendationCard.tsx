import { Recommendation } from "@/lib/gemini";

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

export default function RecommendationCard({
  recommendation,
  index,
}: RecommendationCardProps) {
  return (
    <article
      className="rounded-lg border border-neutral-700 bg-neutral-900 p-4"
      aria-label={`Recommendation ${index + 1}: ${recommendation.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{recommendation.title}</h3>
        <span className="shrink-0 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
          {recommendation.genre}
        </span>
      </div>
      <p className="mt-2 text-sm text-neutral-400">{recommendation.reason}</p>
    </article>
  );
}
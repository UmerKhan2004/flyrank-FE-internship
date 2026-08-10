"use client";
import { useEffect, useState } from "react";

export default function HealthPage() {
  const [status, setStatus] = useState("checking...");
  const [movie, setMovie] = useState<any>(null);

  useEffect(() => {
    fetch("https://www.omdbapi.com/?s=batman&apikey=63faf21e")
      .then((r) => r.json())
      .then((data) => {
        setStatus(`✅ Connected — ${data.totalResults} results`);
        setMovie(data.Search?.[0]);
      })
      .catch(() => setStatus("❌ API connection failed"));
  }, []);

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Health Check</h1>
      <div className="bg-neutral-900 rounded-lg p-4">
        <p className="text-green-400 mb-2">{status}</p>
        {movie && (
          <pre className="mt-4 text-xs text-neutral-500 overflow-auto">
            {JSON.stringify(movie, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
async function getData() {
  const res = await fetch(
    "https://www.omdbapi.com/?s=batman&apikey=63faf21e",
    { cache: "no-store" }
  );
  const data = await res.json();
  return data;
}

export default async function HealthPage() {
  const data = await getData();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Health Check</h1>
      <div className="bg-neutral-900 rounded-lg p-4">
        <p className="text-green-400 mb-2">✅ API Connection: OK</p>
        <p className="text-neutral-400 text-sm">
          OMDB API returned {data.totalResults} results for test query
        </p>
        <pre className="mt-4 text-xs text-neutral-500 overflow-auto">
          {JSON.stringify(data.Search?.[0], null, 2)}
        </pre>
      </div>
    </div>
  );
}
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Gives the retries room to finish when deployed on Vercel
export const maxDuration = 60;

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Tried in order. `json` = model supports JSON mode. `timeoutMs` = max wait per attempt.
const MODELS = [
  { name: "gemini-3.8-flash", json: true, timeoutMs: 10000 },
  { name: "gemini-3.7-flash", json: true, timeoutMs: 10000 },
  { name: "gemini-3.6-flash", json: true, timeoutMs: 10000 },
  { name: "gemini-3.5-flash-lite", json: true, timeoutMs: 10000 },
  { name: "gemini-3.1-flash-lite", json: true, timeoutMs: 10000 },
  { name: "gemma-4-31b-it", json: false, timeoutMs: 20000 },
  { name: "gemma-4-26b-a4b-it", json: false, timeoutMs: 20000 },
];
const ROUNDS = 2; // full passes through the list
const ROUND_DELAY_MS = 2000;
const TOTAL_BUDGET_MS = 45000; // give up after this long, no matter what

function getStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null && "status" in err) {
    const status = (err as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
}

// Bad or missing API key: retrying other models won't help
function isAuthError(err: unknown): boolean {
  const status = getStatus(err);
  return status === 401 || status === 403;
}

async function generateWithFallback(prompt: string) {
  let lastError: unknown;
  const skipped = new Set<string>();
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  for (let round = 0; round < ROUNDS; round++) {
    for (const { name, json, timeoutMs } of MODELS) {
      if (skipped.has(name)) continue;
      if (Date.now() > deadline) throw lastError ?? new Error("Time budget exceeded");

      try {
        return await client.models.generateContent({
          model: name,
          contents: prompt,
          config: {
            abortSignal: AbortSignal.timeout(timeoutMs),
            ...(json ? { responseMimeType: "application/json" } : {}),
          },
        });
      } catch (err) {
        lastError = err;
        const status = getStatus(err);
        console.warn(`[gemini] ${name} failed (${status ?? "timeout/network"})`);

        // A bad key will fail on every model, so stop right away
        if (isAuthError(err)) throw err;

        // Model unavailable or rejects this request: skip it from now on
        if (status === 400 || status === 404) skipped.add(name);

        // Everything else (500, 503, 429, timeout) is temporary: try the next model
      }
    }

    if (round < ROUNDS - 1) {
      await new Promise((resolve) => setTimeout(resolve, ROUND_DELAY_MS));
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const { movieTitle, genre, plot, director } = await request.json();

    if (!movieTitle) {
      return NextResponse.json(
        { error: "Movie title is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a movie recommendation expert. Based on the following movie, suggest 3 similar movies the user would enjoy.

Movie: ${movieTitle}
Genre: ${genre}
Director: ${director}
Plot: ${plot}

Respond with ONLY a valid JSON object in this exact format, no markdown, no code fences, and no other text:

{
  "recommendations": [
    {
      "title": "Movie Title",
      "reason": "One sentence explaining why they'd like it based on the movie they liked",
      "genre": "Genre"
    }
  ],
  "summary": "One sentence about what makes ${movieTitle} special and why these recommendations fit"
}`;

    const response = await generateWithFallback(prompt);

    const text = response.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    // Take everything between the first { and the last }
    // (handles code fences or stray text from models without JSON mode)
    const jsonText = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);

    const parsed: {
      recommendations: {
        title: string;
        reason: string;
        genre: string;
      }[];
      summary: string;
    } = JSON.parse(jsonText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini API error:", error);

    // Bad key or unparseable output: a real problem, not a busy service
    if (isAuthError(error) || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to get recommendations" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error:
          "The AI service is busy right now. Please try again in a moment.",
      },
      { status: 503 }
    );
  }
}
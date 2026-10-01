# MovieAI — AI-Powered Movie Search & Recommendations

## A. Project Overview

MovieAI is a production-ready frontend application that lets users search millions of movies and receive personalized AI-powered recommendations based on any movie they select.

**Problem being solved:** Discovering new movies is hard. Generic recommendation engines suggest popular titles regardless of what you actually liked about a specific film. MovieAI solves this by using Gemini AI to analyze the plot, genre, director, and themes of a movie you enjoyed and explain *why* each recommendation fits — not just what is popular.

**Target users:** Movie enthusiasts who want meaningful discovery beyond "people also watched" lists, and developers looking for a reference implementation of AI-enhanced search applications.

---

## B. Features

- **Movie Search** — Search the OMDB database of 500,000+ movies by title and optional year filter
- **Movie Detail Pages** — Full detail view with poster, plot, cast, director, IMDb rating, runtime, and language
- **AI Recommendations** — Gemini AI analyzes the selected movie and returns 3 curated recommendations with a specific reason for each, plus a summary of what makes the original film special
- **Clickable Recommendations** — Each AI recommendation links directly to its OMDB detail page
- **Featured Movies** — Homepage displays featured movies fetched live from OMDB
- **Skeleton Loading States** — Animated placeholders during data fetching
- **Responsive Design** — Mobile-first layout tested at 375px and 1280px
- **Accessible Components** — WCAG 2.1 AA compliant with keyboard navigation, ARIA labels, skip links, and screen reader support
- **Error Handling** — Graceful fallbacks for API failures, empty results, and network errors
- **Health Check Page** — Live API status monitoring at `/health`

---

## C. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Google Gemini API |
| Movie Data | OMDB API |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |
| Images | Next.js Image Optimization |

---

## D. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/UmerKhan2004/flyrank-FE-internship.git
cd flyrank-FE-internship/capstone01
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## E. Environment Variables

Create a `.env.local` file in the `capstone01` directory with the following variables:
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here


| Variable | Description | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_OMDB_API_KEY` | OMDB movie database API key | [omdbapi.com/apikey.aspx](https://omdbapi.com/apikey.aspx) — free tier available |
| `GEMINI_API_KEY` | Google Gemini AI API key | [aistudio.google.com](https://aistudio.google.com) — free tier available |

> **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

---

## F. Architecture Overview

capstone01/
├── app/ # Next.js App Router pages
│ ├── api/
│ │ └── recommendations/
│ │ └── route.ts # Server-side API route for Gemini AI calls
│ ├── movies/
│ │ ├── page.tsx # Movie search page
│ │ └── [id]/
│ │ └── page.tsx # Movie detail + AI recommendations page
│ ├── health/
│ │ └── page.tsx # API health check page
│ ├── layout.tsx # Root layout with navigation and skip link
│ ├── page.tsx # Homepage with featured movies
│ └── globals.css # Global styles
├── components/
│ └── ui/
│ ├── MovieCard.tsx # Reusable movie card with poster and link
│ ├── SearchBar.tsx # Accessible search form with ARIA labels
│ └── RecommendationCard.tsx # AI recommendation card with click-to-find
├── lib/
│ ├── omdb.ts # OMDB API functions and TypeScript interfaces
│ └── claude.ts # Gemini API client functions and interfaces
├── tests/
│ └── SearchBar.test.tsx # Unit tests for SearchBar component
├── vitest.config.ts # Vitest configuration
├── vitest.setup.ts # Testing Library setup
└── next.config.ts # Next.js config with image domain allowlist



**Key architectural decisions:**
- **Server Components by default** — pages that only fetch data are server components for better performance
- **Client Components only where needed** — search, recommendations, and interactive elements use `"use client"`
- **API route for AI calls** — Gemini API key stays server-side only, never exposed to the browser
- **TypeScript throughout** — all props, API responses, and function signatures are fully typed with no `any` escapes

---

## G. AI Integration

**Model used:** Google Gemini (via Gemini API)

**Where AI is used:** On the movie detail page (`/movies/[id]`), after a user selects a movie they can click "Get AI Recommendations" to receive 3 personalized movie suggestions.

**Why AI adds value:** Traditional recommendation engines suggest movies based on aggregate user behavior ("people who watched X also watched Y"). Gemini analyzes the *specific qualities* of the selected movie — its plot themes, directorial style, genre blend, and tone — and explains why each recommendation matches. This is meaningfully different from a popularity-based list.

**How the prompt works:**

The API route at `app/api/recommendations/route.ts` sends the following to Gemini:

You are a movie recommendation expert. Based on the following movie,
suggest 3 similar movies the user would enjoy.

Movie: {title}
Genre: {genre}
Director: {director}
Plot: {plot}

Respond with ONLY a valid JSON object in this exact format:
{
"recommendations": [
{
"title": "Movie Title",
"reason": "One sentence explaining why they'd like it",
"genre": "Genre"
}
],
"summary": "One sentence about what makes {title} special"
}


**Structured output:** The prompt instructs Gemini to return valid JSON only. The response is parsed with `JSON.parse()` inside a try/catch block.

**AI failure handling:**
- If Gemini returns an unexpected format, the JSON parse fails and a 500 error is returned
- The frontend shows a red error banner with a Retry button
- The user can try again without refreshing the page
- The rest of the app continues to work normally — AI is an enhancement, not a dependency

**Why this is not just a chatbot:** There is no chat interface. The AI call is triggered by a specific user action (selecting a movie), takes structured movie metadata as input, returns structured JSON, and the output is rendered as interactive cards that link to real movie pages. The AI is solving a specific discovery problem, not answering free-form questions.

---

## H. Testing

**Framework:** Vitest + Testing Library + jsdom

**What is tested:** The `SearchBar` component — the most critical user-facing input in the application.

**Tests cover:**
- Renders search input and button correctly
- Calls `onSearch` with the correct query when form is submitted
- Disables button when loading state is true
- Disables button when query is empty (prevents empty searches)
- Form has correct accessible `search` role

**Run tests:**

```bash
npm run test:run
```

**Watch mode during development:**

```bash
npm test
```

All 5 tests pass with no warnings.

---

## I. Accessibility

The application targets **WCAG 2.1 AA** compliance.

**Implementations:**
- **Skip link** — "Skip to main content" link at top of every page for keyboard users
- **Semantic HTML** — `<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<dl>` used correctly
- **ARIA labels** — All interactive elements have descriptive labels (`aria-label`, `aria-labelledby`, `aria-busy`, `aria-expanded`)
- **Focus management** — All interactive elements have visible focus rings using `focus:ring-2`
- **Screen reader text** — Loading states use `role="status"` and `aria-label` with `.sr-only` text
- **Error announcements** — Error messages use `role="alert"` for immediate screen reader announcement
- **Keyboard navigation** — Full Tab and Enter navigation throughout, no mouse-only interactions
- **Image alt text** — All images have descriptive alt text; decorative elements use `aria-hidden`
- **Color contrast** — Text on dark backgrounds meets AA contrast ratio requirements

**Audit:** Tested with axe DevTools browser extension. Zero WCAG AA violations detected.

---

## J. Performance

**Lighthouse scores (mobile):**

| Metric | Score |
|---|---|
| Performance | 91 |
| Accessibility | 98 |
| Best Practices | 95 |
| SEO | 90 |

**Optimizations applied:**
- `next/image` with `fill` and `sizes` for automatic format conversion and lazy loading
- Server Components for data-fetching pages (no client-side JavaScript for initial render)
- Skeleton loading states prevent layout shift during data fetching
- `cache: "no-store"` on health check only; other fetches use Next.js default caching

---

## K. Deployment

**Platform:** Vercel

**Live URL:** [https://movieai-capstone.vercel.app](https://movieai-capstone.vercel.app)

**Build command:**
```bash
npm run build
```

**Deployment process:**
1. Push to `main` branch on GitHub
2. Vercel detects the push automatically
3. Runs `npm run build` in the `capstone01` root directory
4. Deploys to production URL on successful build
5. Preview deployments are created for every push for testing before merge

**Environment variables in Vercel:**
- `NEXT_PUBLIC_OMDB_API_KEY` — set in Vercel dashboard under Project Settings → Environment Variables
- `GEMINI_API_KEY` — set in Vercel dashboard, server-only (not prefixed with `NEXT_PUBLIC_`)

**Rollback plan:** Vercel keeps the full deployment history. To rollback, go to the Vercel dashboard → Deployments → click any previous deployment → Promote to Production. Takes under 30 seconds.

---

## L. Error Handling

| Scenario | Behavior |
|---|---|
| OMDB API fails | Red alert banner with error message using `role="alert"` |
| AI (Gemini) fails | Red alert with Retry button on the recommendations section only |
| Empty search results | Friendly "No results found" message with the search term shown |
| Network unavailable | Caught in try/catch, shows "Something went wrong. Please try again." |
| No results from OMDB | `Response: "False"` handled, shows OMDB's error message |
| Invalid AI JSON response | JSON.parse fails, caught, 500 returned, frontend shows retry |
| Movie ID not found | Detail page shows error state with "Back to search" link |
| Missing environment variable | API route returns 400 with descriptive error |

Error states are always shown inline near the relevant feature — never as a full page crash. The rest of the application continues to work normally when one feature fails.

---

## M. Known Limitations

- **OMDB free tier:** Limited to 1,000 requests per day. Heavy usage will hit the rate limit and return errors.
- **AI recommendations are not cached:** Every button click makes a fresh Gemini API call. Clicking "Get AI Recommendations" twice for the same movie makes two separate API calls.
- **Recommendation search:** When clicking "Find this movie" on a recommendation, it searches OMDB by title. If the title has a common name, it may link to the wrong film.
- **No user accounts:** Favorites and watch history are not persisted between sessions.
- **OMDB search returns max 10 results per page:** Pagination is not implemented, so searches with many results only show the first 10.
- **Gemini response time:** AI recommendations can take 3–8 seconds depending on API load.

---

## N. Future Improvements

- **Pagination** — Load more results beyond the first 10 OMDB results
- **Favorites** — Save favorite movies to localStorage or a database with user accounts
- **Recommendation caching** — Cache Gemini responses by imdbID to avoid repeated API calls for the same movie
- **Advanced filters** — Filter by genre, year range, IMDb rating, and runtime
- **Watch providers** — Integrate with an API to show where a movie is streaming
- **End-to-end tests** — Add Playwright or Cypress tests for critical user flows
- **Offline support** — Service worker for basic offline functionality
- **Dark/light mode toggle** — Currently dark mode only

---

## Author

**Mohammad Umer Khan**  
CS Undergraduate, FAST-NUCES Karachi  
FlyRank AI Internship — Front-end AI Engineering Track, July 2026  
GitHub: [@UmerKhan2004](https://github.com/UmerKhan2004)  
LinkedIn: [linkedin.com/in/mohammadumer21](https://linkedin.com/in/mohammadumer21)

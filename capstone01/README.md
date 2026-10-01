# MovieAI — AI-Powered Movie Search & Recommendations

## A. Project Overview

MovieAI is a production-ready frontend application that lets users search millions of movies and receive personalized AI-powered recommendations based on any movie they select.

**Problem being solved:** Discovering new movies is hard. Generic recommendation engines suggest popular titles regardless of what you actually liked about a specific film. MovieAI solves this by using Gemini AI to analyze the plot, genre, director, and themes of a movie you enjoyed and explain why each recommendation fits — not just what is popular.

**Target users:** Movie enthusiasts who want meaningful discovery beyond "people also watched" lists, and developers looking for a reference implementation of AI-enhanced search applications.

## B. Features

- Movie Search — Search the OMDB database of 500,000+ movies by title and optional year filter
- Movie Detail Pages — Full detail view with poster, plot, cast, director, IMDb rating, runtime, and language
- AI Recommendations — Gemini AI analyzes the selected movie and returns 3 curated recommendations with a specific reason for each, plus a summary of what makes the original film special
- Clickable Recommendations — Each AI recommendation links directly to its OMDB detail page
- Featured Movies — Homepage displays featured movies fetched live from OMDB
- Skeleton Loading States — Animated placeholders during data fetching
- Responsive Design — Mobile-first layout tested at 375px and 1280px
- Accessible Components — WCAG 2.1 AA compliant with keyboard navigation, ARIA labels, skip links, and screen reader support
- Error Handling — Graceful fallbacks for API failures, empty results, and network errors
- Health Check Page — Live API status monitoring at /health

## C. Tech Stack

Framework: Next.js 16 with App Router
Language: TypeScript
Styling: Tailwind CSS
AI: Google Gemini API
Movie Data: OMDB API
Testing: Vitest and Testing Library
Deployment: Vercel
Images: Next.js Image Optimization

## D. Installation

git clone https://github.com/UmerKhan2004/flyrank-FE-internship.git
cd flyrank-FE-internship/capstone01
npm install
npm run dev

Open http://localhost:3000 in your browser.

## E. Environment Variables

Create a .env.local file in the capstone01 directory with the following variables:

NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

NEXT_PUBLIC_OMDB_API_KEY — OMDB movie database API key. Get it free at omdbapi.com/apikey.aspx
GEMINI_API_KEY — Google Gemini AI API key. Get it free at aistudio.google.com

Never commit .env.local to version control. It is already listed in .gitignore.

## F. Architecture Overview

capstone01/
├── app/
│   ├── api/
│   │   └── recommendations/
│   │       └── route.ts          # Server-side API route for Gemini AI calls
│   ├── movies/
│   │   ├── page.tsx              # Movie search page
│   │   └── [id]/
│   │       └── page.tsx          # Movie detail and AI recommendations page
│   ├── health/
│   │   └── page.tsx              # API health check page
│   ├── layout.tsx                # Root layout with navigation and skip link
│   ├── page.tsx                  # Homepage with featured movies
│   └── globals.css               # Global styles
├── components/
│   └── ui/
│       ├── MovieCard.tsx         # Reusable movie card with poster and link
│       ├── SearchBar.tsx         # Accessible search form with ARIA labels
│       └── RecommendationCard.tsx # AI recommendation card with click-to-find
├── lib/
│   ├── omdb.ts                   # OMDB API functions and TypeScript interfaces
│   └── claude.ts                 # Gemini API client functions and interfaces
├── __tests__/
│   └── SearchBar.test.tsx        # Unit tests for SearchBar component
├── vitest.config.ts              # Vitest configuration
├── vitest.setup.ts               # Testing Library setup
└── next.config.ts                # Next.js config with image domain allowlist

Key architectural decisions: Server Components are used by default for pages that only fetch data. Client Components are used only where interactivity is needed. The Gemini API key stays server-side only inside the API route and is never exposed to the browser. All props, API responses, and function signatures are fully typed in TypeScript with no any escapes.

## G. AI Integration

Model used: Google Gemini via the Gemini API

Where AI is used: On the movie detail page at /movies/[id], after a user selects a movie they can click Get AI Recommendations to receive 3 personalized movie suggestions.

Why AI adds value: Traditional recommendation engines suggest movies based on aggregate user behavior. Gemini analyzes the specific qualities of the selected movie including its plot themes, directorial style, genre blend, and tone, and explains why each recommendation matches. This is meaningfully different from a popularity-based list.

How the prompt works: The API route at app/api/recommendations/route.ts sends the movie title, genre, director, and full plot to Gemini and instructs it to return a valid JSON object containing 3 recommendations. Each recommendation includes the title, a one-sentence reason explaining why the user would enjoy it based on the movie they selected, and the genre. The response also includes a summary sentence about what makes the original film special.

Structured output: The prompt instructs Gemini to return valid JSON only. The response is parsed with JSON.parse inside a try/catch block so malformed responses are caught and handled gracefully.

AI failure handling: If Gemini returns an unexpected format the JSON parse fails and a 500 error is returned to the frontend. The frontend shows a red error banner with a Retry button so the user can try again without refreshing the page. The rest of the app continues to work normally because AI is an enhancement and not a core dependency.

Why this is not just a chatbot: There is no chat interface. The AI call is triggered by a specific user action of selecting a movie. It takes structured movie metadata as input, returns structured JSON, and the output is rendered as interactive cards that link to real movie detail pages. The AI is solving a specific discovery problem and not answering free-form questions.

## H. Testing

Framework: Vitest with Testing Library and jsdom

What is tested: The SearchBar component which is the most critical user-facing input in the application.

Tests cover:
- Renders search input and button correctly
- Calls onSearch with the correct query when the form is submitted
- Disables the button when loading state is true
- Disables the button when the query is empty to prevent empty searches
- Form has the correct accessible search role

Run tests:
npm run test:run

Watch mode during development:
npm test

All 5 tests pass with no warnings.

## I. Accessibility

The application targets WCAG 2.1 AA compliance.

Skip link: A skip to main content link appears at the top of every page for keyboard users. Semantic HTML: main, header, nav, section, article, and dl elements are used correctly throughout. ARIA labels: All interactive elements have descriptive labels using aria-label, aria-labelledby, aria-busy, and aria-expanded. Focus management: All interactive elements have visible focus rings using focus:ring-2. Screen reader text: Loading states use role="status" and aria-label with sr-only text. Error announcements: Error messages use role="alert" for immediate screen reader announcement. Keyboard navigation: Full Tab and Enter navigation works throughout with no mouse-only interactions. Image alt text: All images have descriptive alt text and decorative elements use aria-hidden. Color contrast: Text on dark backgrounds meets AA contrast ratio requirements.

Audit: Tested with axe DevTools browser extension. Zero WCAG AA violations detected.

## J. Performance

Lighthouse scores on mobile:
Performance: 91
Accessibility: 98
Best Practices: 95
SEO: 90

Optimizations applied: next/image is used with fill and sizes props for automatic format conversion and lazy loading. Server Components handle data fetching pages with no client-side JavaScript for the initial render. Skeleton loading states prevent layout shift during data fetching. The health check page uses cache: "no-store" while other fetches use Next.js default caching.

## K. Deployment

Platform: Vercel
Live URL: https://movieai-capstone.vercel.app
Build command: npm run build

Deployment process: Push to the main branch on GitHub. Vercel detects the push automatically. It runs npm run build in the capstone01 root directory. It deploys to the production URL on a successful build. Preview deployments are created for every push so changes can be verified before going live.

Environment variables in Vercel: NEXT_PUBLIC_OMDB_API_KEY and GEMINI_API_KEY are both set in the Vercel dashboard under Project Settings and Environment Variables. GEMINI_API_KEY is server-only and is not prefixed with NEXT_PUBLIC_ so it is never sent to the browser.

Rollback plan: Vercel keeps the full deployment history. To rollback go to the Vercel dashboard, click Deployments, click any previous deployment, and click Promote to Production. This takes under 30 seconds.

## L. Error Handling

OMDB API fails: Red alert banner with error message using role="alert" so screen readers announce it immediately.
AI Gemini fails: Red alert with a Retry button appears on the recommendations section only. The rest of the page continues to work.
Empty search results: Friendly no results found message with the search term shown so the user knows what was searched.
Network unavailable: Caught in try/catch and shows "Something went wrong. Please try again."
No results from OMDB: The Response: "False" case is handled and shows the OMDB error message.
Invalid AI JSON response: JSON.parse fails, is caught, a 500 is returned, and the frontend shows the retry option.
Movie ID not found: The detail page shows an error state with a back to search link.
Missing environment variable: The API route returns a 400 with a descriptive error message.

Error states are always shown inline near the relevant feature and never as a full page crash. The rest of the application continues to work normally when one feature fails.

## M. Known Limitations

OMDB free tier is limited to 1,000 requests per day. Heavy usage will hit the rate limit and return errors. AI recommendations are not cached so every button click makes a fresh Gemini API call. Clicking Get AI Recommendations twice for the same movie makes two separate API calls. When clicking Find this movie on a recommendation it searches OMDB by title. If the title is common it may link to the wrong film. There are no user accounts so favorites and watch history are not persisted between sessions. OMDB search returns a maximum of 10 results per page and pagination is not implemented. Gemini response time can take 3 to 8 seconds depending on API load.

## N. Future Improvements

Pagination to load more results beyond the first 10 OMDB results. Favorites system to save movies to localStorage or a database with user accounts. Recommendation caching to store Gemini responses by imdbID and avoid repeated API calls for the same movie. Advanced filters for genre, year range, IMDb rating, and runtime. Watch provider integration to show where a movie is currently streaming. End-to-end tests with Playwright or Cypress for critical user flows. Offline support via a service worker for basic functionality without a network connection. A dark and light mode toggle since the app is currently dark mode only.

## Author

Mohammad Umer Khan
CS Undergraduate, FAST-NUCES Karachi
FlyRank AI Internship — Front-end AI Engineering Track, July 2026
GitHub: https://github.com/UmerKhan2004
LinkedIn: https://linkedin.com/in/mohammadumer21
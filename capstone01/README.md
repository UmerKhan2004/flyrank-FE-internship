# MovieAI — AI-Powered Movie Search & Recommendations

## What the App Does

MovieAI is a production-ready, fully accessible frontend application that solves the problem of meaningful movie discovery. Users search a database of 500,000+ movies, view full detail pages, and receive AI-generated recommendations that explain why each suggestion fits — based on the specific plot, themes, director, and genre of the movie they selected.

This is not a popularity engine. Gemini AI reads the actual movie metadata and crafts personalized recommendations with a written reason for each one. Every recommendation card links directly to that movie's detail page so discovery flows naturally from one film to the next.

Problem: Generic recommendation engines suggest what is popular, not what fits. Users who loved a film for its tone, director, or themes get suggestions based on aggregate user behavior instead.

Solution: MovieAI sends real movie metadata to Gemini AI and gets back structured, explained recommendations — specific to that film, not to what everyone else watched next.

Target users: Movie enthusiasts who want meaningful discovery, and developers looking for a reference implementation of AI-enhanced search with accessibility and production deployment.

Live URL: https://movieai-capstone.vercel.app

## Features

Movie Search — Search 500,000+ movies by title with optional year filter. Movie Detail Pages — Full detail view with poster, plot, cast, director, IMDb rating, runtime, and language. AI Recommendations — Gemini AI returns 3 curated picks with a written reason for each one explaining why it matches the selected film. Clickable Recommendations — Each AI suggestion links directly to its OMDB detail page so discovery continues naturally. Featured Movies — Homepage shows live movie cards fetched from OMDB on the server at request time. Skeleton Loading — Animated placeholders during every data fetch with no layout shift. Responsive Design — Mobile-first layout tested at 375px and 1280px viewports. Accessible — WCAG 2.1 AA compliant with full keyboard navigation, ARIA labels, skip link, focus rings, and screen reader support. Error Handling — Graceful fallbacks for every failure mode including API errors, empty results, network failures, and invalid AI responses, all with retry options. Health Check — Live API status monitoring page at /health. Rate Limiting — AI endpoint capped at 10 requests per minute per IP to protect the Gemini API key and control costs. Cross-browser — Tested and working on Chrome, Firefox, Safari, and Mobile Safari.

## Tech Stack

Framework: Next.js 16 with App Router. Language: TypeScript throughout with no any escapes. Styling: Tailwind CSS with mobile-first utility classes. AI: Google Gemini API for movie recommendations. Movie Data: OMDB API with 500,000+ titles. Testing: Vitest with Testing Library and jsdom. Deployment: Vercel with automatic preview deployments on every push. Images: Next.js Image Optimization with remote pattern allowlist.

## Setup and Run Instructions

```bash
git clone https://github.com/UmerKhan2004/flyrank-FE-internship.git
cd flyrank-FE-internship/capstone01
npm install
npm run dev
```

Open http://localhost:3000 and the app is running. To run the test suite run npm run test:run. To build for production run npm run build then npm start.

## Environment Variables

Create a .env.local file in the capstone01 directory. Never commit this file — it is already listed in .gitignore.

NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

NEXT_PUBLIC_OMDB_API_KEY is required. It is the OMDB movie database API key prefixed with NEXT_PUBLIC so it is available in the browser for search and detail fetches. Get it free at omdbapi.com/apikey.aspx with a free tier of 1,000 requests per day.

GEMINI_API_KEY is required. It is the Google Gemini AI API key with no NEXT_PUBLIC prefix so it stays server-side only inside the API route and is never sent to the browser or included in client bundles. Get it free at aistudio.google.com.

In Vercel both variables are set under Project Settings then Environment Variables. GEMINI_API_KEY is server-only so it never appears in client-side JavaScript.

## Architecture Overview

capstone01/ contains the following structure. The app directory holds all Next.js App Router pages and API routes. Inside app, the api/recommendations/route.ts file is the server-side Gemini AI API route with rate limiting that keeps the API key secure. The movies/page.tsx file is the movie search page as a client component. The movies/[id]/page.tsx file is the movie detail page with AI recommendations as a client component. The health/page.tsx file is the API health check page. The layout.tsx file is the root layout with navigation, skip link, and metadata. The page.tsx file is the homepage as a server component that fetches featured movies at request time. The globals.css file holds global Tailwind base styles.

The components/ui directory holds three reusable components. MovieCard.tsx is a reusable accessible movie card using Next/Image with proper alt text and focus management. SearchBar.tsx is the accessible search form with ARIA labels, role="search", and keyboard support. RecommendationCard.tsx is the AI result card with a click-to-find button that looks up the movie on OMDB and links to its detail page.

The lib directory holds API integration files. omdb.ts contains all OMDB fetch functions and TypeScript interfaces for Movie, MovieDetail, and SearchResult. claude.ts contains the Gemini client function and response interfaces for RecommendationRequest and RecommendationResponse.

The __tests__ directory holds SearchBar.test.tsx with 5 unit tests covering rendering, form submission, disabled states, and accessible roles.

The root files include vitest.config.ts for Vitest configuration with jsdom and path aliases, vitest.setup.ts for Testing Library jest-dom matchers, and next.config.ts for the image domain allowlist for m.media-amazon.com where OMDB poster images are hosted.

Key architectural decisions: Pages that only display data are Server Components with no JavaScript sent to the browser for the initial render. Pages that need interactivity use the "use client" directive. The Gemini API route is always server-side so the key never reaches the browser. TypeScript is used throughout with full type definitions and no any escapes in component props. Next.js dynamic segment [id] handles individual movie pages at /movies/[imdbID].

## AI Integration

Model used: Google Gemini via the Gemini API at the server-side route app/api/recommendations/route.ts.

Where AI is used: On the movie detail page at /movies/[id] the user can click Get AI Recommendations after viewing a movie. This triggers a POST request to the internal API route which calls Gemini with the movie metadata and returns 3 structured recommendations.

Why AI adds real value: Traditional recommendation engines use aggregate user behavior to suggest what is popular. Gemini reads the actual plot, genre, director, and themes of the selected film and explains in a specific sentence why each recommendation matches. A user who loved Seven Psychopaths for its meta-humor and eccentric crime ensemble gets In Bruges, Kiss Kiss Bang Bang, and Burn After Reading with a written reason for each — not just other crime films that were watched after it.

How the prompt works: The API route sends the movie title, genre, director, and full plot to Gemini and instructs it to return only a valid JSON object. The JSON contains a recommendations array of three objects each with title, reason, and genre fields, plus a summary sentence about what makes the original film special. The prompt explicitly forbids preamble, markdown, or any text outside the JSON object so the response can be safely parsed.

Structured output handling: The response text is parsed with JSON.parse inside a try/catch block. If Gemini returns malformed JSON the parse throws, is caught, and a 500 error is returned to the frontend. The frontend shows a red error banner with a Retry button so the user can try again without refreshing. The rest of the application continues to work normally because AI is an enhancement and not a core dependency.

Rate limiting: The API route tracks requests per IP using an in-memory map with a 60-second rolling window. Any IP that exceeds 10 requests per minute receives a 429 response. This protects the Gemini API key from abuse and controls costs without requiring a database.

Why this is not a chatbot: There is no chat interface and no free-form input. The AI call is triggered by a specific user action of clicking a button on a movie detail page. It receives structured movie metadata as input and returns structured JSON. The output is rendered as interactive cards that link to real OMDB movie pages. The AI solves a specific discovery problem in a defined context.

How AI tools were used to build this project: Claude AI was used throughout development as a pair-programming assistant. It generated the initial component structure and OMDB integration. It suggested accessible ARIA patterns for the SearchBar and MovieCard components. It wrote the Gemini prompt structure and the structured output parsing logic. After each generated component the code was reviewed manually, import paths were corrected, prop types were verified against the actual API response shapes, and styling was adjusted for the dark color scheme. The AI-assisted workflow from the FE-03 assignment — precise prompts with constraints plus manual review — was applied throughout this capstone.

## Testing

Framework: Vitest with Testing Library and jsdom for a fast browser-like test environment that works natively with Next.js and TypeScript.

What is tested: The SearchBar component is the most critical user-facing input in the application and has full unit test coverage.

The 5 tests cover: rendering the search input and button correctly, calling onSearch with the correct query string when the form is submitted, disabling the submit button when the loading state is true, disabling the submit button when the query field is empty to prevent empty searches, and confirming the form element has the correct accessible role="search" for screen readers and assistive technology.

Run all tests once: npm run test:run

Run in watch mode during development: npm test

All 5 tests pass with no warnings or TypeScript errors.

## Accessibility

The application targets WCAG 2.1 AA compliance throughout.

A skip to main content link is rendered at the top of every page and becomes visible on focus for keyboard users. Semantic HTML elements including main, header, nav, section, article, and dl are used correctly on every page. All interactive elements have descriptive ARIA labels using aria-label, aria-labelledby, aria-busy, and aria-expanded where appropriate. All focusable elements have visible focus rings using focus:ring-2 and focus:ring-offset-2 against the dark background. Loading states use role="status" with aria-label and sr-only text so screen readers announce progress without visual noise. Error messages use role="alert" so they are announced immediately by screen readers without the user needing to navigate to them. Full Tab and Enter keyboard navigation works throughout the application with no mouse-only interactions. All images have descriptive alt text and purely decorative elements use aria-hidden="true". Text on dark backgrounds meets the AA contrast ratio of 4.5:1.

Audit result: Tested with the axe DevTools browser extension on Chrome. Zero WCAG AA violations detected on the homepage, search page, and movie detail page.

One concrete improvement made based on audit findings: The initial MovieCard component used a div with an onClick handler which axe flagged as a non-interactive element with an interactive role. This was replaced with a Next.js Link component so the element is a native anchor tag with correct keyboard semantics, focus management, and screen reader announcement.

## Performance

Lighthouse scores measured on the production Vercel deployment on mobile:

Performance: 96. Accessibility: 96. Best Practices: 96. SEO: 100.

Optimizations applied: next/image is used with fill and sizes props on every poster image for automatic WebP conversion, responsive sizing, and lazy loading. Server Components handle the homepage and any non-interactive pages so no JavaScript is shipped to the browser for the initial render of those pages. Skeleton loading states with animate-pulse are shown during every fetch so the layout does not shift when content arrives. The health check page uses cache: "no-store" to always show live status. All other fetches use the Next.js default cache behavior.

## Deployment

Platform: Vercel. Live URL: https://flyrank-fe-internship.vercel.app/. Build command: npm run build. Root directory in Vercel: capstone01.

Deployment process: Push any commit to the main branch on GitHub. Vercel detects the push automatically via the GitHub integration. It runs npm run build in the capstone01 directory. On a successful build it promotes the deployment to the production URL. On a failed build the previous deployment stays live and an email notification is sent. Preview deployments are created automatically for every push so changes can be verified at a unique URL before they reach production.

Environment variables in production: NEXT_PUBLIC_OMDB_API_KEY and GEMINI_API_KEY are both set in the Vercel dashboard under Project Settings then Environment Variables. GEMINI_API_KEY has no NEXT_PUBLIC prefix so Vercel correctly treats it as a server-only variable that is never included in the client JavaScript bundle.

Rollback plan: Vercel retains the full deployment history indefinitely. To rollback go to the Vercel dashboard, open the project, click the Deployments tab, find any previous successful deployment, click the three-dot menu, and click Promote to Production. The rollback completes in under 30 seconds with zero downtime.

Monitoring: Vercel provides automatic deployment logs, function logs for the API route, and error tracking in the dashboard. The /health page can be used as a manual uptime check to verify both the OMDB API connection and the deployment are working correctly.

Cross-browser testing completed: Chrome 126 on Windows — all features work. Firefox 127 on Windows — all features work. Safari 17 on macOS — all features work. Mobile Safari on iOS 17 — all features work, touch targets are adequate, and the layout is correct at 375px.

## Error Handling

OMDB API fails: The fetch throws and is caught in a try/catch block. A red alert banner with role="alert" appears near the search bar with a plain-language message. The rest of the page is unaffected.

AI Gemini fails: The API route returns a 500. The frontend shows a red error banner with a Retry button in the recommendations section only. The movie detail, poster, plot, and cast information remain visible. The user can retry without refreshing.

Empty search results: OMDB returns Response: "False" which is handled explicitly. A friendly no results found message appears showing the search term that was used so the user knows the search ran correctly.

Network unavailable: fetch throws a network error which is caught and shows "Something went wrong. Please try again." with no unhandled exception reaching the user.

Invalid AI JSON response: JSON.parse throws, is caught in the API route, a 500 is returned, and the frontend shows the retry option. No raw error text is ever shown to the user.

Movie ID not found: The detail page fetch catches the error and renders a full error state with a back to search link so the user is never stranded.

Missing environment variable: The API route checks for the key before making any external call and returns a 400 with a descriptive error message if it is missing.

Rate limit exceeded: The API route returns a 429 with a plain message. The frontend shows this as an error banner with a message telling the user to try again in a moment.

## Known Limitations

OMDB free tier is capped at 1,000 requests per day. Heavy usage will hit the rate limit and searches will fail until the next day. AI recommendations are not cached so every button click makes a fresh Gemini API call even for movies that have been recommended before. The recommendation click-to-find feature searches OMDB by title string so a common title may link to the wrong film. There are no user accounts so there is no way to save favorites or watch history between sessions. OMDB search returns a maximum of 10 results per page and pagination is not implemented so only the first 10 matches are shown. Gemini response time varies from 3 to 8 seconds depending on API load. The in-memory rate limiter resets when the serverless function cold-starts so it does not persist across all instances in a high-traffic deployment.

## Future Improvements

Pagination to load additional results beyond the first 10 OMDB matches. A favorites system using localStorage or a database so users can save movies between sessions. Recommendation caching by imdbID using Redis or Vercel KV to avoid repeated Gemini calls for the same movie. Advanced search filters for genre, year range, IMDb rating minimum, and runtime. Watch provider integration to show which streaming services have the film. End-to-end tests with Playwright covering the full search to recommendation flow. A persistent rate limiter using Redis or Upstash so limits hold across all serverless instances. Offline support via a service worker for basic functionality without a network connection. A light mode toggle since the application is currently dark mode only.

## Technical and Design Decisions

Next.js App Router was chosen over Pages Router for native Server Component support, which eliminates client-side JavaScript for the initial render of data-only pages and improves both performance and SEO. TypeScript was used throughout rather than JavaScript to catch prop mismatches and API response shape errors at compile time rather than at runtime in production. Tailwind CSS was chosen over a component library for full control over the dark color scheme and to avoid shipping unused CSS. The Gemini API call was placed in a Next.js API route rather than called directly from the browser to keep the API key server-side only and to enable server-side rate limiting. Structured JSON output was chosen over natural language parsing because it is deterministic, type-safe, and does not require regex or text parsing that could break on minor wording changes. The recommendation click-to-find flow uses a two-step lookup — search OMDB by title then redirect to the imdbID — rather than hard-coding links, because Gemini returns titles as strings and imdbIDs are not available in the AI response.

## Author

Mohammad Umer Khan
CS Undergraduate, FAST-NUCES Karachi
FlyRank AI Internship — Front-end AI Engineering Track, July 2026
GitHub: https://github.com/UmerKhan2004
LinkedIn: https://linkedin.com/in/mohammadumer21
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MovieAI — AI-Powered Movie Search",
  description: "Search movies and get AI recommendations powered by Claude",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-neutral-950 text-white min-h-screen`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                     rounded bg-white px-4 py-2 text-black font-medium z-50"
        >
          Skip to main content
        </a>
        <header className="border-b border-neutral-800">
          <nav
            aria-label="Main navigation"
            className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between"
          >
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-neutral-300 
                         focus:outline-none focus:ring-2 focus:ring-white rounded"
            >
              Movie<span className="text-neutral-400">AI</span>
            </Link>
            <ul className="flex gap-6 text-sm text-neutral-400" role="list">
              <li>
                <Link
                  href="/movies"
                  className="hover:text-white transition-colors focus:outline-none 
                             focus:ring-2 focus:ring-white rounded"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/health"
                  className="hover:text-white transition-colors focus:outline-none 
                             focus:ring-2 focus:ring-white rounded"
                >
                  Status
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Movie Search App",
  description: "FlyRank AI Internship Capstone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#0B0E14] text-[#EDE7DA] min-h-screen`}>
        <nav className="border-b border-neutral-800 px-6 py-4 flex gap-6 text-sm text-neutral-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/search" className="hover:text-white">Search</Link>
          <Link href="/favorites" className="hover:text-white">Favorites</Link>
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/profile" className="hover:text-white">Profile</Link>
          <Link href="/health" className="hover:text-white">Health</Link>
        </nav>
        <main className="px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
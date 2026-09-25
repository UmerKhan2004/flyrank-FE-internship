"use client";
import { useState } from "react";

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export default function Disclosure({ title, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-700 rounded-lg">
      <button
        aria-expanded={isOpen}
        aria-controls="disclosure-content"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-white font-medium"
      >
        {title}
        <span aria-hidden="true" className="text-neutral-400">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      <div
        id="disclosure-content"
        hidden={!isOpen}
        className="px-4 pb-4 text-neutral-300"
      >
        {children}
      </div>
    </div>
  );
}
"use client";
import { useState, useRef } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      const next = (index + 1) % tabs.length;
      tabRefs.current[next]?.focus();
      setActiveTab(tabs[next].id);
    }
    if (e.key === "ArrowLeft") {
      const prev = (index - 1 + tabs.length) % tabs.length;
      tabRefs.current[prev]?.focus();
      setActiveTab(tabs[prev].id);
    }
    if (e.key === "Home") {
      tabRefs.current[0]?.focus();
      setActiveTab(tabs[0].id);
    }
    if (e.key === "End") {
      const last = tabs.length - 1;
      tabRefs.current[last]?.focus();
      setActiveTab(tabs[last].id);
    }
  };

  return (
    <div>
      <div role="tablist" className="flex border-b border-neutral-700">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            ref={(el) => { tabRefs.current[index] = el; }}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-white text-white"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== tab.id}
          className="p-4 text-neutral-300"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
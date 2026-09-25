"use client";
import { useState } from "react";
import Modal from "./Modal";
import Tabs from "./Tabs";
import Disclosure from "./Disclosure";

const tabs = [
  { id: "tab1", label: "Tab One", content: <p>Content for tab one.</p> },
  { id: "tab2", label: "Tab Two", content: <p>Content for tab two.</p> },
  { id: "tab3", label: "Tab Three", content: <p>Content for tab three.</p> },
];

export default function PlaygroundPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold text-white">Component Playground</h1>

      {/* Modal */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Modal Dialog</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded bg-white px-4 py-2 text-black font-medium hover:bg-neutral-200"
        >
          Open Modal
        </button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Example Modal"
        >
          <p>This modal traps focus and closes on Escape key.</p>
        </Modal>
      </section>

      {/* Tabs */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Tabs</h2>
        <Tabs tabs={tabs} />
      </section>

      {/* Disclosure */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Disclosure</h2>
        <Disclosure title="What is accessibility?">
          <p>
            Accessibility means building products usable by everyone,
            including people who use keyboards or screen readers.
          </p>
        </Disclosure>
      </section>
    </div>
  );
}
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  items: FAQItem[];
}

const FAQSection = ({ title = "Frequently Asked Questions", items }: FAQSectionProps) => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
        {title}
      </h2>
      <div className="divide-y divide-emerald-tint/50 border border-emerald-tint/50 rounded-xl overflow-hidden bg-card">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-emerald-tint/20 transition"
              >
                <span className="font-body font-semibold text-foreground text-sm md:text-base">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-light shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const buildFaqJsonLd = (items: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: i.answer,
    },
  })),
});

export default FAQSection;



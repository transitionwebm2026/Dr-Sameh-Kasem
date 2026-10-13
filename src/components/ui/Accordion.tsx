"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

export function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <StaggerGroup className="space-y-4 max-w-4xl mx-auto">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <StaggerItem key={item.q}>
            <GlassCard
              as="div"
              hover={false}
              className="rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 text-start px-6 py-5 font-bold text-brand-forest"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-brand-gold transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="whitespace-pre-line px-6 pb-6 text-sm leading-relaxed text-brand-800/80">
                      {item.a}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </GlassCard>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  );
}

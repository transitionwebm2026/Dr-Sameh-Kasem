"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { FadeIn } from "@/components/motion/FadeIn";

type Review = {
  name: string;
  rating: number;
  text: string;
};

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function TestimonialsSlider({
  eyebrow,
  title,
  text,
  cta,
  items,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  cta: string;
  items: Review[];
}) {
  const groupSize = 3;
  const groups: Review[][] = [];
  for (let i = 0; i < items.length; i += groupSize) {
    groups.push(items.slice(i, i + groupSize));
  }

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || groups.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % groups.length);
    }, 5500);
    return () => clearInterval(id);
  }, [paused, groups.length]);

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden" id="testimonials">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} text={text} />

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {groups[index]?.map((review) => (
                <GlassCard key={review.name} className="p-8 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-brand-800 leading-relaxed font-medium">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-brand-900/10 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-brand-forest text-brand-gold flex items-center justify-center font-bold shrink-0">
                      {initials(review.name)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-brand-forest">{review.name}</h3>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </AnimatePresence>

          {groups.length > 1 ? (
            <div className="flex items-center justify-center gap-2 mt-10">
              {groups.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-brand-gold" : "w-2 bg-brand-900/15"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-14 text-center">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-brand-forest text-white font-bold text-sm hover:bg-brand-900 transition-all duration-300 shadow-xl hover:scale-105 border border-emerald-700/30"
            >
              <span>{cta}</span>
              <ArrowRight className="w-4 h-4 text-brand-gold rtl:rotate-180" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

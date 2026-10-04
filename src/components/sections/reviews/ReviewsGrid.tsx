"use client";

import { Quote } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StarRating } from "@/components/ui/StarRating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type Review = {
  name: string;
  category: string;
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

export function ReviewsGrid({
  eyebrow,
  title,
  text,
  items,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  items: Review[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} text={text} />

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((review) => (
            <StaggerItem key={review.name}>
              <GlassCard className="p-8 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <StarRating rating={review.rating} />
                    <div className="w-9 h-9 rounded-full bg-gradient-to-b from-white to-brand-100/50 shadow-inner flex items-center justify-center shrink-0">
                      <Quote className="w-4 h-4 text-brand-gold" strokeWidth={1.8} />
                    </div>
                  </div>
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
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

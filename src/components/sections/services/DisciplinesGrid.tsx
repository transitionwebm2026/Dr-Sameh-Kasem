"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getCardImage, isIconImage } from "@/lib/icons";
import type { Discipline } from "@/lib/services";

export function DisciplinesGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Discipline[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <StaggerGroup className="flex flex-wrap justify-center gap-8">
          {items.map((item) => (
            <StaggerItem
              key={item.title}
              className="w-full sm:w-[calc((100%_-_2rem)/2)] lg:w-[calc((100%_-_4rem)/3)]"
            >
              <GlassCard className="overflow-hidden h-full flex flex-col group">
                <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                  <Image
                    src={isIconImage(item.icon) ? item.icon : getCardImage(item.icon) ?? "/images/brain.png"}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-bold text-brand-forest leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-800/80 leading-relaxed">{item.text}</p>
                  <ul className="mt-1 space-y-2 border-t border-brand-900/10 pt-3">
                    {item.conditions.map((condition) => (
                      <li
                        key={condition.title}
                        className="flex items-start gap-2 text-xs sm:text-sm text-brand-800/75"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold"
                          aria-hidden="true"
                        />
                        <span>{condition.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getCardImage, isIconImage } from "@/lib/icons";
import type { Discipline } from "@/lib/services";

export function ConditionDetailsGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Discipline[];
}) {
  const groups = items.filter((item) => item.conditions.length > 0);

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="space-y-16">
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-6 flex items-center gap-3 font-tajawal text-xl sm:text-2xl font-bold text-brand-forest">
                <span className="h-6 w-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
                {group.title}
              </h3>
              <StaggerGroup className="flex flex-wrap justify-center gap-6">
                {group.conditions.map((condition) => (
                  <StaggerItem
                    key={condition.title}
                    className="w-full sm:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
                  >
                    <GlassCard className="overflow-hidden h-full flex flex-col group">
                      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-brand-forest/5">
                        <Image
                          src={
                            condition.image ||
                            (isIconImage(group.icon) ? group.icon : getCardImage(group.icon)) ||
                            "/images/brain.png"
                          }
                          alt={condition.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-contain p-5 group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col gap-2 flex-1">
                        <h4 className="text-base font-bold text-brand-forest leading-snug">
                          {condition.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-brand-800/80 leading-relaxed">
                          {condition.text}
                        </p>
                      </div>
                    </GlassCard>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

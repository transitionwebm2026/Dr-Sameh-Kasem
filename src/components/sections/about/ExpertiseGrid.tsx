import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

const fallbackImages = [
  "/images/brain.png",
  "/images/spine.png",
  "/images/pediatric.png",
  "/images/nerves.png",
];

type Item = { title: string; text: string; image?: string };

export function ExpertiseGrid({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Item[];
}) {
  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <StaggerGroup className="flex flex-wrap justify-center gap-8">
          {items.map((item, index) => (
            <StaggerItem
              key={item.title}
              className="w-full sm:w-[calc((100%_-_2rem)/2)] lg:w-[calc((100%_-_6rem)/4)]"
            >
              <GlassCard className="overflow-hidden h-full flex flex-col group">
                <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-brand-forest/5">
                  <Image
                    src={item.image || fallbackImages[index % fallbackImages.length]}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <h3 className="text-base font-bold text-brand-forest">{item.title}</h3>
                  <p className="text-sm text-brand-800/80 leading-relaxed">{item.text}</p>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

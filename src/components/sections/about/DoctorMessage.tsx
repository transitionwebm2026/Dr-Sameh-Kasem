import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";

export function DoctorMessage({
  badgeLabel,
  headline,
  paragraphs,
  name,
  role,
  signature,
  qualificationShort,
  qualificationFull,
  image,
  imageAlt,
}: {
  badgeLabel: string;
  headline: string;
  paragraphs: string[];
  name: string;
  role: string;
  signature: string;
  qualificationShort: string;
  qualificationFull: string;
  image: string;
  imageAlt: string;
}) {
  return (
    <section className="py-20 bg-brand-ivory relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8">
          {/* Image column: reading-start (right in RTL, left in LTR); 5 of 12 columns */}
          <FadeIn direction="right" className="relative lg:col-span-5">
            <div
              className="absolute -top-8 -start-8 w-56 h-56 rounded-full bg-brand-gold/15 blur-3xl animate-float"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-8 -end-8 w-64 h-64 rounded-full bg-brand-700/15 blur-3xl animate-float-slow"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-sm lg:max-w-none rounded-[2rem] border border-white/60 bg-white/30 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-[88%] max-w-xs">
                <div className="liquid-glass-dark rounded-2xl sm:rounded-full px-4 sm:px-5 py-2.5 text-center">
                  <div className="text-xs font-bold text-brand-gold">{qualificationShort}</div>
                  <div className="text-[10px] text-white/90">{qualificationFull}</div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Text column: reading-end (left in RTL, right in LTR); 7 of 12 columns */}
          <FadeIn direction="left" delay={0.1} className="lg:col-span-7 text-center lg:text-start">
            <h2 className="mb-6 font-tajawal text-2xl sm:text-3xl lg:text-4xl font-black leading-snug text-brand-forest text-balance">
              {headline}
            </h2>
            <div className="space-y-4 text-brand-800/80 leading-relaxed">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-between">
              <div>
                <div className="text-lg font-bold text-brand-forest">{name}</div>
                <div className="mt-1 text-sm font-semibold text-brand-gold">{role}</div>
              </div>
              <span className="font-playfair text-xl italic text-brand-forest/50">{signature}</span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

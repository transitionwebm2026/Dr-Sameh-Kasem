"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { useVideoModal } from "@/components/ui/VideoModal";

type Video = { category: string; title: string; duration: string; videoUrl?: string; image?: string };

export function VideosGrid({ items }: { items: Video[] }) {
  const { openVideo } = useVideoModal();

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-full w-full opacity-40"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 220 C 250 160, 450 280, 700 210 S 1100 140, 1200 200"
          fill="none"
          stroke="#c5a059"
          strokeOpacity="0.16"
          strokeWidth="2"
        />
        <path
          d="M0 480 C 280 420, 500 540, 750 470 S 1080 400, 1200 460"
          fill="none"
          stroke="#0a2a22"
          strokeOpacity="0.07"
          strokeWidth="2"
        />
      </svg>
      <AmbientGlow />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
          {items.map((video) => (
            <StaggerItem key={video.title}>
              <button
                type="button"
                onClick={() => openVideo(video.videoUrl, video.title)}
                aria-label={video.title}
                className="group relative block w-full rounded-3xl overflow-hidden aspect-[9/16] bg-brand-forest shadow-luxury text-start"
              >
                {video.image ? (
                  <>
                    <Image
                      src={video.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-700/70 via-brand-900/80 to-brand-deep group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-16 h-16 rounded-full bg-brand-gold/40 blur-xl group-hover:bg-brand-gold/60 transition-all" />
                  <span className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-gold text-brand-forest flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current -translate-x-0.5 rtl:translate-x-0.5" />
                  </span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="block text-[10px] text-brand-gold font-bold uppercase tracking-wide">
                    {video.category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-brand-goldLight leading-snug line-clamp-2 mt-1">
                    {video.title}
                  </h3>
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

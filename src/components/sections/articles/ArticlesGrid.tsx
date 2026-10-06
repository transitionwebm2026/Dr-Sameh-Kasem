"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getArticleImage, type Article } from "@/lib/articles";

export function ArticlesGrid({ items }: { items: Article[] }) {
  const common = useTranslations("common");

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((article) => (
            <StaggerItem key={article.title}>
              <GlassCard className="overflow-hidden h-full flex flex-col group">
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-brand-forest/5">
                  <Image
                    src={article.image ?? getArticleImage(article.category)}
                    alt={article.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <span className="text-[11px] text-brand-gold font-bold uppercase tracking-wide">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold text-brand-forest leading-snug group-hover:text-brand-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-800/80 leading-relaxed flex-1">
                    {article.text}
                  </p>
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-brand-900/10">
                    <span className="text-[11px] text-brand-700 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {article.date}
                    </span>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest group-hover:text-brand-gold transition-colors"
                    >
                      <span>{common("readMore")}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
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

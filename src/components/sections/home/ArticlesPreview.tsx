"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { FadeIn } from "@/components/motion/FadeIn";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { getArticleImage } from "@/lib/articles";

type ArticlePreviewItem = { title: string; text: string; slug: string; category: string; image?: string };

export function ArticlesPreview({
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
  items: ArticlePreviewItem[];
}) {
  const common = useTranslations("common");

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden" id="articles">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={eyebrow} title={title} text={text} />

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((article) => (
            <StaggerItem key={article.title}>
              <GlassCard className="overflow-hidden h-full flex flex-col group">
                <div className="relative h-44 sm:h-48 w-full overflow-hidden">
                  <Image
                    src={article.image ?? getArticleImage(article.category)}
                    alt={article.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2 flex-1">
                  <h3 className="text-base font-bold text-brand-forest leading-snug group-hover:text-brand-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-800/80 leading-relaxed flex-1">
                    {article.text}
                  </p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-brand-forest transition-colors pt-2"
                  >
                    <span>{common("readMore")}</span>
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                  </Link>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <FadeIn delay={0.2}>
          <div className="mt-14 text-center">
            <Link
              href="/articles"
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

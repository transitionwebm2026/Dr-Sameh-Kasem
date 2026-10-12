import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/motion/FadeIn";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { getArticleImage, type Article } from "@/lib/articles";

export function FeaturedArticle({ featured }: { featured: Article }) {
  const common = useTranslations("common");
  const image = featured.image ?? getArticleImage(featured.category);

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <div className="liquid-glass glass-interactive rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 group">
            <div className="relative h-72 lg:h-full min-h-[320px] overflow-hidden">
              <Image
                src={image}
                alt={featured.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 sm:p-10 flex flex-col justify-center gap-4">
              {featured.readTime ? (
                <span className="text-xs text-brand-700 font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {featured.readTime}
                </span>
              ) : null}
              <h2 className="text-2xl sm:text-3xl font-black text-brand-forest font-tajawal leading-snug text-balance">
                {featured.title}
              </h2>
              <p className="text-sm sm:text-base text-brand-800/80 leading-relaxed">
                {featured.text}
              </p>
              <Link
                href={`/articles/${featured.slug}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-brand-forest hover:text-brand-gold transition-colors pt-2 self-start"
              >
                <span>{common("readMore")}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

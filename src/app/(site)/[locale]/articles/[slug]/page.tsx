import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo";
import { getPageBySlug } from "@/lib/controllers/pages";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { pickLocale, metaString, finalCtaProps } from "@/lib/cms-render";
import type { Section } from "@/lib/cms-types";
import { getArticleImage, listArticleSlugs, type Article } from "@/lib/articles";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { FadeIn } from "@/components/motion/FadeIn";
import { FinalCta } from "@/components/layout/FinalCta";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const slugs = await listArticleSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

async function getArticle(locale: string, slug: string): Promise<Article | undefined> {
  const isAr = locale === "ar";
  const pageResult = await getPageBySlug("articles");
  if (!pageResult.ok || !pageResult.data) return undefined;

  const sectionsResult = await listSectionsByPageId(pageResult.data.id);
  const section = sectionsResult.ok
    ? sectionsResult.data.find((s) => s.section_key === "articlesSection")
    : undefined;
  if (!section) return undefined;

  const itemsResult = await listContentItemsBySection(section.id);
  if (!itemsResult.ok) return undefined;
  const items = itemsResult.data;

  const articleRow = items.find((item) => !item.parent_id && metaString(item.meta, "slug") === slug);
  if (!articleRow) return undefined;

  const paragraphs = items
    .filter((item) => item.parent_id === articleRow.id)
    .sort((a, b) => a.order_index - b.order_index)
    .map((item) => pickLocale(locale, item.text_en, item.text_ar));

  return {
    slug,
    date: metaString(articleRow.meta, isAr ? "date_ar" : "date_en"),
    readTime: metaString(articleRow.meta, isAr ? "read_time_ar" : "read_time_en"),
    category: metaString(articleRow.meta, isAr ? "category_ar" : "category_en"),
    title: pickLocale(locale, articleRow.title_en, articleRow.title_ar),
    text: pickLocale(locale, articleRow.text_en, articleRow.text_ar),
    content: paragraphs,
    image: articleRow.image_url ?? undefined,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticle(locale, slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.text,
    alternates: buildAlternates(locale, `/articles/${slug}`),
    openGraph: {
      description: article.text,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = await getArticle(locale, slug);
  if (!article) notFound();

  const common = await getTranslations({ locale, namespace: "common" });
  const image = article.image ?? getArticleImage(article.category);

  let finalCtaSection: Section | undefined;
  const pageResult = await getPageBySlug("articles");
  if (pageResult.ok && pageResult.data) {
    const sectionsResult = await listSectionsByPageId(pageResult.data.id);
    if (sectionsResult.ok) {
      finalCtaSection = sectionsResult.data.find((s) => s.section_key === "finalCta");
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-brand-ivory pt-28 pb-16 sm:pt-32">
        <AmbientGlow />
        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-forest/70 hover:text-brand-gold transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
              <span>{common("backToArticles")}</span>
            </Link>
          </FadeIn>

          <FadeIn delay={0.05}>
            <span className="mt-6 inline-flex w-fit items-center rounded-full bg-brand-gold/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-brand-gold">
              {article.category}
            </span>
            <h1 className="mt-4 text-balance font-tajawal text-3xl font-black leading-tight tracking-tight text-brand-forest sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-brand-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-3xl border border-white/60 shadow-2xl">
              <Image
                src={image}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 768px, 100vw"
                className={article.image ? "object-cover" : "object-contain bg-brand-forest/5 p-10"}
                priority
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-brand-ivory pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <FadeIn delay={0.05}>
            <div className="space-y-5 text-base leading-relaxed text-brand-900/85 sm:text-lg">
              {article.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-brand-900/10 bg-white/60 p-5 text-xs leading-relaxed text-brand-700/80 sm:text-sm">
              {common("medicalDisclaimer")}
            </div>

            <div className="mt-10 border-t border-brand-900/10 pt-8">
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 rounded-full bg-brand-forest px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-brand-900 hover:scale-105 shadow-lg"
              >
                <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
                <span>{common("backToArticles")}</span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <FinalCta {...finalCtaProps(locale, finalCtaSection)} />
    </>
  );
}

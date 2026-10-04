import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getPageBySlug } from "@/lib/controllers/pages";
import { getHeroByPageId } from "@/lib/controllers/heroes";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { pickLocale, sectionHeading, metaString, finalCtaProps } from "@/lib/cms-render";
import { getVideoThumbnail } from "@/lib/video";
import type { ContentItem, PageHero, Section } from "@/lib/cms-types";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { AboutPreview } from "@/components/sections/home/AboutPreview";
import { SurgeriesGrid } from "@/components/sections/home/SurgeriesGrid";
import { TreatmentsGrid } from "@/components/sections/home/TreatmentsGrid";
import { TestimonialsSlider } from "@/components/sections/home/TestimonialsSlider";
import { VideosPreview } from "@/components/sections/home/VideosPreview";
import { ArticlesPreview } from "@/components/sections/home/ArticlesPreview";
import { FaqSection } from "@/components/sections/home/FaqSection";
import { HeroStatsBar } from "@/components/layout/HeroStatsBar";
import { FinalCta } from "@/components/layout/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "meta.pages.home" });
  const description = meta("description");

  const pageResult = await getPageBySlug("home");
  const heroResult = pageResult.ok && pageResult.data ? await getHeroByPageId(pageResult.data.id) : null;
  const hero = heroResult?.ok ? heroResult.data : null;
  const isAr = locale === "ar";
  const title = hero
    ? `${isAr ? hero.title_ar : hero.title_en} ${(isAr ? hero.title_highlight_ar : hero.title_highlight_en) ?? ""}`.trim()
    : meta("description");

  return {
    title,
    description,
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const common = await getTranslations({ locale, namespace: "common" });

  const pageResult = await getPageBySlug("home");
  const pageId = pageResult.ok ? pageResult.data?.id : undefined;

  let hero: PageHero | null = null;
  let sections: Section[] = [];
  const itemsBySectionKey = new Map<string, ContentItem[]>();

  if (pageId) {
    const [heroResult, sectionsResult] = await Promise.all([
      getHeroByPageId(pageId),
      listSectionsByPageId(pageId),
    ]);
    hero = heroResult.ok ? heroResult.data : null;
    sections = sectionsResult.ok ? sectionsResult.data : [];

    await Promise.all(
      sections.map(async (section) => {
        const itemsResult = await listContentItemsBySection(section.id);
        itemsBySectionKey.set(section.section_key, itemsResult.ok ? itemsResult.data : []);
      })
    );
  }

  const sectionByKey = (key: string) => sections.find((s) => s.section_key === key);
  const itemsFor = (key: string) => itemsBySectionKey.get(key) ?? [];

  const aboutSection = sectionByKey("about");
  const aboutMeta = aboutSection?.meta ?? {};
  const aboutBullets = itemsFor("about").map((item) => ({
    icon: item.icon ?? "activity",
    title: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
  }));

  const surgeriesHeading = sectionHeading(locale, sectionByKey("surgeriesSection"));
  const surgeriesItems = itemsFor("surgeriesSection").map((item) => ({
    icon: item.icon ?? "activity",
    title: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
  }));

  const treatmentsHeading = sectionHeading(locale, sectionByKey("treatmentsSection"));
  const treatmentsItems = itemsFor("treatmentsSection").map((item) => ({
    title: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
    note: metaString(item.meta, isAr ? "note_ar" : "note_en"),
    image: item.image_url ?? undefined,
  }));

  const testimonialsHeading = sectionHeading(locale, sectionByKey("testimonialsSection"));
  const testimonialsItems = itemsFor("testimonialsSection").map((item) => ({
    name: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
    rating: typeof item.meta.rating === "number" ? item.meta.rating : 5,
  }));

  const videosHeading = sectionHeading(locale, sectionByKey("videosSection"));
  const videosItems = itemsFor("videosSection").map((item) => {
    const videoUrl = metaString(item.meta, "video_url");
    return {
      title: pickLocale(locale, item.title_en, item.title_ar),
      category: metaString(item.meta, isAr ? "category_ar" : "category_en"),
      duration: metaString(item.meta, "duration"),
      videoUrl,
      image: item.image_url || getVideoThumbnail(videoUrl) || undefined,
    };
  });

  const articlesHeading = sectionHeading(locale, sectionByKey("articlesSection"));
  const articlesItems = itemsFor("articlesSection").map((item) => ({
    title: pickLocale(locale, item.title_en, item.title_ar),
    text: pickLocale(locale, item.text_en, item.text_ar),
    slug: metaString(item.meta, "slug"),
    category: metaString(item.meta, isAr ? "category_ar" : "category_en"),
  }));

  const faqHeading = sectionHeading(locale, sectionByKey("faqSection"));
  const faqItems = itemsFor("faqSection").map((item) => ({
    q: pickLocale(locale, item.title_en, item.title_ar),
    a: pickLocale(locale, item.text_en, item.text_ar),
  }));

  const statsItems = itemsFor("statsSection").map((item) => ({
    icon: item.icon ?? "activity",
    label: pickLocale(locale, item.title_en, item.title_ar),
    value: typeof item.meta.value === "number" ? item.meta.value : 0,
    suffix: metaString(item.meta, "suffix"),
  }));

  return (
    <>
      <GlobalHeroSection
        title={hero ? pickLocale(locale, hero.title_en, hero.title_ar) : ""}
        titleHighlight={hero ? pickLocale(locale, hero.title_highlight_en, hero.title_highlight_ar) : ""}
        subtitle={hero ? pickLocale(locale, hero.subtitle_en, hero.subtitle_ar) : ""}
        primaryCta={{
          label: hero ? pickLocale(locale, hero.primary_cta_label_en, hero.primary_cta_label_ar) : "",
          href: hero?.primary_cta_href || "/contact",
        }}
        secondaryCta={{
          label: hero ? pickLocale(locale, hero.secondary_cta_label_en, hero.secondary_cta_label_ar) : "",
          href: hero?.secondary_cta_href || "/services",
        }}
        followLabel={hero ? pickLocale(locale, hero.follow_label_en, hero.follow_label_ar) : common("followUs")}
        showDoctor
        doctorImage={hero?.image_url ?? ""}
        doctorImageAlt={hero ? pickLocale(locale, hero.title_en, hero.title_ar) : ""}
        bg3DElement={hero?.bg_3d_element ?? "brain"}
        bookingCard={{
          title: (hero ? pickLocale(locale, hero.booking_card_title_en, hero.booking_card_title_ar) : "") || common("bookingCard.title"),
          text: (hero ? pickLocale(locale, hero.booking_card_text_en, hero.booking_card_text_ar) : "") || common("bookingCard.text"),
          cta: (hero ? pickLocale(locale, hero.booking_card_cta_en, hero.booking_card_cta_ar) : "") || common("bookingCard.cta"),
        }}
        reserveOverlapSpace
      />
      {/* The booking card only floats independently of the text column from
          `lg:` up (see GlobalHeroSection) — below that it stacks in normal
          flow, so overlapping the hero there would cover real content
          instead of empty background. At `lg:`+, the hero reserves a fixed
          `reserveOverlapSpace` zone (guaranteed empty regardless of viewport
          aspect ratio), and this pulls the bar up by exactly half its own
          height so it straddles the boundary without ever reaching the
          hero's actual text/CTAs. */}
      <div className="relative z-20 -mt-6 lg:-mt-12">
        <HeroStatsBar stats={statsItems} />
      </div>
      <AboutPreview
        eyebrow={sectionHeading(locale, aboutSection).eyebrow}
        image={aboutSection?.image_url ?? ""}
        mainTitle={metaString(aboutMeta, isAr ? "main_title_ar" : "main_title_en")}
        bullets={aboutBullets}
        cta={metaString(aboutMeta, isAr ? "cta_ar" : "cta_en")}
        videoUrl={metaString(aboutMeta, "video_url")}
      />
      <SurgeriesGrid
        eyebrow={surgeriesHeading.eyebrow}
        title={surgeriesHeading.title}
        text={surgeriesHeading.text}
        cta={metaString(sectionByKey("surgeriesSection")?.meta ?? {}, isAr ? "cta_ar" : "cta_en")}
        items={surgeriesItems}
      />
      <TreatmentsGrid
        eyebrow={treatmentsHeading.eyebrow}
        title={treatmentsHeading.title}
        text={treatmentsHeading.text}
        cta={metaString(sectionByKey("treatmentsSection")?.meta ?? {}, isAr ? "cta_ar" : "cta_en")}
        items={treatmentsItems}
      />
      <TestimonialsSlider
        eyebrow={testimonialsHeading.eyebrow}
        title={testimonialsHeading.title}
        text={testimonialsHeading.text}
        cta={metaString(sectionByKey("testimonialsSection")?.meta ?? {}, isAr ? "cta_ar" : "cta_en")}
        items={testimonialsItems}
      />
      <VideosPreview
        eyebrow={videosHeading.eyebrow}
        title={videosHeading.title}
        text={videosHeading.text}
        cta={metaString(sectionByKey("videosSection")?.meta ?? {}, isAr ? "cta_ar" : "cta_en")}
        items={videosItems}
      />
      <ArticlesPreview
        eyebrow={articlesHeading.eyebrow}
        title={articlesHeading.title}
        text={articlesHeading.text}
        cta={metaString(sectionByKey("articlesSection")?.meta ?? {}, isAr ? "cta_ar" : "cta_en")}
        items={articlesItems}
      />
      <FaqSection
        eyebrow={faqHeading.eyebrow}
        title={faqHeading.title}
        text={faqHeading.text}
        items={faqItems}
      />
      <FinalCta {...finalCtaProps(locale, sectionByKey("finalCta"))} />
    </>
  );
}

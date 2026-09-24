import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import { getPageBySlug } from "@/lib/controllers/pages";
import { getHeroByPageId } from "@/lib/controllers/heroes";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { pickLocale, sectionHeading, finalCtaProps } from "@/lib/cms-render";
import type { ContentItem, PageHero, Section } from "@/lib/cms-types";
import { getSiteSettingsOrDefault } from "@/lib/controllers/siteSettings";
import { GlobalHeroSection } from "@/components/layout/GlobalHeroSection";
import { BookingForm } from "@/components/forms/BookingForm";
import { ClinicInfo } from "@/components/sections/contact/ClinicInfo";
import { ClinicMap } from "@/components/sections/contact/ClinicMap";
import { FaqBlock } from "@/components/sections/shared/FaqBlock";
import { FinalCta } from "@/components/layout/FinalCta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = await getTranslations({ locale, namespace: "meta.pages.contact" });
  const description = meta("description");

  const pageResult = await getPageBySlug("contact");
  const heroResult = pageResult.ok && pageResult.data ? await getHeroByPageId(pageResult.data.id) : null;
  const hero = heroResult?.ok ? heroResult.data : null;
  const isAr = locale === "ar";
  const title = hero
    ? `${isAr ? hero.title_ar : hero.title_en} ${(isAr ? hero.title_highlight_ar : hero.title_highlight_en) ?? ""}`.trim()
    : meta("description");

  return {
    title,
    description,
    alternates: buildAlternates(locale, "/contact"),
    openGraph: {
      description,
      images: [{ url: `/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const common = await getTranslations({ locale, namespace: "common" });

  const pageResult = await getPageBySlug("contact");
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

  const faqHeading = sectionHeading(locale, sectionByKey("faq"));
  const faqItems = itemsFor("faq").map((item) => ({
    q: pickLocale(locale, item.title_en, item.title_ar),
    a: pickLocale(locale, item.text_en, item.text_ar),
  }));

  const contact = await getSiteSettingsOrDefault();
  const whatsappNumber = contact.whatsapp_number;

  return (
    <>
      <GlobalHeroSection
        title={hero ? pickLocale(locale, hero.title_en, hero.title_ar) : ""}
        titleHighlight={hero ? pickLocale(locale, hero.title_highlight_en, hero.title_highlight_ar) : ""}
        subtitle={hero ? pickLocale(locale, hero.subtitle_en, hero.subtitle_ar) : ""}
        primaryCta={{
          label: hero ? pickLocale(locale, hero.primary_cta_label_en, hero.primary_cta_label_ar) : "",
          href: hero?.primary_cta_href || "tel:+201001234567",
        }}
        secondaryCta={{
          label: hero ? pickLocale(locale, hero.secondary_cta_label_en, hero.secondary_cta_label_ar) : "",
          href: hero?.secondary_cta_href || "#booking-form",
        }}
        followLabel={hero ? pickLocale(locale, hero.follow_label_en, hero.follow_label_ar) : common("followUs")}
        showDoctor
        doctorImage={hero?.image_url ?? ""}
        doctorImageAlt={hero ? pickLocale(locale, hero.title_en, hero.title_ar) : ""}
        bg3DElement={hero?.bg_3d_element ?? "skull"}
        bookingCard={{
          title: (hero ? pickLocale(locale, hero.booking_card_title_en, hero.booking_card_title_ar) : "") || common("bookingCard.title"),
          text: (hero ? pickLocale(locale, hero.booking_card_text_en, hero.booking_card_text_ar) : "") || common("bookingCard.text"),
          cta: (hero ? pickLocale(locale, hero.booking_card_cta_en, hero.booking_card_cta_ar) : "") || common("bookingCard.cta"),
        }}
      />
      <section className="py-24 bg-brand-ivory relative" id="booking-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="h-full flex flex-col gap-6 justify-between">
              <ClinicInfo locale={locale as "ar" | "en"} />
              <ClinicMap className="flex-1" />
            </div>
            <BookingForm whatsappNumber={whatsappNumber} />
          </div>
        </div>
      </section>
      <FaqBlock eyebrow={faqHeading.eyebrow} title={faqHeading.title} items={faqItems} />
      <FinalCta {...finalCtaProps(locale, sectionByKey("finalCta"))} />
    </>
  );
}

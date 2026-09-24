import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { cairo, tajawal, playfair, inter } from "@/lib/fonts";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettingsOrDefault } from "@/lib/controllers/siteSettings";
import { pickLocale } from "@/lib/cms-render";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { VideoModalProvider } from "@/components/ui/VideoModal";
import "../../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const isAr = locale === "ar";

  return {
    metadataBase: new URL(siteConfig.domain),
    title: {
      default: t("titleSuffix"),
      template: `%s | ${t("siteName")}`,
    },
    description: isAr
      ? "د. سامح قاسم، استشاري جراحة المخ والأعصاب والعمود الفقري. جراحات ميكروسكوبية دقيقة وتدخل محدود بأعلى معايير السلامة العالمية."
      : "Dr. Sameh Qassem, Consultant Neurosurgeon & Spine Surgeon. Precise microsurgery and minimally invasive care with world-class safety standards.",
    alternates: {
      languages: { ar: "/ar", en: "/en" },
    },
    openGraph: {
      title: t("titleSuffix"),
      siteName: t("siteName"),
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  const contact = await getSiteSettingsOrDefault();
  const navLinks = contact.nav_links.map((link) => ({
    href: link.href,
    label: pickLocale(locale, link.label_en, link.label_ar),
  }));
  const bookNowLabel = pickLocale(locale, contact.book_now_label_en, contact.book_now_label_ar);
  const footerContent = {
    bio: pickLocale(locale, contact.footer_bio_en, contact.footer_bio_ar),
    membership: pickLocale(locale, contact.footer_membership_en, contact.footer_membership_ar),
    guideLinks: contact.guide_links.map((link) => ({
      href: link.href,
      label: pickLocale(locale, link.label_en, link.label_ar),
    })),
    branches: contact.branches.map((branch) => ({
      label: pickLocale(locale, branch.label_en, branch.label_ar),
      text: pickLocale(locale, branch.text_en, branch.text_ar),
    })),
    hoursLabel: pickLocale(locale, contact.hours_label_en, contact.hours_label_ar),
    hoursText: pickLocale(locale, contact.hours_text_en, contact.hours_text_ar),
    copyright: pickLocale(locale, contact.copyright_en, contact.copyright_ar).replace(
      "{year}",
      String(new Date().getFullYear())
    ),
    disclaimer: pickLocale(locale, contact.disclaimer_en, contact.disclaimer_ar),
    email: contact.email,
  };

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${tajawal.variable} ${playfair.variable} ${inter.variable}`}
    >
      <body
        className={`antialiased bg-brand-ivory text-[#1e2d27] ${
          locale === "ar" ? "font-cairo" : "font-inter"
        }`}
      >
        <NextIntlClientProvider>
          <VideoModalProvider>
            <Navbar
              phoneHref={contact.phone_href}
              phoneDisplay={contact.phone_display}
              navLinks={navLinks}
              bookNowLabel={bookNowLabel}
            />
            <main>{children}</main>
            <Footer phoneDisplay={contact.phone_display} navLinks={navLinks} content={footerContent} />
            <FloatingActions phoneHref={contact.phone_href} whatsappNumber={contact.whatsapp_number} />
          </VideoModalProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

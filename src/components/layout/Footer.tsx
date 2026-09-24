import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";

export type FooterContent = {
  bio: string;
  membership: string;
  guideLinks: { href: string; label: string }[];
  branches: { label: string; text: string }[];
  hoursLabel: string;
  hoursText: string;
  copyright: string;
  disclaimer: string;
  email: string;
};

export function Footer({
  phoneDisplay,
  navLinks,
  content,
}: {
  phoneDisplay: string;
  navLinks: { href: string; label: string }[];
  content: FooterContent;
}) {
  const t = useTranslations("footer");
  const locale = useLocale() as "ar" | "en";

  return (
    <footer className="bg-brand-deep text-white border-t border-brand-gold/15 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 rounded-xl bg-white/95 p-1.5 shadow-sm">
                <Image src="/images/logo-icon.png" alt={siteConfig.name[locale]} fill sizes="40px" className="object-contain p-0.5" />
              </div>
              <div>
                <div className="font-black text-lg font-tajawal text-white">
                  {siteConfig.name[locale]}
                </div>
                <div className="text-xs text-brand-gold">{siteConfig.title[locale]}</div>
              </div>
            </div>
            <p className="text-xs text-brand-100/75 leading-relaxed">{content.bio}</p>
            <div className="text-xs text-brand-goldLight font-medium">{content.membership}</div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-base font-bold text-brand-gold uppercase tracking-wider">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-brand-100/80">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-base font-bold text-brand-gold uppercase tracking-wider">
              {t("patientGuides")}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-brand-100/80">
              {content.guideLinks.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-base font-bold text-brand-gold uppercase tracking-wider">
              {t("branches")}
            </h4>
            <div className="space-y-3 text-xs text-brand-100/80">
              {content.branches.map((branch, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" strokeWidth={1.8} />
                  <p>
                    <strong className="text-white">{branch.label}</strong> {branch.text}
                  </p>
                </div>
              ))}
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" strokeWidth={1.8} />
                <p>
                  <strong className="text-white">{content.hoursLabel}</strong> {content.hoursText}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" strokeWidth={1.8} />
                <p>
                  <strong className="text-white">{t("emailLabel")}</strong> {content.email}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" strokeWidth={1.8} />
                <p>
                  <strong className="text-white">{t("phoneLabel")}</strong>{" "}
                  <span dir="ltr">{phoneDisplay}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-8">
          <a
            href="https://transitioneg.com/"
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="group inline-flex items-center gap-2 sm:gap-3 rounded-full bg-gradient-to-r from-brand-forest via-brand-600 to-brand-gold px-4 py-2 sm:px-6 sm:py-3 shadow-lg shadow-black/30 transition-transform duration-300 hover:scale-105"
          >
            <span className="text-xs sm:text-sm font-extrabold text-white whitespace-nowrap">
              Transition
            </span>
            <span className="relative h-5 w-5 sm:h-6 sm:w-6 shrink-0">
              <Image src="/images/logo-01.png" alt="Transition" fill sizes="24px" className="object-contain" />
            </span>
            <span
              className="text-xs sm:text-sm font-bold text-white/90 whitespace-nowrap"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              {locale === "ar" ? "تصميم وتطوير" : "Design & Development"}
            </span>
          </a>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-100/60">
          <p>{content.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t("terms")}
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              {t("sitemap")}
            </Link>
          </div>
        </div>
        <p className="pt-6 text-[11px] text-brand-100/40 leading-relaxed max-w-3xl">
          {content.disclaimer}
        </p>
      </div>
    </footer>
  );
}

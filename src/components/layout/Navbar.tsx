"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Calendar } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitch } from "./LanguageSwitch";
import { MobileDrawer } from "./MobileDrawer";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Navbar({
  phoneHref,
  phoneDisplay,
  navLinks,
  bookNowLabel,
}: {
  phoneHref: string;
  phoneDisplay: string;
  navLinks: { href: string; label: string }[];
  bookNowLabel: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as "ar" | "en";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeDrawer = useCallback(() => setOpen(false), []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 w-full bg-brand-ivory/90 backdrop-blur-xl border-b border-brand-950/10 shadow-sm">
        <div className="w-full max-w-none px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20 gap-4">
            <Link href="/" className="flex items-center gap-3.5 group shrink-0">
              <div className="relative w-12 h-12 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Image src="/images/logo-icon.png" alt={siteConfig.name[locale]} fill sizes="48px" className="object-contain" priority />
              </div>
              <div className="flex-col hidden sm:flex">
                <span className="text-xl font-extrabold tracking-tight text-brand-forest font-tajawal group-hover:text-brand-600 transition-colors">
                  {siteConfig.name[locale]}
                </span>
                <span className="text-xs font-semibold text-brand-gold">
                  {siteConfig.title[locale]}
                </span>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center justify-center flex-1 gap-1 text-[14px] font-semibold text-brand-800">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200",
                      isActive
                        ? "text-brand-forest font-bold bg-brand-100/70"
                        : "hover:text-brand-gold hover:bg-brand-100/40"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden xl:block">
                <LanguageSwitch />
              </div>
              <Link
                href="/contact"
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-forest text-white hover:bg-brand-900 transition-all duration-300 shadow-md hover:shadow-emerald-glow hover:-translate-y-0.5 text-sm font-bold border border-emerald-700/30"
              >
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span>{bookNowLabel}</span>
              </Link>
              <button
                aria-label={t("menu")}
                aria-expanded={open}
                onClick={() => setOpen(true)}
                className="xl:hidden p-2.5 rounded-xl text-brand-900 hover:bg-brand-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={open}
        onClose={closeDrawer}
        phoneHref={phoneHref}
        phoneDisplay={phoneDisplay}
        navLinks={navLinks}
        bookNowLabel={bookNowLabel}
      />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { X, Calendar, ArrowRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitch } from "./LanguageSwitch";
import { cn } from "@/lib/utils";

export function MobileDrawer({
  open,
  onClose,
  phoneHref,
  phoneDisplay,
  navLinks,
  bookNowLabel,
}: {
  open: boolean;
  onClose: () => void;
  phoneHref: string;
  phoneDisplay: string;
  navLinks: { href: string; label: string }[];
  bookNowLabel: string;
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as "ar" | "en";
  const pathname = usePathname();
  const isRtl = locale === "ar";

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-brand-deep/60 backdrop-blur-sm xl:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: isRtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRtl ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label={t("menu")}
            className="fixed top-0 bottom-0 end-0 z-[70] w-[86%] max-w-sm xl:hidden liquid-glass-dark rounded-none"
          >
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between px-6 h-20 border-b border-white/10 shrink-0">
                <LanguageSwitch />
                <button
                  type="button"
                  aria-label={t("menu")}
                  onClick={onClose}
                  className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 px-6 py-8 space-y-1.5">
                {navLinks.map((link, index) => {
                  const isActive =
                    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: isRtl ? -16 : 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index + 0.1, duration: 0.35 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-base font-bold transition-colors",
                          isActive
                            ? "bg-white/10 text-brand-gold"
                            : "text-white hover:bg-white/5 hover:text-brand-goldLight"
                        )}
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180 opacity-60" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-6 border-t border-white/10 space-y-3 shrink-0">
                <a
                  href={phoneHref}
                  className="block text-center text-xs text-brand-100/70 font-medium"
                  dir="ltr"
                >
                  {phoneDisplay}
                </a>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-brand-gold text-brand-deep font-extrabold text-sm shadow-xl hover:bg-white transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{bookNowLabel}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

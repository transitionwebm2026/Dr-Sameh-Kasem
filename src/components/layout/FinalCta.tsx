import { getTranslations } from "next-intl/server";
import { Phone } from "lucide-react";
import { getSiteSettingsOrDefault } from "@/lib/controllers/siteSettings";
import { FadeIn } from "@/components/motion/FadeIn";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

export async function FinalCta({
  locale,
  title,
  titleHighlight,
  text,
}: {
  locale: string;
  /** Page-tailored plain headline. Falls back to the default titleLine1 + gold-highlighted name. */
  title?: string;
  /** Gold-highlighted portion that follows `title`. Only used together with a custom `title`. */
  titleHighlight?: string;
  /** Page-tailored supporting copy. Falls back to the default subtitle. */
  text?: string;
}) {
  const t = await getTranslations({ locale, namespace: "finalCta" });
  const common = await getTranslations({ locale, namespace: "common" });
  const hasCustomTitle = title !== undefined;

  const contact = await getSiteSettingsOrDefault();

  return (
    <section className="py-24 bg-brand-forest text-white relative overflow-hidden">
      <div
        className="absolute -bottom-24 -start-24 w-96 h-96 rounded-full bg-brand-700/30 blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 -end-24 w-96 h-96 rounded-full bg-brand-gold/15 blur-3xl animate-float"
        aria-hidden="true"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <FadeIn>
          <h2 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-black font-tajawal text-white leading-tight tracking-tight text-balance">
            {hasCustomTitle ? (
              <>
                {title}
                {titleHighlight ? (
                  <>
                    {" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-goldLight via-brand-gold to-white">
                      {titleHighlight}
                    </span>
                  </>
                ) : null}
              </>
            ) : (
              <>
                {t("titleLine1")}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-goldLight via-brand-gold to-white">
                  {t("titleHighlight")}
                </span>
              </>
            )}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-base sm:text-lg text-brand-100/90 leading-relaxed max-w-2xl mx-auto font-medium">
            {text ?? t("subtitle")}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <a
              href={contact.phone_href}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-brand-forest font-extrabold text-base hover:bg-brand-50 transition-all duration-300 shadow-2xl hover:scale-105 border border-white/80"
            >
              <Phone className="w-5 h-5 text-brand-forest" />
              <span>{common("contactUs")}</span>
            </a>
            <a
              href={`https://wa.me/${contact.whatsapp_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base transition-all duration-300 shadow-2xl hover:scale-105 border border-emerald-400/40"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>{common("whatsapp")}</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

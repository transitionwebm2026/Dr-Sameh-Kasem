import { getTranslations } from "next-intl/server";
import { Phone, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { getSiteSettingsOrDefault } from "@/lib/controllers/siteSettings";

export async function ClinicInfo({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations({ locale, namespace: "contact.info" });
  const common = await getTranslations({ locale, namespace: "common" });
  const contact = await getSiteSettingsOrDefault();

  const hasSocial = contact.facebook_url || contact.instagram_url || contact.tiktok_url;

  return (
    <GlassCard hover={false} className="p-6 sm:p-7 h-full flex flex-col gap-6">
      <div>
        <h2 className="font-tajawal text-xl sm:text-2xl font-black text-brand-forest text-balance">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm text-brand-800/80 leading-relaxed">{t("subtitle")}</p>
      </div>

      <div className="h-px bg-brand-900/10" />

      <div className="flex-1 space-y-4">
        <a href={contact.phone_href} className="group flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-colors duration-300 group-hover:bg-brand-forest group-hover:text-white">
            <Phone className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <div>
            <div className="text-xs font-semibold text-brand-700">{t("phoneLabel")}</div>
            <div dir="ltr" className="font-bold text-brand-forest">
              {contact.phone_display}
            </div>
          </div>
        </a>

        <a
          href={`https://wa.me/${contact.whatsapp_number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3.5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-colors duration-300 group-hover:bg-brand-forest group-hover:text-white">
            <WhatsAppIcon className="h-4 w-4" />
          </span>
          <div>
            <div className="text-xs font-semibold text-brand-700">{common("whatsapp")}</div>
            <div dir="ltr" className="font-bold text-brand-forest">
              {contact.phone_display}
            </div>
          </div>
        </a>

        <a href={`mailto:${contact.email}`} className="group flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-colors duration-300 group-hover:bg-brand-forest group-hover:text-white">
            <Mail className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-brand-700">{t("emailLabel")}</div>
            <div className="font-bold text-brand-forest break-all">{contact.email}</div>
          </div>
        </a>
      </div>

      {hasSocial ? (
        <>
          <div className="h-px bg-brand-900/10" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700/60">
              {common("followUs")}
            </span>
            <div className="flex items-center gap-2">
              {contact.facebook_url ? (
                <a
                  href={contact.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-white"
                >
                  <FacebookIcon className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {contact.instagram_url ? (
                <a
                  href={contact.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-white"
                >
                  <InstagramIcon className="h-3.5 w-3.5" />
                </a>
              ) : null}
              {contact.tiktok_url ? (
                <a
                  href={contact.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-forest/5 text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-white"
                >
                  <TikTokIcon className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </GlassCard>
  );
}

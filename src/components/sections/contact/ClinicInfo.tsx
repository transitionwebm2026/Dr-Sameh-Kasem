import { getTranslations } from "next-intl/server";
import { Phone, Mail } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig, buildMapEmbedUrl } from "@/lib/site-config";
import { getSiteSettingsOrDefault } from "@/lib/controllers/siteSettings";

export async function ClinicInfo({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations({ locale, namespace: "contact.info" });
  const contact = await getSiteSettingsOrDefault();
  const mainClinic = siteConfig.clinics[0];

  return (
    <GlassCard hover={false} className="p-6 sm:p-7 h-full flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <Phone className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
        <div>
          <div className="text-xs text-brand-700 font-semibold">{t("phoneLabel")}</div>
          <a href={contact.phone_href} dir="ltr" className="font-bold text-brand-forest">
            {contact.phone_display}
          </a>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Mail className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
        <div>
          <div className="text-xs text-brand-700 font-semibold">{t("emailLabel")}</div>
          <a href={`mailto:${contact.email}`} className="font-bold text-brand-forest break-all">
            {contact.email}
          </a>
        </div>
      </div>

      <div className="relative min-h-[220px] flex-1 overflow-hidden rounded-[1.5rem] border border-white/60">
        <iframe
          src={buildMapEmbedUrl(`${mainClinic.ar.name} ${mainClinic.address}`)}
          title={mainClinic[locale].name}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
          aria-label={t("mapLabel")}
        />
      </div>
    </GlassCard>
  );
}

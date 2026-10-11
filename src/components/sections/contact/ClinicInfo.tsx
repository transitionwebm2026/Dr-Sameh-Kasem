import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Navigation } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig } from "@/lib/site-config";
import { getSiteSettingsOrDefault } from "@/lib/controllers/siteSettings";

export async function ClinicInfo({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations({ locale, namespace: "contact.info" });
  const contact = await getSiteSettingsOrDefault();

  return (
    <GlassCard hover={false} className="p-6 sm:p-7 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {siteConfig.clinics.map((clinic) => (
          <div
            key={clinic.mapUrl}
            className="flex items-start gap-2.5 rounded-xl bg-brand-forest/[0.03] p-3"
          >
            <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-brand-forest truncate">
                {clinic[locale].name}
              </h3>
              <a
                href={clinic.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-brand-gold transition-colors hover:text-brand-forest"
              >
                <Navigation className="w-3 h-3" />
                <span>{t("directionsLabel")}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-brand-900/10" />

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
    </GlassCard>
  );
}

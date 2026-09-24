import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, Clock, Navigation, Siren } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig, buildDirectionsLink } from "@/lib/site-config";
import { getSiteSettingsOrDefault } from "@/lib/controllers/siteSettings";
import { pickLocale } from "@/lib/cms-render";

export async function ClinicInfo({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations({ locale, namespace: "contact.info" });
  const clinic = siteConfig.clinics[0][locale];

  const contact = await getSiteSettingsOrDefault();
  const hoursText = pickLocale(locale, contact.hours_text_en, contact.hours_text_ar);

  return (
    <GlassCard hover={false} className="p-6 sm:p-7 space-y-5">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-brand-forest">{clinic.name}</h3>
            <p className="text-sm text-brand-800/80">{clinic.address}</p>
            <a
              href={buildDirectionsLink(`${clinic.name} ${clinic.address}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:text-brand-gold transition-colors mt-2"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t("directionsLabel")}</span>
            </a>
          </div>
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
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-brand-700 font-semibold">{t("hoursLabel")}</div>
            <div className="font-bold text-brand-forest">{hoursText}</div>
          </div>
        </div>

        <div className="h-px bg-brand-900/10" />

        <a href={contact.phone_href} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
            <Siren className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <div className="font-bold text-brand-forest group-hover:text-brand-gold transition-colors">
              {t("emergencyLabel")}
            </div>
            <p className="text-xs text-brand-700">{t("emergencyNote")}</p>
          </div>
        </a>
    </GlassCard>
  );
}

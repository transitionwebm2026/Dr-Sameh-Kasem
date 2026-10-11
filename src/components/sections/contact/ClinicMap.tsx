"use client";

import { useLocale, useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function ClinicMap({ className }: { className?: string }) {
  const t = useTranslations("contact.info");
  const locale = useLocale() as "ar" | "en";
  const clinics: ReadonlyArray<(typeof siteConfig.clinics)[number] & { mapEmbed?: string }> =
    siteConfig.clinics;
  const clinic = clinics.find((c) => c.mapEmbed) ?? clinics[0];

  return (
    <GlassCard hover={false} className={cn("p-3 min-h-[260px]", className)}>
      <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
        <iframe
          src={clinic.mapEmbed}
          title={clinic[locale].name}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full border-0"
          aria-label={t("mapLabel")}
        />
      </div>
    </GlassCard>
  );
}

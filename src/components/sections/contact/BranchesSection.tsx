import { getTranslations } from "next-intl/server";
import { Navigation } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { siteConfig, buildMapEmbedUrl } from "@/lib/site-config";

const FEATURED_BRANCH_NAMES = ["المهندسين", "شبرا", "مصر الجديدة"];

export async function BranchesSection({ locale }: { locale: "ar" | "en" }) {
  const t = await getTranslations({ locale, namespace: "contact.branches" });
  const infoT = await getTranslations({ locale, namespace: "contact.info" });
  const branches = siteConfig.clinics.filter((c) => FEATURED_BRANCH_NAMES.includes(c.ar.name));

  return (
    <section className="py-24 bg-brand-ivory relative overflow-hidden">
      <AmbientGlow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} text={t("subtitle")} />
        <StaggerGroup className="flex flex-wrap justify-center gap-8">
          {branches.map((branch) => (
            <StaggerItem
              key={branch.mapUrl}
              className="w-full sm:w-[calc((100%_-_2rem)/2)] lg:w-[calc((100%_-_4rem)/3)]"
            >
              <GlassCard className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden">
                  <iframe
                    src={buildMapEmbedUrl(`${branch.ar.name} ${branch.address}`)}
                    title={branch[locale].name}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-bold text-brand-forest">{branch[locale].name}</h3>
                  <p className="text-sm text-brand-800/80 leading-relaxed flex-1">
                    {branch.address}
                  </p>
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-gold transition-colors hover:text-brand-forest"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{infoT("directionsLabel")}</span>
                  </a>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

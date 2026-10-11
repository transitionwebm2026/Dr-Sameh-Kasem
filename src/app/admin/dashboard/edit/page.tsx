"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getPageBySlug } from "@/lib/controllers/pages";
import { getHeroByPageId } from "@/lib/controllers/heroes";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { CMS_SECTION_REGISTRY } from "@/lib/cms-section-registry";
import { PageTabs, type SectionTab } from "@/components/admin/PageTabs";
import type { Page, PageHero } from "@/lib/cms-types";

type LoadedPage = { page: Page; hero: PageHero | null; sectionTabs: SectionTab[] };

// Keyed by `slug` from the parent so switching pages in the sidebar remounts
// this with fresh state, instead of needing an imperative reset inside the
// effect (not allowed to synchronously setState at the top of an effect).
function EditPageContent({ slug }: { slug: string }) {
  const [state, setState] = useState<LoadedPage | null | undefined>(undefined);

  useEffect(() => {
    let active = true;

    async function load() {
      const pageResult = await getPageBySlug(slug);
      if (!pageResult.ok || !pageResult.data) {
        if (active) setState(null);
        return;
      }
      const page = pageResult.data;

      const [heroResult, sectionsResult] = await Promise.all([
        getHeroByPageId(page.id),
        listSectionsByPageId(page.id),
      ]);
      const hero = heroResult.ok ? heroResult.data : null;
      const existingSections = sectionsResult.ok ? sectionsResult.data : [];

      const registryEntries = CMS_SECTION_REGISTRY[slug] ?? [];

      const sectionTabs: SectionTab[] = await Promise.all(
        registryEntries.map(async (entry) => {
          const section = existingSections.find((s) => s.section_key === entry.key) ?? null;
          const itemsResult = section
            ? await listContentItemsBySection(section.id)
            : { ok: true as const, data: [] };
          return {
            key: entry.key,
            label: entry.label,
            section,
            items: itemsResult.ok ? itemsResult.data : [],
          };
        })
      );

      if (active) setState({ page, hero, sectionTabs });
    }

    load();
    return () => {
      active = false;
    };
  }, [slug]);

  if (state === undefined) return null;
  if (state === null) return <p className="text-sm text-brand-800/70">Page not found.</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-forest">{state.page.name_en}</h1>
        <p className="mt-1 text-sm text-brand-800/70">{state.page.name_ar}</p>
      </div>

      <PageTabs page={state.page} hero={state.hero} sectionTabs={state.sectionTabs} />
    </div>
  );
}

function EditPageRouter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  useEffect(() => {
    if (!slug) router.replace("/admin/dashboard");
  }, [slug, router]);

  if (!slug) return null;
  return <EditPageContent key={slug} slug={slug} />;
}

export default function EditPage() {
  return (
    <Suspense fallback={null}>
      <EditPageRouter />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { HeroEditorForm } from "./HeroEditorForm";
import { SectionEditorForm } from "./SectionEditorForm";
import type { ContentItem, Page, PageHero, Section } from "@/lib/cms-types";

export type SectionTab = {
  key: string;
  label: string;
  section: Section | null;
  items: ContentItem[];
};

export function PageTabs({
  page,
  hero,
  sectionTabs,
}: {
  page: Page;
  hero: PageHero | null;
  sectionTabs: SectionTab[];
}) {
  const tabs = ["hero", ...sectionTabs.map((tab) => tab.key)];
  const [active, setActive] = useState(tabs[0]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-brand-900/10 pb-3">
        <TabButton active={active === "hero"} onClick={() => setActive("hero")}>
          Hero
        </TabButton>
        {sectionTabs.map((tab) => (
          <TabButton key={tab.key} active={active === tab.key} onClick={() => setActive(tab.key)}>
            {tab.label}
          </TabButton>
        ))}
      </div>

      {active === "hero" ? (
        <HeroEditorForm pageId={page.id} hero={hero} />
      ) : null}

      {sectionTabs.map((tab) =>
        active === tab.key ? (
          <SectionEditorForm
            key={tab.key}
            pageId={page.id}
            pageSlug={page.slug}
            sectionKey={tab.key}
            section={tab.section}
            items={tab.items}
          />
        ) : null
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-xs font-bold transition-colors",
        active ? "bg-brand-forest text-white" : "bg-white/60 text-brand-800 hover:bg-brand-100/60"
      )}
    >
      {children}
    </button>
  );
}

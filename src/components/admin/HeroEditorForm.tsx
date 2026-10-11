"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { upsertHero } from "@/lib/controllers/heroes";
import { MediaUploader } from "./MediaUploader";
import type { HeroInput, PageHero } from "@/lib/cms-types";

const emptyHero: HeroInput = {
  eyebrow_en: "",
  eyebrow_ar: "",
  title_en: "",
  title_ar: "",
  title_highlight_en: "",
  title_highlight_ar: "",
  subtitle_en: "",
  subtitle_ar: "",
  primary_cta_label_en: "",
  primary_cta_label_ar: "",
  primary_cta_href: "",
  secondary_cta_label_en: "",
  secondary_cta_label_ar: "",
  secondary_cta_href: "",
  image_url: "",
  bg_3d_element: "brain",
  show_doctor: true,
  show_stats_bar: false,
  follow_label_en: "",
  follow_label_ar: "",
  booking_card_title_en: "",
  booking_card_title_ar: "",
  booking_card_text_en: "",
  booking_card_text_ar: "",
  booking_card_cta_en: "",
  booking_card_cta_ar: "",
};

export function HeroEditorForm({ pageId, hero }: { pageId: string; hero: PageHero | null }) {
  const [draft, setDraft] = useState<HeroInput>(() =>
    hero
      ? {
          eyebrow_en: hero.eyebrow_en ?? "",
          eyebrow_ar: hero.eyebrow_ar ?? "",
          title_en: hero.title_en,
          title_ar: hero.title_ar,
          title_highlight_en: hero.title_highlight_en ?? "",
          title_highlight_ar: hero.title_highlight_ar ?? "",
          subtitle_en: hero.subtitle_en ?? "",
          subtitle_ar: hero.subtitle_ar ?? "",
          primary_cta_label_en: hero.primary_cta_label_en ?? "",
          primary_cta_label_ar: hero.primary_cta_label_ar ?? "",
          primary_cta_href: hero.primary_cta_href ?? "",
          secondary_cta_label_en: hero.secondary_cta_label_en ?? "",
          secondary_cta_label_ar: hero.secondary_cta_label_ar ?? "",
          secondary_cta_href: hero.secondary_cta_href ?? "",
          image_url: hero.image_url ?? "",
          bg_3d_element: hero.bg_3d_element ?? "brain",
          show_doctor: hero.show_doctor,
          show_stats_bar: hero.show_stats_bar,
          follow_label_en: hero.follow_label_en ?? "",
          follow_label_ar: hero.follow_label_ar ?? "",
          booking_card_title_en: hero.booking_card_title_en ?? "",
          booking_card_title_ar: hero.booking_card_title_ar ?? "",
          booking_card_text_en: hero.booking_card_text_en ?? "",
          booking_card_text_ar: hero.booking_card_text_ar ?? "",
          booking_card_cta_en: hero.booking_card_cta_en ?? "",
          booking_card_cta_ar: hero.booking_card_cta_ar ?? "",
        }
      : emptyHero
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function set<K extends keyof HeroInput>(key: K, value: HeroInput[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await upsertHero(pageId, draft);
    setSaving(false);
    if (result.ok) {
      setSavedAt(Date.now());
    } else if (result.error.includes("signed in") || result.error.includes("admin access")) {
      router.push("/admin/login?next=" + encodeURIComponent(window.location.pathname));
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="liquid-glass rounded-2xl p-5 space-y-5">
      <h3 className="text-sm font-bold text-brand-forest">Hero banner</h3>

      <Row>
        <Field label="Title (English)" value={draft.title_en} onChange={(v) => set("title_en", v)} />
        <Field label="Title (Arabic)" value={draft.title_ar} onChange={(v) => set("title_ar", v)} dir="rtl" />
      </Row>

      <Row>
        <Field
          label="Title highlight (English)"
          value={draft.title_highlight_en ?? ""}
          onChange={(v) => set("title_highlight_en", v)}
        />
        <Field
          label="Title highlight (Arabic)"
          value={draft.title_highlight_ar ?? ""}
          onChange={(v) => set("title_highlight_ar", v)}
          dir="rtl"
        />
      </Row>

      <Row>
        <TextArea label="Subtitle (English)" value={draft.subtitle_en ?? ""} onChange={(v) => set("subtitle_en", v)} />
        <TextArea label="Subtitle (Arabic)" value={draft.subtitle_ar ?? ""} onChange={(v) => set("subtitle_ar", v)} dir="rtl" />
      </Row>

      <Row>
        <Field label="Primary CTA label (English)" value={draft.primary_cta_label_en ?? ""} onChange={(v) => set("primary_cta_label_en", v)} />
        <Field label="Primary CTA label (Arabic)" value={draft.primary_cta_label_ar ?? ""} onChange={(v) => set("primary_cta_label_ar", v)} dir="rtl" />
      </Row>
      <Field label="Primary CTA link" value={draft.primary_cta_href ?? ""} onChange={(v) => set("primary_cta_href", v)} placeholder="/contact" />

      <Row>
        <Field label="Secondary CTA label (English)" value={draft.secondary_cta_label_en ?? ""} onChange={(v) => set("secondary_cta_label_en", v)} />
        <Field label="Secondary CTA label (Arabic)" value={draft.secondary_cta_label_ar ?? ""} onChange={(v) => set("secondary_cta_label_ar", v)} dir="rtl" />
      </Row>
      <Field label="Secondary CTA link" value={draft.secondary_cta_href ?? ""} onChange={(v) => set("secondary_cta_href", v)} placeholder="/services" />

      <MediaUploader label="Hero image" value={draft.image_url || null} onChange={(url) => set("image_url", url)} />

      <Row>
        <Field label="Background 3D element" value={draft.bg_3d_element ?? ""} onChange={(v) => set("bg_3d_element", v)} placeholder="brain, spine, skull…" />
        <div className="flex items-end gap-6 pb-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-brand-800">
            <input type="checkbox" checked={draft.show_doctor} onChange={(event) => set("show_doctor", event.target.checked)} />
            Show doctor photo
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-brand-800">
            <input type="checkbox" checked={draft.show_stats_bar} onChange={(event) => set("show_stats_bar", event.target.checked)} />
            Show stats bar
          </label>
        </div>
      </Row>

      <Row>
        <Field label="Follow label (English)" value={draft.follow_label_en ?? ""} onChange={(v) => set("follow_label_en", v)} placeholder="Follow us" />
        <Field label="Follow label (Arabic)" value={draft.follow_label_ar ?? ""} onChange={(v) => set("follow_label_ar", v)} dir="rtl" />
      </Row>

      <div className="space-y-3 rounded-xl border border-brand-900/10 bg-white/40 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-brand-forest">
          Booking card (the floating card on the hero)
        </h4>
        <Row>
          <Field
            label="Card title (English)"
            value={draft.booking_card_title_en ?? ""}
            onChange={(v) => set("booking_card_title_en", v)}
            placeholder="Book an Appointment"
          />
          <Field
            label="Card title (Arabic)"
            value={draft.booking_card_title_ar ?? ""}
            onChange={(v) => set("booking_card_title_ar", v)}
            dir="rtl"
          />
        </Row>
        <Row>
          <TextArea
            label="Card text (English)"
            value={draft.booking_card_text_en ?? ""}
            onChange={(v) => set("booking_card_text_en", v)}
          />
          <TextArea
            label="Card text (Arabic)"
            value={draft.booking_card_text_ar ?? ""}
            onChange={(v) => set("booking_card_text_ar", v)}
            dir="rtl"
          />
        </Row>
        <Row>
          <Field
            label="Button label (English)"
            value={draft.booking_card_cta_en ?? ""}
            onChange={(v) => set("booking_card_cta_en", v)}
            placeholder="Book Now"
          />
          <Field
            label="Button label (Arabic)"
            value={draft.booking_card_cta_ar ?? ""}
            onChange={(v) => set("booking_card_cta_ar", v)}
            dir="rtl"
          />
        </Row>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-900 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save hero
        </button>
        {savedAt ? <span className="text-xs text-brand-700/60">Saved.</span> : null}
        {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        dir={dir}
        className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
      />
    </label>
  );
}

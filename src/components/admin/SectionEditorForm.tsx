"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { upsertSection } from "@/lib/controllers/sections";
import { ContentItemsEditor } from "./ContentItemsEditor";
import { MediaUploader } from "./MediaUploader";
import { VideoUploader } from "./VideoUploader";
import { KeyValueEditor } from "./KeyValueEditor";
import type { ContentItem, Section } from "@/lib/cms-types";

export function SectionEditorForm({
  pageId,
  pageSlug,
  sectionKey,
  section,
  items,
}: {
  pageId: string;
  pageSlug: string;
  sectionKey: string;
  section: Section | null;
  items: ContentItem[];
}) {
  // The Home "About Preview" section renders its heading from `main_title`
  // in meta, not from the generic title/text columns — showing those inputs
  // here just displays unused leftover import data, so this section skips
  // them entirely (and always saves them as null).
  const hideTitleText = pageSlug === "home" && sectionKey === "about";

  // About's "Featured Video" section and the Home "About Preview" section
  // (the video card right under the hero) both get a dedicated cover-image +
  // video upload pair, same as video content items, instead of making the
  // admin type "video_url" into the generic Extra fields editor.
  const isFeaturedVideo =
    (pageSlug === "about" && sectionKey === "videoSection") ||
    (pageSlug === "home" && sectionKey === "about");

  // The shared FinalCta block at the bottom of every page is title + a
  // gold-highlighted portion + supporting text only — no image, no item
  // list. It's the one section that actually uses `title_highlight_*`
  // (every other section's public component ignores those columns).
  const isFinalCta = sectionKey === "finalCta";

  // These five Home sections mirror another page's content instead of
  // keeping their own copy (so there's one place to edit each), but the
  // heading/CTA above is still Home's own and stays editable here.
  const mirroredItemsSource: Record<string, string> =
    pageSlug === "home"
      ? {
          testimonialsSection: "Reviews → Reviews",
          videosSection: "Videos → Videos",
          articlesSection: "Articles → Articles",
          surgeriesSection: "Services → Specialties",
          faqSection: "Services → FAQ",
        }
      : {};
  const mirroredFrom = mirroredItemsSource[sectionKey];

  const [titleEn, setTitleEn] = useState(section?.title_en ?? "");
  const [titleAr, setTitleAr] = useState(section?.title_ar ?? "");
  const [titleHighlightEn, setTitleHighlightEn] = useState(section?.title_highlight_en ?? "");
  const [titleHighlightAr, setTitleHighlightAr] = useState(section?.title_highlight_ar ?? "");
  const [textEn, setTextEn] = useState(section?.text_en ?? "");
  const [textAr, setTextAr] = useState(section?.text_ar ?? "");
  const [imageUrl, setImageUrl] = useState(section?.image_url ?? "");
  const { video_url: initialVideoUrl, ...initialRestMeta } = (section?.meta ?? {}) as {
    video_url?: unknown;
  };
  const [videoUrl, setVideoUrl] = useState(typeof initialVideoUrl === "string" ? initialVideoUrl : "");
  const [meta, setMeta] = useState<Record<string, unknown>>(initialRestMeta);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await upsertSection(pageId, pageSlug, sectionKey, {
      eyebrow_en: null,
      eyebrow_ar: null,
      title_en: hideTitleText ? null : titleEn || null,
      title_ar: hideTitleText ? null : titleAr || null,
      title_highlight_en: isFinalCta ? titleHighlightEn || null : section?.title_highlight_en ?? null,
      title_highlight_ar: isFinalCta ? titleHighlightAr || null : section?.title_highlight_ar ?? null,
      text_en: hideTitleText ? null : textEn || null,
      text_ar: hideTitleText ? null : textAr || null,
      image_url: imageUrl || null,
      meta: isFeaturedVideo ? { ...meta, video_url: videoUrl.trim() } : meta,
    });
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
    <div className="space-y-6">
      <div className="liquid-glass rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-brand-forest">Section heading</h3>

        {!hideTitleText ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Title (English)
                </span>
                <input
                  value={titleEn}
                  onChange={(event) => setTitleEn(event.target.value)}
                  className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Title (Arabic)
                </span>
                <input
                  dir="rtl"
                  value={titleAr}
                  onChange={(event) => setTitleAr(event.target.value)}
                  className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Text (English)
                </span>
                <textarea
                  value={textEn}
                  onChange={(event) => setTextEn(event.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Text (Arabic)
                </span>
                <textarea
                  dir="rtl"
                  value={textAr}
                  onChange={(event) => setTextAr(event.target.value)}
                  rows={2}
                  className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
                />
              </label>
            </div>
          </>
        ) : null}

        {isFinalCta ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Title highlight (English) — shown in gold
              </span>
              <input
                value={titleHighlightEn}
                onChange={(event) => setTitleHighlightEn(event.target.value)}
                className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Title highlight (Arabic) — shown in gold
              </span>
              <input
                dir="rtl"
                value={titleHighlightAr}
                onChange={(event) => setTitleHighlightAr(event.target.value)}
                className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
              />
            </label>
          </div>
        ) : null}

        {!isFinalCta ? (
          <MediaUploader
            label={isFeaturedVideo ? "Cover image (optional — shown before the video plays)" : "Section image (optional)"}
            value={imageUrl || null}
            onChange={setImageUrl}
          />
        ) : null}

        {isFeaturedVideo ? (
          <>
            <VideoUploader
              label="Video file (upload from your device)"
              value={videoUrl || null}
              onChange={setVideoUrl}
            />
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                Or paste a Video URL instead (YouTube, Vimeo, or a direct link)
              </span>
              <input
                dir="ltr"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
              />
            </label>
          </>
        ) : null}

        {!isFinalCta ? (
          <KeyValueEditor
            label="Extra fields (e.g. a CTA label/href or a video URL)"
            meta={meta}
            onChange={setMeta}
          />
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-900 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save section
          </button>
          {savedAt ? <span className="text-xs text-brand-700/60">Saved.</span> : null}
          {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
        </div>
      </div>

      {!isFinalCta ? (
        mirroredFrom ? (
          <p className="rounded-2xl border border-brand-gold/30 bg-brand-gold/5 px-4 py-3 text-xs text-brand-700">
            These cards mirror <strong>{mirroredFrom}</strong> — edit the items there and they
            update here automatically. Only the heading above belongs to this Home section.
          </p>
        ) : section ? (
          <div>
            <h3 className="mb-3 text-sm font-bold text-brand-forest">Items in this section</h3>
            <ContentItemsEditor
              pageSlug={pageSlug}
              sectionKey={sectionKey}
              sectionId={section.id}
              initialItems={items}
            />
          </div>
        ) : (
          <p className="text-xs text-brand-700/60">
            Save the section heading first to start adding items to it.
          </p>
        )
      ) : null}
    </div>
  );
}

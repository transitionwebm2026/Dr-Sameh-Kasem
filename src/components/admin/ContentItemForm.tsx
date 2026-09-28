"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MediaUploader } from "./MediaUploader";
import { VideoUploader } from "./VideoUploader";
import { KeyValueEditor } from "./KeyValueEditor";
import { isIconImage } from "@/lib/icons";
import type { ContentItem, ContentItemInput } from "@/lib/cms-types";

type Draft = {
  item_type: string;
  image: string;
  originalIcon: string;
  videoUrl: string;
  title_en: string;
  title_ar: string;
  text_en: string;
  text_ar: string;
  href: string;
  order_index: number;
  restMeta: Record<string, unknown>;
};

function toDraft(item: ContentItem | null): Draft {
  const meta = item?.meta ?? {};
  const { video_url: videoUrlFromMeta, ...restMeta } = meta as { video_url?: unknown };
  // `icon` doubles as a legacy built-in icon key (e.g. "spine") for items
  // that predate image uploads — only treat it as an image if it actually
  // looks like one, otherwise the uploader would show a broken preview for
  // a value like "spine" instead of a clean empty slot. The raw key is kept
  // in `originalIcon` so saving without touching the image doesn't wipe it.
  const legacyIcon = item?.icon && isIconImage(item.icon) ? item.icon : "";
  return {
    item_type: item?.item_type ?? "card",
    image: item?.image_url || legacyIcon,
    originalIcon: item?.icon ?? "",
    videoUrl: typeof videoUrlFromMeta === "string" ? videoUrlFromMeta : "",
    title_en: item?.title_en ?? "",
    title_ar: item?.title_ar ?? "",
    text_en: item?.text_en ?? "",
    text_ar: item?.text_ar ?? "",
    href: item?.href ?? "",
    order_index: item?.order_index ?? 0,
    restMeta,
  };
}

export function ContentItemForm({
  pageSlug,
  sectionKey,
  item,
  onSubmit,
  onCancel,
}: {
  pageSlug: string;
  sectionKey: string;
  item: ContentItem | null;
  onSubmit: (input: ContentItemInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(item));
  const [saving, setSaving] = useState(false);
  const isVideo = draft.item_type === "video";
  // These specialty cards only ever show a title and an image — the generic
  // text/link/order/video/extra-fields controls don't apply and just made
  // the form confusing (and the image preview looked broken for the four
  // items still using a legacy built-in icon key instead of an upload).
  const isSimpleCard = pageSlug === "home" && sectionKey === "surgeriesSection";

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    let meta = draft.restMeta;
    if (draft.videoUrl.trim()) {
      meta = { ...meta, video_url: draft.videoUrl.trim() };
    }

    // Keep a legacy built-in icon key (e.g. "spine") intact when the admin
    // edits the title without touching the image — otherwise saving would
    // silently null it out and drop the card's illustration.
    const resolvedImage =
      draft.image || (draft.originalIcon && !isIconImage(draft.originalIcon) ? draft.originalIcon : null);

    setSaving(true);
    try {
      await onSubmit({
        parent_id: item?.parent_id ?? null,
        item_type: draft.item_type || "card",
        icon: resolvedImage,
        image_url: resolvedImage,
        title_en: draft.title_en || null,
        title_ar: draft.title_ar || null,
        subtitle_en: null,
        subtitle_ar: null,
        text_en: isVideo ? null : draft.text_en || null,
        text_ar: isVideo ? null : draft.text_ar || null,
        href: draft.href || null,
        order_index: draft.order_index,
        meta,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-brand-gold/30 bg-white/70 p-4">
      {!isSimpleCard ? (
        <Field label="Item type" value={draft.item_type} onChange={(v) => set("item_type", v)} placeholder="card, bullet, stat, faq…" />
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Title (English)" value={draft.title_en} onChange={(v) => set("title_en", v)} />
        <Field label="Title (Arabic)" value={draft.title_ar} onChange={(v) => set("title_ar", v)} dir="rtl" />
      </div>

      {!isVideo && !isSimpleCard ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextAreaField label="Text (English)" value={draft.text_en} onChange={(v) => set("text_en", v)} />
          <TextAreaField label="Text (Arabic)" value={draft.text_ar} onChange={(v) => set("text_ar", v)} dir="rtl" />
        </div>
      ) : null}

      <MediaUploader
        label={isVideo ? "Cover image (optional — shown before the video plays)" : "Image"}
        value={draft.image || null}
        onChange={(url) => set("image", url)}
      />

      {!isSimpleCard ? (
        <>
          {isVideo ? (
            <VideoUploader
              label="Video file (upload from your device)"
              value={draft.videoUrl || null}
              onChange={(url) => set("videoUrl", url)}
            />
          ) : null}

          <Field
            label={isVideo ? "Or paste a Video URL instead (YouTube, Vimeo, or a direct link)" : "Video URL (for video items — YouTube, Vimeo, or a direct .mp4 link)"}
            value={draft.videoUrl}
            onChange={(v) => set("videoUrl", v)}
            placeholder="https://youtube.com/watch?v=..."
            dir="ltr"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Link (href)" value={draft.href} onChange={(v) => set("href", v)} placeholder="/contact" />
            <Field
              label="Order"
              type="number"
              value={String(draft.order_index)}
              onChange={(v) => set("order_index", Number(v) || 0)}
            />
          </div>

          <KeyValueEditor
            label="Extra fields (e.g. value/suffix for a stat, slug for an article)"
            meta={draft.restMeta}
            onChange={(meta) => set("restMeta", meta)}
          />
        </>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-900 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Save item
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-brand-900/15 px-5 py-2.5 text-xs font-bold text-brand-800 transition-colors hover:bg-brand-100/60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  dir,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "rtl" | "ltr";
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        dir={dir}
        className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
      />
    </label>
  );
}

function TextAreaField({
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

"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { ImageUp, Loader2, X } from "lucide-react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/browser";
import { registerMedia } from "@/lib/controllers/media";
import { compressImage } from "@/lib/image-compress";
import { cn } from "@/lib/utils";

const BUCKET = "cms-media";
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
const MAX_SIZE_MB = 8;

/** Guards against passing a legacy non-URL value (e.g. an old Lucide icon
 * key like "brain") into next/image, which throws on anything that isn't a
 * real URL or a root-relative path. */
function isDisplayableImage(value: string): boolean {
  if (value.startsWith("/")) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function MediaUploader({
  value,
  onChange,
  label = "Image",
}: {
  value: string | null;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please upload a PNG, JPEG, WEBP, GIF, or SVG image.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File is too large — max ${MAX_SIZE_MB}MB.`);
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured on this deployment.");
      return;
    }

    setIsUploading(true);
    try {
      const optimized = await compressImage(file);
      const supabase = createSupabaseBrowserClient();
      const extension = optimized.name.split(".").pop() || "bin";
      const path = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, optimized, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const url = publicUrlData.publicUrl;

      const result = await registerMedia({ bucketPath: path, url });
      if (!result.ok) throw new Error(result.error);

      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
        {label}
      </span>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={cn(
          "relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-center transition-colors",
          isDragging ? "border-brand-gold bg-brand-gold/10" : "border-brand-900/20 bg-white/50 hover:bg-white/70"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadFile(file);
            event.target.value = "";
          }}
        />

        {value && isDisplayableImage(value) ? (
          <div className="relative h-24 w-full max-w-[200px] overflow-hidden rounded-xl bg-brand-forest/5">
            <Image src={value} alt="" fill sizes="200px" className="object-contain" />
          </div>
        ) : (
          <>
            <ImageUp className="h-7 w-7 text-brand-gold" />
            <p className="text-xs text-brand-800/70">
              Drag &amp; drop an image, or click to browse
            </p>
          </>
        )}

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
            <Loader2 className="h-5 w-5 animate-spin text-brand-forest" />
          </div>
        ) : null}
      </div>

      {value ? (
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] text-brand-700/60">{value}</span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onChange("");
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:underline"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        </div>
      ) : null}

      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

import { requireAdminClient } from "@/lib/supabase/admin-client";
import type { MediaAsset } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

/**
 * Registers a file the browser has already uploaded straight to the
 * `cms-media` Storage bucket (see MediaUploader.tsx). The upload itself
 * happens client-side against Supabase Storage so large files never pass
 * through a Server Action payload; this just records it in `media` for the
 * asset library.
 */
export async function registerMedia(input: {
  bucketPath: string;
  url: string;
  altTextEn?: string;
  altTextAr?: string;
}): Promise<ActionResult<MediaAsset>> {
  return runAction(async () => {
    const { supabase, user } = await requireAdminClient();

    const { data, error } = await supabase
      .from("media")
      .insert({
        bucket_path: input.bucketPath,
        url: input.url,
        alt_text_en: input.altTextEn ?? null,
        alt_text_ar: input.altTextAr ?? null,
        uploaded_by: user.id,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data as MediaAsset;
  });
}

export async function listMedia(): Promise<ActionResult<MediaAsset[]>> {
  return runAction(async () => {
    const { supabase } = await requireAdminClient();
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as MediaAsset[];
  });
}

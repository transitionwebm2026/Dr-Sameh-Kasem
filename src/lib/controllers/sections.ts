"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabase as publicSupabase } from "@/lib/supabase/client";
import { cachedCmsRead, CMS_CACHE_TAG } from "@/lib/cms-cache";
import type { Section, SectionInput } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

export async function listSectionsByPageId(pageId: string): Promise<ActionResult<Section[]>> {
  return runAction(() =>
    cachedCmsRead(["sections-by-page-id", pageId], async () => {
      if (!publicSupabase) throw new Error("Supabase is not configured.");
      const { data, error } = await publicSupabase
        .from("sections")
        .select("*")
        .eq("page_id", pageId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as Section[];
    })
  );
}

/**
 * Sections are keyed by (page_id, section_key) rather than a free-form id,
 * so the admin dashboard can always target "the surgeriesSection of home"
 * without first knowing whether a row already exists for it.
 */
export async function upsertSection(
  pageId: string,
  pageSlug: string,
  sectionKey: string,
  input: SectionInput
): Promise<ActionResult<Section>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("sections")
      .upsert(
        { page_id: pageId, section_key: sectionKey, ...input },
        { onConflict: "page_id,section_key" }
      )
      .select("*")
      .single();

    if (error) throw error;

    updateTag(CMS_CACHE_TAG);
    revalidatePath(`/admin/dashboard/${pageSlug}`);
    revalidatePath(`/ar/${pageSlug === "home" ? "" : pageSlug}`);
    revalidatePath(`/en/${pageSlug === "home" ? "" : pageSlug}`);

    return data as Section;
  });
}

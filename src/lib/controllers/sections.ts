import { requireAdminClient } from "@/lib/supabase/admin-client";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { supabase as publicSupabase } from "@/lib/supabase/client";
import type { Section, SectionInput } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

export async function listSectionsByPageId(pageId: string): Promise<ActionResult<Section[]>> {
  return runAction(async () => {
    if (!publicSupabase) throw new Error("Supabase is not configured.");
    const { data, error } = await publicSupabase
      .from("sections")
      .select("*")
      .eq("page_id", pageId)
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as Section[];
  });
}

/**
 * Sections are keyed by (page_id, section_key) rather than a free-form id,
 * so the admin dashboard can always target "the surgeriesSection of home"
 * without first knowing whether a row already exists for it.
 */
export async function upsertSection(
  pageId: string,
  sectionKey: string,
  input: SectionInput
): Promise<ActionResult<Section>> {
  return runAction(async () => {
    await requireAdminClient();
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("sections")
      .upsert(
        { page_id: pageId, section_key: sectionKey, ...input },
        { onConflict: "page_id,section_key" }
      )
      .select("*")
      .single();

    if (error) throw error;

    return data as Section;
  });
}

import { requireAdminClient } from "@/lib/supabase/admin-client";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { supabase as publicSupabase } from "@/lib/supabase/client";
import type { HeroInput, PageHero } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

export async function getHeroByPageId(pageId: string): Promise<ActionResult<PageHero | null>> {
  return runAction(async () => {
    if (!publicSupabase) throw new Error("Supabase is not configured.");
    const { data, error } = await publicSupabase
      .from("page_heroes")
      .select("*")
      .eq("page_id", pageId)
      .maybeSingle();

    if (error) throw error;
    return data as PageHero | null;
  });
}

export async function upsertHero(pageId: string, input: HeroInput): Promise<ActionResult<PageHero>> {
  return runAction(async () => {
    await requireAdminClient();
    const supabase = createSupabaseBrowserClient();

    const { data, error } = await supabase
      .from("page_heroes")
      .upsert({ page_id: pageId, ...input }, { onConflict: "page_id" })
      .select("*")
      .single();

    if (error) throw error;

    return data as PageHero;
  });
}

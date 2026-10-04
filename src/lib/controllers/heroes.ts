"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabase as publicSupabase } from "@/lib/supabase/client";
import { cachedCmsRead, CMS_CACHE_TAG } from "@/lib/cms-cache";
import type { HeroInput, PageHero } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

export async function getHeroByPageId(pageId: string): Promise<ActionResult<PageHero | null>> {
  return runAction(() =>
    cachedCmsRead(["hero-by-page-id", pageId], async () => {
      if (!publicSupabase) throw new Error("Supabase is not configured.");
      const { data, error } = await publicSupabase
        .from("page_heroes")
        .select("*")
        .eq("page_id", pageId)
        .maybeSingle();

      if (error) throw error;
      return data as PageHero | null;
    })
  );
}

export async function upsertHero(
  pageId: string,
  pageSlug: string,
  input: HeroInput
): Promise<ActionResult<PageHero>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("page_heroes")
      .upsert({ page_id: pageId, ...input }, { onConflict: "page_id" })
      .select("*")
      .single();

    if (error) throw error;

    updateTag(CMS_CACHE_TAG);
    revalidatePath(`/admin/dashboard/${pageSlug}`);
    revalidatePath(`/ar/${pageSlug === "home" ? "" : pageSlug}`);
    revalidatePath(`/en/${pageSlug === "home" ? "" : pageSlug}`);

    return data as PageHero;
  });
}

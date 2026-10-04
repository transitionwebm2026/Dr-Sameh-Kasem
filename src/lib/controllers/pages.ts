import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabase as publicSupabase } from "@/lib/supabase/client";
import { cachedCmsRead } from "@/lib/cms-cache";
import type { Page } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

export async function listPages(): Promise<ActionResult<Page[]>> {
  return runAction(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as Page[];
  });
}

// Public-readable, so the plain anon-key client (not the cookie-bound one)
// keeps this cacheable — called on every single public page, so caching it
// is what keeps page-to-page navigation fast.
export async function getPageBySlug(slug: string): Promise<ActionResult<Page | null>> {
  return runAction(() =>
    cachedCmsRead(["page-by-slug", slug], async () => {
      if (!publicSupabase) throw new Error("Supabase is not configured.");
      const { data, error } = await publicSupabase
        .from("pages")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as Page | null;
    })
  );
}

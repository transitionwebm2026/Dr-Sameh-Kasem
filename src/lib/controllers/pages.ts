import { supabase as publicSupabase } from "@/lib/supabase/client";
import type { Page } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

// `pages` is public-readable by RLS, so the plain anon-key client works for
// both the admin dashboard (browser) and the public site (build-time read).
export async function listPages(): Promise<ActionResult<Page[]>> {
  return runAction(async () => {
    if (!publicSupabase) throw new Error("Supabase is not configured.");
    const { data, error } = await publicSupabase
      .from("pages")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;
    return data as Page[];
  });
}

export async function getPageBySlug(slug: string): Promise<ActionResult<Page | null>> {
  return runAction(async () => {
    if (!publicSupabase) throw new Error("Supabase is not configured.");
    const { data, error } = await publicSupabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    return data as Page | null;
  });
}

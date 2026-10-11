import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { requireAdminClient } from "@/lib/supabase/admin-client";
import type { ConsultationRequest } from "@/lib/cms-types";
import { runAction, type ActionResult } from "./result";

// SELECT on consultation_requests is admin-only by RLS, so this needs the
// signed-in browser session (not the plain anon client).
export async function listRecentConsultationRequests(
  limit = 10
): Promise<ActionResult<ConsultationRequest[]>> {
  return runAction(async () => {
    await requireAdminClient();
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("consultation_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as ConsultationRequest[];
  });
}

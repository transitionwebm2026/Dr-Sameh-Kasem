import { createSupabaseBrowserClient } from "./browser";
import { NotAdminError } from "@/lib/errors";

/**
 * Browser-side equivalent of the old `requireAdmin()` (server.ts/admin.ts).
 * Confirms the current browser session belongs to a signed-in user AND that
 * user has an `admin_profiles` row, then returns both the client and the
 * user. Called at the top of every admin page/mutation — RLS is the real
 * authorization boundary (every write policy already gates on
 * `auth.uid()` -> `admin_profiles`), this is just a fast, clear-error UX
 * check before bothering to hit the database.
 */
export async function requireAdminClient() {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new NotAdminError("You must be signed in.");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    throw new NotAdminError("This account does not have admin access.");
  }

  return { supabase, user, profile };
}

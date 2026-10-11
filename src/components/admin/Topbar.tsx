"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function Topbar({ email }: { email: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await createSupabaseBrowserClient().auth.signOut();
    router.push("/admin/login");
  }

  return (
    <header className="liquid-glass flex items-center justify-between gap-4 px-4 py-3 lg:px-6">
      <div className="text-sm font-semibold text-brand-forest lg:hidden">Admin</div>
      <div className="hidden text-sm text-brand-800/70 lg:block">Signed in as {email}</div>
      <button
        type="button"
        onClick={handleSignOut}
        className="flex items-center gap-2 rounded-full border border-brand-900/15 px-4 py-2 text-xs font-bold text-brand-forest transition-colors hover:bg-brand-100/60"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </header>
  );
}

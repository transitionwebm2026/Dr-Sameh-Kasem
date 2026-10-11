"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NotAdminError } from "@/lib/errors";
import { requireAdminClient } from "@/lib/supabase/admin-client";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { listPages } from "@/lib/controllers/pages";
import type { Page } from "@/lib/cms-types";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<{ email: string; pages: Page[] } | null>(null);

  useEffect(() => {
    let active = true;

    requireAdminClient()
      .then(async ({ user }) => {
        const pagesResult = await listPages();
        if (!active) return;
        setState({ email: user.email ?? "", pages: pagesResult.ok ? pagesResult.data : [] });
      })
      .catch((error) => {
        if (!active) return;
        if (error instanceof NotAdminError) {
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
          return;
        }
        throw error;
      });

    const supabase = createSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (!state) return null;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-brand-ivory">
      <div
        className="pointer-events-none absolute -top-24 -start-24 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -end-24 h-96 w-96 rounded-full bg-brand-700/10 blur-3xl"
        aria-hidden="true"
      />

      <Suspense fallback={null}>
        <Sidebar pages={state.pages} />
      </Suspense>
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar email={state.email} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

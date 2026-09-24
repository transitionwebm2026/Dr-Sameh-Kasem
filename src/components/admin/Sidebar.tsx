"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, Settings, PanelsTopLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Page } from "@/lib/cms-types";

export function Sidebar({ pages }: { pages: Page[] }) {
  const pathname = usePathname();

  return (
    <aside className="liquid-glass hidden lg:flex w-64 shrink-0 flex-col gap-1 p-4">
      <div className="mb-4 px-2">
        <div className="text-sm font-black text-brand-forest">Dr. Sameh Qassem</div>
        <div className="text-xs text-brand-700/70">Content Dashboard</div>
      </div>

      <Link
        href="/admin/dashboard"
        prefetch={false}
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
          pathname === "/admin/dashboard"
            ? "bg-brand-forest text-white"
            : "text-brand-800 hover:bg-brand-100/60"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        Overview
      </Link>

      <div className="mt-4 mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-brand-700/60">
        Pages
      </div>

      <nav className="flex flex-col gap-1">
        {pages.map((page) => {
          const href = `/admin/dashboard/${page.slug}`;
          const active = pathname === href;
          return (
            <Link
              key={page.id}
              href={href}
              prefetch={false}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active ? "bg-brand-forest text-white" : "text-brand-800 hover:bg-brand-100/60"
              )}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="truncate">{page.name_en}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 mb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-brand-700/60">
        Site-wide
      </div>
      <Link
        href="/admin/dashboard/settings"
        prefetch={false}
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
          pathname === "/admin/dashboard/settings"
            ? "bg-brand-forest text-white"
            : "text-brand-800 hover:bg-brand-100/60"
        )}
      >
        <Settings className="h-4 w-4 shrink-0" />
        Contact & Social
      </Link>
      <Link
        href="/admin/dashboard/settings/navbar-footer"
        prefetch={false}
        className={cn(
          "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
          pathname === "/admin/dashboard/settings/navbar-footer"
            ? "bg-brand-forest text-white"
            : "text-brand-800 hover:bg-brand-100/60"
        )}
      >
        <PanelsTopLeft className="h-4 w-4 shrink-0" />
        Navbar & Footer
      </Link>
    </aside>
  );
}

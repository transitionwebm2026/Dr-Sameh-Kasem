"use client";

import { useEffect, useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { listPages } from "@/lib/controllers/pages";
import { listRecentConsultationRequests } from "@/lib/controllers/consultations";
import type { Page, ConsultationRequest } from "@/lib/cms-types";

export default function DashboardOverviewPage() {
  const [data, setData] = useState<{ pages: Page[]; requests: ConsultationRequest[] } | null>(
    null
  );

  useEffect(() => {
    let active = true;
    Promise.all([listPages(), listRecentConsultationRequests(8)]).then(
      ([pagesResult, requestsResult]) => {
        if (!active) return;
        setData({
          pages: pagesResult.ok ? pagesResult.data : [],
          requests: requestsResult.ok ? requestsResult.data : [],
        });
      }
    );
    return () => {
      active = false;
    };
  }, []);

  const pages = data?.pages ?? [];
  const requests = data?.requests ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-brand-forest">Overview</h1>
        <p className="mt-1 text-sm text-brand-800/70">
          Manage every page&apos;s content from the sidebar. Changes go live after the next
          site rebuild.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="liquid-glass glass-interactive rounded-2xl p-5 flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-forest text-brand-gold">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <div className="text-2xl font-black text-brand-forest">{pages.length}</div>
            <div className="text-xs text-brand-800/70">Managed pages</div>
          </div>
        </div>
        <div className="liquid-glass glass-interactive rounded-2xl p-5 flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-forest text-brand-gold">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div>
            <div className="text-2xl font-black text-brand-forest">{requests.length}</div>
            <div className="text-xs text-brand-800/70">Recent consultation requests</div>
          </div>
        </div>
      </div>

      <div className="liquid-glass rounded-2xl overflow-hidden">
        <div className="border-b border-brand-900/10 px-5 py-4">
          <h2 className="text-sm font-bold text-brand-forest">Recent consultation requests</h2>
        </div>
        {requests.length === 0 ? (
          <p className="p-5 text-sm text-brand-800/70">No submissions yet.</p>
        ) : (
          <ul className="divide-y divide-brand-900/10">
            {requests.map((request) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
                <div>
                  <div className="text-sm font-semibold text-brand-forest">{request.name}</div>
                  <div className="text-xs text-brand-800/70" dir="ltr">
                    {request.phone}
                  </div>
                </div>
                <span className="text-xs text-brand-700/60">
                  {new Date(request.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

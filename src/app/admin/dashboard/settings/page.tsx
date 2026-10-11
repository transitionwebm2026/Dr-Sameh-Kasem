"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, type SiteSettings } from "@/lib/controllers/siteSettings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null | undefined>(undefined);

  useEffect(() => {
    let active = true;
    getSiteSettings().then((result) => {
      if (active) setSettings(result.ok ? result.data : null);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-forest">Contact & Social</h1>
        <p className="mt-1 text-sm text-brand-800/70">
          Shared across every page — the phone, email, and social links here update the hero
          booking card, footer, floating call/WhatsApp buttons, and the contact page all at once.
        </p>
      </div>

      {settings === undefined ? null : <SiteSettingsForm settings={settings} />}
    </div>
  );
}

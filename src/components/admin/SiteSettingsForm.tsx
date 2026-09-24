"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { updateSiteSettings, type SiteSettings } from "@/lib/controllers/siteSettings";

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [phoneDisplay, setPhoneDisplay] = useState(settings?.phone_display ?? "");
  const [email, setEmail] = useState(settings?.email ?? "");
  const [facebookUrl, setFacebookUrl] = useState(settings?.facebook_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(settings?.instagram_url ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(settings?.tiktok_url ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateSiteSettings({
      phone_display: phoneDisplay,
      email,
      facebook_url: facebookUrl || null,
      instagram_url: instagramUrl || null,
      tiktok_url: tiktokUrl || null,
    });
    setSaving(false);
    if (result.ok) {
      setSavedAt(Date.now());
    } else if (result.error.includes("signed in") || result.error.includes("admin access")) {
      router.push("/admin/login?next=" + encodeURIComponent(window.location.pathname));
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="liquid-glass rounded-2xl p-5 space-y-5 max-w-2xl">
      <div>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Phone / WhatsApp number
          </span>
          <input
            dir="ltr"
            value={phoneDisplay}
            onChange={(event) => setPhoneDisplay(event.target.value)}
            placeholder="+20 100 123 4567"
            className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
          />
        </label>
        <p className="mt-1.5 text-[11px] text-brand-700/60">
          Used for the call button, the WhatsApp button, and everywhere the number is shown. You
          can type it as a local Egyptian number (e.g. 01147886551) or with a country code — the
          country code is added automatically for the call/WhatsApp links.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">Email</span>
        <input
          dir="ltr"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="contact@drsamehqassem.com"
          className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Facebook link
          </span>
          <input
            dir="ltr"
            value={facebookUrl}
            onChange={(event) => setFacebookUrl(event.target.value)}
            placeholder="https://facebook.com/..."
            className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            Instagram link
          </span>
          <input
            dir="ltr"
            value={instagramUrl}
            onChange={(event) => setInstagramUrl(event.target.value)}
            placeholder="https://instagram.com/..."
            className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
            TikTok link
          </span>
          <input
            dir="ltr"
            value={tiktokUrl}
            onChange={(event) => setTiktokUrl(event.target.value)}
            placeholder="https://tiktok.com/@..."
            className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-brand-900 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save
        </button>
        {savedAt ? <span className="text-xs text-brand-700/60">Saved.</span> : null}
        {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
      </div>
    </div>
  );
}

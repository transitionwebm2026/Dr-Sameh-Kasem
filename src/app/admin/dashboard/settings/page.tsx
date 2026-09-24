import { getSiteSettings } from "@/lib/controllers/siteSettings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function SiteSettingsPage() {
  const result = await getSiteSettings();
  const settings = result.ok ? result.data : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-forest">Contact & Social</h1>
        <p className="mt-1 text-sm text-brand-800/70">
          Shared across every page — the phone, email, and social links here update the hero
          booking card, footer, floating call/WhatsApp buttons, and the contact page all at once.
        </p>
      </div>

      <SiteSettingsForm settings={settings} />
    </div>
  );
}

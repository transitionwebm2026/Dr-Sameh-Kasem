import { getSiteSettings } from "@/lib/controllers/siteSettings";
import { NavbarFooterForm } from "@/components/admin/NavbarFooterForm";

export default async function NavbarFooterSettingsPage() {
  const result = await getSiteSettings();
  const settings = result.ok ? result.data : null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-brand-forest">Navbar & Footer</h1>
        <p className="mt-1 text-sm text-brand-800/70">
          Shared across every page — the header menu, the &quot;Book Now&quot; button, and every
          part of the footer (bio, links, branches, hours, copyright, disclaimer).
        </p>
      </div>

      <NavbarFooterForm settings={settings} />
    </div>
  );
}

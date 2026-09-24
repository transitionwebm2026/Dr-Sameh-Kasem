"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import {
  updateNavbarFooterContent,
  type SiteSettings,
  type NavLink,
  type Branch,
} from "@/lib/controllers/siteSettings";
import { RepeatingListEditor } from "@/components/admin/RepeatingListEditor";

const EMPTY_LINK: NavLink = { href: "", label_en: "", label_ar: "" };
const EMPTY_BRANCH: Branch = { label_en: "", label_ar: "", text_en: "", text_ar: "" };

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="liquid-glass rounded-2xl p-5 space-y-4">
      <div>
        <h2 className="text-sm font-black text-brand-forest">{title}</h2>
        {description ? <p className="mt-0.5 text-xs text-brand-700/60">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}

function BilingualField({
  label,
  valueEn,
  valueAr,
  onChangeEn,
  onChangeAr,
  multiline = false,
}: {
  label: string;
  valueEn: string;
  valueAr: string;
  onChangeEn: (value: string) => void;
  onChangeAr: (value: string) => void;
  multiline?: boolean;
}) {
  const Field = multiline ? "textarea" : "input";
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">{label}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Field
          dir="ltr"
          value={valueEn}
          onChange={(event) => onChangeEn(event.target.value)}
          placeholder="English"
          rows={multiline ? 3 : undefined}
          className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
        />
        <Field
          dir="rtl"
          value={valueAr}
          onChange={(event) => onChangeAr(event.target.value)}
          placeholder="عربي"
          rows={multiline ? 3 : undefined}
          className="w-full rounded-xl border border-brand-900/15 bg-white/70 px-3.5 py-2.5 text-sm text-brand-forest outline-none focus:border-brand-gold"
        />
      </div>
    </div>
  );
}

export function NavbarFooterForm({ settings }: { settings: SiteSettings | null }) {
  const [navLinks, setNavLinks] = useState<NavLink[]>(settings?.nav_links ?? []);
  const [bookNowLabelEn, setBookNowLabelEn] = useState(settings?.book_now_label_en ?? "");
  const [bookNowLabelAr, setBookNowLabelAr] = useState(settings?.book_now_label_ar ?? "");
  const [footerBioEn, setFooterBioEn] = useState(settings?.footer_bio_en ?? "");
  const [footerBioAr, setFooterBioAr] = useState(settings?.footer_bio_ar ?? "");
  const [footerMembershipEn, setFooterMembershipEn] = useState(settings?.footer_membership_en ?? "");
  const [footerMembershipAr, setFooterMembershipAr] = useState(settings?.footer_membership_ar ?? "");
  const [guideLinks, setGuideLinks] = useState<NavLink[]>(settings?.guide_links ?? []);
  const [branches, setBranches] = useState<Branch[]>(settings?.branches ?? []);
  const [hoursLabelEn, setHoursLabelEn] = useState(settings?.hours_label_en ?? "");
  const [hoursLabelAr, setHoursLabelAr] = useState(settings?.hours_label_ar ?? "");
  const [hoursTextEn, setHoursTextEn] = useState(settings?.hours_text_en ?? "");
  const [hoursTextAr, setHoursTextAr] = useState(settings?.hours_text_ar ?? "");
  const [copyrightEn, setCopyrightEn] = useState(settings?.copyright_en ?? "");
  const [copyrightAr, setCopyrightAr] = useState(settings?.copyright_ar ?? "");
  const [disclaimerEn, setDisclaimerEn] = useState(settings?.disclaimer_en ?? "");
  const [disclaimerAr, setDisclaimerAr] = useState(settings?.disclaimer_ar ?? "");

  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    setError(null);
    const result = await updateNavbarFooterContent({
      nav_links: navLinks,
      book_now_label_en: bookNowLabelEn,
      book_now_label_ar: bookNowLabelAr,
      footer_bio_en: footerBioEn,
      footer_bio_ar: footerBioAr,
      footer_membership_en: footerMembershipEn,
      footer_membership_ar: footerMembershipAr,
      guide_links: guideLinks,
      branches,
      hours_label_en: hoursLabelEn,
      hours_label_ar: hoursLabelAr,
      hours_text_en: hoursTextEn,
      hours_text_ar: hoursTextAr,
      copyright_en: copyrightEn,
      copyright_ar: copyrightAr,
      disclaimer_en: disclaimerEn,
      disclaimer_ar: disclaimerAr,
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
    <div className="space-y-5 max-w-3xl">
      <Section title="Navbar links" description="Shown in the header menu and the mobile drawer, in this order.">
        <RepeatingListEditor
          items={navLinks}
          onChange={setNavLinks}
          emptyItem={EMPTY_LINK}
          addLabel="Add link"
          fields={[
            { key: "href", label: "/path", dir: "ltr" },
            { key: "label_en", label: "Label (English)", dir: "ltr" },
            { key: "label_ar", label: "Label (Arabic)", dir: "rtl" },
          ]}
        />
      </Section>

      <Section title="Book Now button" description="The header's CTA button and the mobile drawer's booking button.">
        <BilingualField
          label="Button text"
          valueEn={bookNowLabelEn}
          valueAr={bookNowLabelAr}
          onChangeEn={setBookNowLabelEn}
          onChangeAr={setBookNowLabelAr}
        />
      </Section>

      <Section title="Footer bio">
        <BilingualField
          label="Short bio"
          valueEn={footerBioEn}
          valueAr={footerBioAr}
          onChangeEn={setFooterBioEn}
          onChangeAr={setFooterBioAr}
          multiline
        />
        <BilingualField
          label="Membership line"
          valueEn={footerMembershipEn}
          valueAr={footerMembershipAr}
          onChangeEn={setFooterMembershipEn}
          onChangeAr={setFooterMembershipAr}
        />
      </Section>

      <Section title="Patient guides" description="The footer's second link column.">
        <RepeatingListEditor
          items={guideLinks}
          onChange={setGuideLinks}
          emptyItem={EMPTY_LINK}
          addLabel="Add link"
          fields={[
            { key: "href", label: "/path", dir: "ltr" },
            { key: "label_en", label: "Label (English)", dir: "ltr" },
            { key: "label_ar", label: "Label (Arabic)", dir: "rtl" },
          ]}
        />
      </Section>

      <Section title="Branches" description="Each branch's address line in the footer.">
        <RepeatingListEditor
          items={branches}
          onChange={setBranches}
          emptyItem={EMPTY_BRANCH}
          addLabel="Add branch"
          itemLabel={(index) => `Branch ${index + 1}`}
          fields={[
            { key: "label_en", label: "Label (English) — e.g. Branch One:", dir: "ltr" },
            { key: "label_ar", label: "Label (Arabic)", dir: "rtl" },
            { key: "text_en", label: "Address (English)", dir: "ltr" },
            { key: "text_ar", label: "Address (Arabic)", dir: "rtl" },
          ]}
        />
      </Section>

      <Section title="Clinic hours" description="Shown in the footer and on the Contact page.">
        <BilingualField
          label="Label"
          valueEn={hoursLabelEn}
          valueAr={hoursLabelAr}
          onChangeEn={setHoursLabelEn}
          onChangeAr={setHoursLabelAr}
        />
        <BilingualField
          label="Hours"
          valueEn={hoursTextEn}
          valueAr={hoursTextAr}
          onChangeEn={setHoursTextEn}
          onChangeAr={setHoursTextAr}
        />
      </Section>

      <Section title="Copyright & disclaimer">
        <BilingualField
          label="Copyright line — use {year} where the current year should appear"
          valueEn={copyrightEn}
          valueAr={copyrightAr}
          onChangeEn={setCopyrightEn}
          onChangeAr={setCopyrightAr}
        />
        <BilingualField
          label="Medical disclaimer"
          valueEn={disclaimerEn}
          valueAr={disclaimerAr}
          onChangeEn={setDisclaimerEn}
          onChangeAr={setDisclaimerAr}
          multiline
        />
      </Section>

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

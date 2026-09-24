"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { runAction, type ActionResult } from "./result";

export type NavLink = { href: string; label_en: string; label_ar: string };
export type Branch = { label_en: string; label_ar: string; text_en: string; text_ar: string };

export type SiteSettings = {
  phone_display: string;
  phone_href: string;
  whatsapp_number: string;
  email: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  nav_links: NavLink[];
  book_now_label_en: string | null;
  book_now_label_ar: string | null;
  footer_bio_en: string | null;
  footer_bio_ar: string | null;
  footer_membership_en: string | null;
  footer_membership_ar: string | null;
  guide_links: NavLink[];
  branches: Branch[];
  hours_label_en: string | null;
  hours_label_ar: string | null;
  hours_text_en: string | null;
  hours_text_ar: string | null;
  copyright_en: string | null;
  copyright_ar: string | null;
  disclaimer_en: string | null;
  disclaimer_ar: string | null;
};

export type ContactSettingsInput = {
  phone_display: string;
  email: string;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
};

export type NavbarFooterInput = {
  nav_links: NavLink[];
  book_now_label_en: string;
  book_now_label_ar: string;
  footer_bio_en: string;
  footer_bio_ar: string;
  footer_membership_en: string;
  footer_membership_ar: string;
  guide_links: NavLink[];
  branches: Branch[];
  hours_label_en: string;
  hours_label_ar: string;
  hours_text_en: string;
  hours_text_ar: string;
  copyright_en: string;
  copyright_ar: string;
  disclaimer_en: string;
  disclaimer_ar: string;
};

// Used only if the site_settings row can't be reached at all (network/DB
// outage) or a field was left empty — mirrors the copy that used to be
// hardcoded in src/locales/*.json before this became admin-editable.
const DEFAULT_SETTINGS: SiteSettings = {
  phone_display: "+20 100 123 4567",
  phone_href: "tel:+201001234567",
  whatsapp_number: "201001234567",
  email: "contact@drsamehqassem.com",
  facebook_url: "https://facebook.com/drsamehqassem",
  instagram_url: "https://instagram.com/drsamehqassem",
  tiktok_url: "https://tiktok.com/@drsamehqassem",
  nav_links: [
    { href: "/", label_en: "Home", label_ar: "الرئيسية" },
    { href: "/about", label_en: "About Doctor", label_ar: "عن الدكتور" },
    { href: "/services", label_en: "Patient Services", label_ar: "خدمات المرضى" },
    { href: "/reviews", label_en: "Patient Reviews", label_ar: "آراء المرضى" },
    { href: "/videos", label_en: "Videos", label_ar: "الفيديوهات" },
    { href: "/articles", label_en: "Articles", label_ar: "المقالات" },
    { href: "/contact", label_en: "Contact Us", label_ar: "تواصل معنا" },
  ],
  book_now_label_en: "Book Now",
  book_now_label_ar: "احجز موعدك",
  footer_bio_en:
    "Over 15 years of experience in minimally invasive microsurgery, brain tumor resection, and skull base endoscopy, delivered with precision that rivals leading medical institutions in Europe.",
  footer_bio_ar:
    "خبرة تفوق 15 عاماً في الجراحات الميكروسكوبية طفيفة التوغل، استئصال أورام المخ، ومناظير قاع الجمجمة بدقة تضاهي أكبر الصروح الطبية في أوروبا.",
  footer_membership_en: "Member of the Egyptian and European Association of Neurosurgical Societies (EANS)",
  footer_membership_ar: "عضو الجمعية المصرية والأوروبية لجراحي الأعصاب (EANS)",
  guide_links: [
    { href: "/services", label_en: "Advanced Surgeries", label_ar: "الجراحات المتقدمة" },
    { href: "/services", label_en: "Conservative Treatments", label_ar: "العلاجات التحفظية" },
    { href: "/contact", label_en: "Book a Consultation", label_ar: "حجز الاستشارة الطبية" },
    { href: "/articles", label_en: "Prevention & Recovery Tips", label_ar: "نصائح الوقاية والتعافي" },
    { href: "/contact", label_en: "Accepted Health Insurance", label_ar: "التأمين الصحي المعتمد" },
  ],
  branches: [
    {
      label_en: "Branch One:",
      label_ar: "الفرع الأول:",
      text_en: "New Cairo, Medical Park Premier",
      text_ar: "القاهرة الجديدة، ميديكال بارك بريميير",
    },
    {
      label_en: "Branch Two:",
      label_ar: "الفرع الثاني:",
      text_en: "Mohandessin, Arab League Street, Giza",
      text_ar: "الجيزة، المهندسين، شارع جامعة الدول",
    },
  ],
  hours_label_en: "Clinic Hours:",
  hours_label_ar: "مواعيد الكشف:",
  hours_text_en: "Saturday to Wednesday (3:00 PM - 9:00 PM)",
  hours_text_ar: "السبت إلى الأربعاء (3:00 م - 9:00 م)",
  copyright_en: "© {year} Dr. Sameh Qassem. All rights reserved.",
  copyright_ar: "© {year} د. سامح قاسم. جميع الحقوق محفوظة.",
  disclaimer_en:
    "The medical content shown is for educational purposes only and does not replace a direct consultation with a qualified physician.",
  disclaimer_ar:
    "المحتوى الطبي المعروض لأغراض التوعية والتثقيف فقط ولا يغني عن الاستشارة الطبية المباشرة مع الطبيب المختص.",
};

// Admins type the phone number however they like (local "01147886551",
// with a leading "00", or already international). The call and WhatsApp
// buttons only work with a full international number, so this always
// derives phone_href/whatsapp_number with a country code rather than
// trusting the raw input — defaulting to Egypt (20) when none is given.
function normalizePhone(rawDisplay: string, defaultCountryCode = "20") {
  const digits = rawDisplay.replace(/[^\d+]/g, "");
  if (!digits) return { phone_href: "tel:", whatsapp_number: "" };

  let international: string;
  if (digits.startsWith("+")) {
    international = digits.slice(1);
  } else if (digits.startsWith("00")) {
    international = digits.slice(2);
  } else if (digits.startsWith("0")) {
    international = defaultCountryCode + digits.slice(1);
  } else if (digits.startsWith(defaultCountryCode)) {
    international = digits;
  } else {
    international = defaultCountryCode + digits;
  }

  return { phone_href: `tel:+${international}`, whatsapp_number: international };
}

export async function getSiteSettings(): Promise<ActionResult<SiteSettings>> {
  return runAction(async () => {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();

    if (error) throw error;
    return data as SiteSettings;
  });
}

function mergeWithDefaults(row: SiteSettings | null): SiteSettings {
  if (!row) return DEFAULT_SETTINGS;
  return {
    phone_display: row.phone_display || DEFAULT_SETTINGS.phone_display,
    phone_href: row.phone_href || DEFAULT_SETTINGS.phone_href,
    whatsapp_number: row.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number,
    email: row.email || DEFAULT_SETTINGS.email,
    facebook_url: row.facebook_url,
    instagram_url: row.instagram_url,
    tiktok_url: row.tiktok_url,
    nav_links: row.nav_links?.length ? row.nav_links : DEFAULT_SETTINGS.nav_links,
    book_now_label_en: row.book_now_label_en || DEFAULT_SETTINGS.book_now_label_en,
    book_now_label_ar: row.book_now_label_ar || DEFAULT_SETTINGS.book_now_label_ar,
    footer_bio_en: row.footer_bio_en || DEFAULT_SETTINGS.footer_bio_en,
    footer_bio_ar: row.footer_bio_ar || DEFAULT_SETTINGS.footer_bio_ar,
    footer_membership_en: row.footer_membership_en || DEFAULT_SETTINGS.footer_membership_en,
    footer_membership_ar: row.footer_membership_ar || DEFAULT_SETTINGS.footer_membership_ar,
    guide_links: row.guide_links?.length ? row.guide_links : DEFAULT_SETTINGS.guide_links,
    branches: row.branches?.length ? row.branches : DEFAULT_SETTINGS.branches,
    hours_label_en: row.hours_label_en || DEFAULT_SETTINGS.hours_label_en,
    hours_label_ar: row.hours_label_ar || DEFAULT_SETTINGS.hours_label_ar,
    hours_text_en: row.hours_text_en || DEFAULT_SETTINGS.hours_text_en,
    hours_text_ar: row.hours_text_ar || DEFAULT_SETTINGS.hours_text_ar,
    copyright_en: row.copyright_en || DEFAULT_SETTINGS.copyright_en,
    copyright_ar: row.copyright_ar || DEFAULT_SETTINGS.copyright_ar,
    disclaimer_en: row.disclaimer_en || DEFAULT_SETTINGS.disclaimer_en,
    disclaimer_ar: row.disclaimer_ar || DEFAULT_SETTINGS.disclaimer_ar,
  };
}

// For public-facing pages: always resolves to a usable SiteSettings object,
// falling back to DEFAULT_SETTINGS (as a whole, or field by field) rather
// than making every consumer handle the ActionResult/failure case itself.
export async function getSiteSettingsOrDefault(): Promise<SiteSettings> {
  const result = await getSiteSettings();
  return mergeWithDefaults(result.ok ? result.data : null);
}

export async function updateSiteSettings(input: ContactSettingsInput): Promise<ActionResult<SiteSettings>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { phone_href, whatsapp_number } = normalizePhone(input.phone_display);

    const { data, error } = await supabase
      .from("site_settings")
      .update({ ...input, phone_href, whatsapp_number })
      .eq("id", 1)
      .select("*")
      .single();

    if (error) throw error;

    // Phone/social links show up on every page (footer, floating actions,
    // hero booking card, contact page) — revalidate the whole site rather
    // than a single route.
    revalidatePath("/", "layout");
    revalidatePath("/admin/dashboard/settings");

    return data as SiteSettings;
  });
}

export async function updateNavbarFooterContent(input: NavbarFooterInput): Promise<ActionResult<SiteSettings>> {
  return runAction(async () => {
    await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("site_settings")
      .update(input)
      .eq("id", 1)
      .select("*")
      .single();

    if (error) throw error;

    // Nav links and footer content render in the layout on every page.
    revalidatePath("/", "layout");
    revalidatePath("/admin/dashboard/settings/navbar-footer");

    return data as SiteSettings;
  });
}

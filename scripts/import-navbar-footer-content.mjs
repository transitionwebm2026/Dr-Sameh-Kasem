// One-time import: seeds the new navbar/footer columns on site_settings
// (nav_links, book_now_label_*, footer_bio_*, footer_membership_*,
// guide_links, branches, hours_*, copyright_*, disclaimer_*) with the copy
// that used to be hardcoded in src/locales/*.json, now that they're
// admin-editable from /admin/dashboard/settings/navbar-footer. Only touches
// these new columns — leaves phone/email/social (already set by the admin)
// untouched. Safe to re-run.
//
// Usage: node scripts/import-navbar-footer-content.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  const content = readFileSync(envPath, "utf8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnvLocal();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const payload = {
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

async function main() {
  const { data, error } = await supabase
    .from("site_settings")
    .update(payload)
    .eq("id", 1)
    .select("phone_display, email, nav_links, book_now_label_en")
    .single();
  if (error) throw error;
  console.log("Updated site_settings. Untouched fields kept as-is:");
  console.log("  phone_display:", data.phone_display);
  console.log("  email:", data.email);
  console.log("Seeded fields sample:");
  console.log("  nav_links[0]:", data.nav_links[0]);
  console.log("  book_now_label_en:", data.book_now_label_en);
  console.log("\nDone. Navbar & footer content imported into Supabase.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

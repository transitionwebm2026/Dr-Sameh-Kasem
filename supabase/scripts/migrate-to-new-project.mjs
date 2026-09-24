// One-time data + storage migration from the old Supabase project to a new
// one. Run this AFTER the schema has been recreated on the new project
// (paste supabase/schema.sql then every file in supabase/migrations, in
// filename order, into the new project's SQL Editor).
//
// It copies table rows (preserving primary-key UUIDs so foreign keys still
// line up) and every file in the `cms-media` storage bucket. It does NOT
// touch Supabase Auth — auth.users can't be copied this way, so recreate the
// admin user by hand on the new project (see the printed instructions at
// the end) and it does NOT touch admin_profiles for the same reason.
//
// Usage (PowerShell):
//   $env:OLD_SUPABASE_URL="https://xxxx.supabase.co"
//   $env:OLD_SUPABASE_SERVICE_ROLE_KEY="..."
//   $env:NEW_SUPABASE_URL="https://yyyy.supabase.co"
//   $env:NEW_SUPABASE_SERVICE_ROLE_KEY="..."
//   node supabase/scripts/migrate-to-new-project.mjs
//
// Service role keys are found in each project's Settings -> API page. Use
// the service role key, not the anon key — it's the only one that bypasses
// Row Level Security, which this script needs to read/write every row.

import { createClient } from "@supabase/supabase-js";

const required = [
  "OLD_SUPABASE_URL",
  "OLD_SUPABASE_SERVICE_ROLE_KEY",
  "NEW_SUPABASE_URL",
  "NEW_SUPABASE_SERVICE_ROLE_KEY",
];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required env var: ${key}`);
    process.exit(1);
  }
}

const oldDb = createClient(process.env.OLD_SUPABASE_URL, process.env.OLD_SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const newDb = createClient(process.env.NEW_SUPABASE_URL, process.env.NEW_SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const BUCKET = "cms-media";

async function copyTable(table, { transform } = {}) {
  const { data, error } = await oldDb.from(table).select("*");
  if (error) throw new Error(`Reading ${table} from old project: ${error.message}`);
  if (!data || data.length === 0) {
    console.log(`${table}: nothing to copy`);
    return;
  }
  const rows = transform ? data.map(transform) : data;
  const { error: insertError } = await newDb.from(table).upsert(rows, { onConflict: "id" });
  if (insertError) throw new Error(`Writing ${table} to new project: ${insertError.message}`);
  console.log(`${table}: copied ${rows.length} row(s)`);
}

async function copyContentItems() {
  const { data, error } = await oldDb.from("content_items").select("*");
  if (error) throw new Error(`Reading content_items from old project: ${error.message}`);
  if (!data || data.length === 0) {
    console.log("content_items: nothing to copy");
    return;
  }
  const topLevel = data.filter((row) => !row.parent_id);
  const nested = data.filter((row) => row.parent_id);

  if (topLevel.length > 0) {
    const { error: e1 } = await newDb.from("content_items").upsert(topLevel, { onConflict: "id" });
    if (e1) throw new Error(`Writing content_items (top-level) to new project: ${e1.message}`);
  }
  if (nested.length > 0) {
    const { error: e2 } = await newDb.from("content_items").upsert(nested, { onConflict: "id" });
    if (e2) throw new Error(`Writing content_items (nested) to new project: ${e2.message}`);
  }
  console.log(`content_items: copied ${data.length} row(s)`);
}

async function listAllFiles(bucket, prefix = "") {
  const { data, error } = await oldDb.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) throw new Error(`Listing storage ${prefix || "/"}: ${error.message}`);
  let files = [];
  for (const entry of data ?? []) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    // Folders come back with id === null; files have metadata.
    if (entry.id === null) {
      files = files.concat(await listAllFiles(bucket, path));
    } else {
      files.push(path);
    }
  }
  return files;
}

async function copyStorage() {
  const files = await listAllFiles(BUCKET);
  if (files.length === 0) {
    console.log(`storage/${BUCKET}: nothing to copy`);
    return;
  }
  for (const path of files) {
    const { data: blob, error: downloadError } = await oldDb.storage.from(BUCKET).download(path);
    if (downloadError) {
      console.error(`  skip ${path}: download failed (${downloadError.message})`);
      continue;
    }
    const { error: uploadError } = await newDb.storage.from(BUCKET).upload(path, blob, {
      upsert: true,
      contentType: blob.type || "application/octet-stream",
    });
    if (uploadError) {
      console.error(`  skip ${path}: upload failed (${uploadError.message})`);
      continue;
    }
    console.log(`  copied ${path}`);
  }
  console.log(`storage/${BUCKET}: copied ${files.length} file(s)`);
}

async function clearSeedPages() {
  // 2026_init_cms.sql seeds 9 placeholder `pages` rows with fresh random
  // UUIDs when the schema is first created on the new project. Those collide
  // on the `slug` unique constraint with the real rows we're about to copy
  // in (same slugs, different ids), so wipe them first — safe because
  // page_heroes/sections/content_items cascade-delete from pages and this
  // new project has no real content yet.
  const { error } = await newDb.from("pages").delete().not("id", "is", null);
  if (error) throw new Error(`Clearing seed pages on new project: ${error.message}`);
}

async function main() {
  console.log("1/3 Copying table data...");
  await clearSeedPages();
  await copyTable("pages");
  await copyTable("page_heroes");
  await copyTable("sections");
  await copyContentItems();
  await copyTable("media", { transform: (row) => ({ ...row, uploaded_by: null }) });
  await copyTable("site_settings");
  await copyTable("consultation_requests");

  console.log("\n2/3 Copying storage files...");
  await copyStorage();

  console.log(`
3/3 Manual steps still required (Auth can't be copied by script):
  1. In the NEW project's dashboard: Authentication -> Add user. Use the
     same admin email as before (set a new password, or use "send invite").
  2. Copy the new user's UUID (Authentication -> Users -> click the user).
  3. In the NEW project's SQL Editor, run:
       insert into public.admin_profiles (user_id) values ('<uuid-from-step-2>');
  4. Update NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and
     SUPABASE_SERVICE_ROLE_KEY in .env.local (and in your hosting provider's
     project settings, e.g. Vercel) to the NEW project's values.
  5. Log in to /admin on the new project and spot-check a few pages.

Done.`);
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});

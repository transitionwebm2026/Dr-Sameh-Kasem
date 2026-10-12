# Dr. Sameh Qassem — Medical Website

Production Next.js (App Router) site for a neurosurgery & spine surgery practice, built with TypeScript, Tailwind CSS v4, Framer Motion, next-intl (Arabic/English, RTL/LTR), and Supabase — plus an admin CMS for editing every page's content without a code deploy.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack). Note: this version renamed `middleware.ts` → `proxy.ts` — see `src/proxy.ts`.
- **TypeScript**, strict mode
- **Tailwind CSS v4** — design tokens (colors, fonts, shadows) live in `src/app/globals.css` under `@theme`
- **next-intl** — locale routing at `/ar` and `/en`, translations in `src/locales/{ar,en}.json`
- **Framer Motion** — scroll-reveal, staggered grids, animated counters
- **Supabase** — Postgres + Auth + Storage, backing both the booking form and the admin CMS

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase keys
npm run dev
```

Visit `http://localhost:3000` (redirects to `/ar` by default).

## Project Structure

- `src/app/(site)/[locale]/` — the 9 public pages (home, about, services, reviews, videos, articles + `[slug]`, contact, privacy-policy, terms), a route group with its own root layout (Navbar/Footer/i18n)
- `src/app/admin/` — the admin CMS, a **separate root layout** (English/LTR, no Navbar/Footer): `login/`, `dashboard/` (sidebar shell) and `dashboard/[pageSlug]/` (tabbed per-page editor)
- `src/proxy.ts` — routes `/admin/*` through a Supabase session check (redirects to `/admin/login` if signed out) and everything else through next-intl's locale routing
- `src/lib/supabase/` — `server.ts`/`browser.ts` (SSR-aware clients), `proxy.ts` (session refresh for the proxy), `admin.ts` (`requireAdmin()` guard used by every write)
- `src/lib/controllers/` — Server Actions for the CMS (pages, heroes, sections, content items, media, auth), each returning a typed `ActionResult<T>` instead of throwing across the client/server boundary
- `src/lib/cms-types.ts` / `src/lib/cms-section-registry.ts` — the CMS's TypeScript shapes and the page→tabs map
- `src/components/admin/` — Sidebar, Topbar, LoginForm, HeroEditorForm, SectionEditorForm, ContentItemsEditor/Form, MediaUploader (drag-and-drop → Supabase Storage)
- `src/components/layout/`, `src/components/sections/`, `src/components/ui/` — the public site's components (unchanged by the CMS work)
- `src/locales/{ar,en}.json` — still the source of truth for the *live* site's copy today; the CMS tables are the intended next home for it (see below)
- `supabase/migrations/2026_init_cms.sql` — the full CMS schema, RLS, storage bucket, and page seed
- `supabase/schema.sql` — the original `consultation_requests` table (superseded/extended by the migration above, kept for history)

## Admin CMS setup

1. **Create a Supabase project** (or use an existing one) and grab its URL + anon key from Project Settings → API.
2. **Run the migration**: paste `supabase/migrations/2026_init_cms.sql` into the Supabase SQL Editor and run it (or `supabase db push` if you use the CLI). This creates every CMS table, enables RLS on all of them, creates the public `cms-media` storage bucket, and seeds the 9 `pages` rows.
3. **Set env vars** in `.env.local` (and your host's dashboard for production):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. **Create the first admin** (there is deliberately no self-serve sign-up UI):
   - Supabase Dashboard → Authentication → Add user (email + password).
   - SQL Editor: `insert into public.admin_profiles (user_id) values ('<the new user's UUID>');`
5. Sign in at `/admin/login`, then manage content from `/admin/dashboard`.

### What the CMS currently manages

Every page's **Hero** banner and the sections listed in `src/lib/cms-section-registry.ts` (specialties, testimonials, FAQ, stats, timeline, certificates, etc.) are fully admin-editable — saving a section creates its row on first use, and its repeatable cards (bullets, stats, FAQ items, reviews, articles, disciplines→conditions…) are managed through a generic add/edit/delete/reorder list. Item-type-specific fields that don't have their own column (a stat's number+suffix, an article's slug+body) live in a `meta` JSON field on each item, editable as raw JSON in that item's form.

**Not yet done, by design**: the migration seeds only the 9 `pages` rows — it does not copy the current `src/locales/{ar,en}.json` content into `sections`/`content_items`. The public site still renders from those JSON files today. Wiring the public pages to read from the CMS tables instead (and/or writing a one-time import script from the JSON into the new tables) is the natural next step once you've verified the schema fits.

## Before going live

1. **Replace placeholder content**: phone numbers, email, clinic addresses, Google Maps embed URLs, and social links in `src/lib/site-config.ts`.
2. **Replace stock imagery**: hero/about/article images currently point to Unsplash URLs inside `src/locales/{ar,en}.json`. Swap in real photos (add the image host to `next.config.ts` → `images.remotePatterns` if not using Unsplash).
3. **Supabase is required** for both the booking form and the admin CMS — see setup steps above. Without it configured, the public booking form still works (it opens WhatsApp directly) but nothing persists, and `/admin` cannot be used at all.
4. **Domain**: update `siteConfig.domain` in `src/lib/site-config.ts` (used for canonical URLs, sitemap, Open Graph).

## Build & Deploy

```bash
npm run preview   # next build + serve the static /out folder on :4000
```

The site is a **static export** (`output: "export"`): all CMS content is read from Supabase at build time, so a dashboard save only reaches the live site after a rebuild. Production runs on **Vercel**, which rebuilds on every push to `main`. `.github/workflows/deploy.yml` can additionally build and upload `/out` to Hostinger over FTPS (on push, the manual "Run workflow" button, or a dashboard save).

**Rebuild on every dashboard save**: run `supabase/migrations/2026_07_auto_deploy_on_content_change.sql` in the Supabase SQL Editor, then store in Vault whichever applies (exact commands in that file's header):

- **Vercel**: a Deploy Hook URL (Project → Settings → Git → Deploy Hooks, branch `main`) as `vercel_deploy_hook_url`.
- **Hostinger**: a GitHub fine-grained token (this repo only, "Contents: Read and write") as `github_deploy_token`, plus the repo secrets the workflow needs (Settings → Secrets and variables → Actions): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `HOSTINGER_FTP_HOST`, `HOSTINGER_FTP_USER`, `HOSTINGER_FTP_PASSWORD`.

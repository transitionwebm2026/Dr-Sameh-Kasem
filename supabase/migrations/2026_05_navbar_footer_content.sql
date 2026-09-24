-- Extends site_settings (the site-wide singleton row) so the admin can edit
-- the navbar (nav links + "Book Now" button) and footer (bio, membership,
-- patient guide links, branches, hours, copyright, disclaimer) content that
-- was previously hardcoded in src/locales/*.json. Existing RLS policies on
-- site_settings (public select, admin-only update) already cover these new
-- columns — no policy changes needed.

alter table public.site_settings
  add column if not exists email text not null default 'contact@drsamehqassem.com',
  add column if not exists nav_links jsonb not null default '[]'::jsonb,
  add column if not exists book_now_label_en text,
  add column if not exists book_now_label_ar text,
  add column if not exists footer_bio_en text,
  add column if not exists footer_bio_ar text,
  add column if not exists footer_membership_en text,
  add column if not exists footer_membership_ar text,
  add column if not exists guide_links jsonb not null default '[]'::jsonb,
  add column if not exists branches jsonb not null default '[]'::jsonb,
  add column if not exists hours_label_en text,
  add column if not exists hours_label_ar text,
  add column if not exists hours_text_en text,
  add column if not exists hours_text_ar text,
  add column if not exists copyright_en text,
  add column if not exists copyright_ar text,
  add column if not exists disclaimer_en text,
  add column if not exists disclaimer_ar text;

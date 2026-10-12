-- The public site is a static export: every page's content is read from
-- these tables once, at build time, so an admin save only reaches the live
-- site after a rebuild + redeploy. This fires that rebuild automatically —
-- any write to a table the site renders from sends a `repository_dispatch`
-- (event type `cms-content-changed`) to GitHub, which runs
-- .github/workflows/deploy.yml.
--
-- Supabase's built-in Database Webhooks can't be used for this: they always
-- POST the changed row as the body, and GitHub's dispatch endpoint rejects
-- any body without an `event_type`. Hence a trigger calling pg_net directly.
--
-- One-time setup, before or after running this file (until then the trigger
-- just logs a warning and skips — saves are never blocked):
--   1. GitHub → Settings → Developer settings → Fine-grained tokens → new
--      token, repository access: only Dr-Sameh-Kasem, permission
--      "Contents: Read and write" (required by the dispatch endpoint).
--   2. In the Supabase SQL Editor:
--        select vault.create_secret('<the token>', 'github_deploy_token');
--      To replace it later (e.g. when it expires):
--        select vault.update_secret(
--          (select id from vault.secrets where name = 'github_deploy_token'),
--          '<the new token>'
--        );

create extension if not exists pg_net with schema extensions;

create or replace function public.trigger_site_deploy()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  github_token text;
begin
  select decrypted_secret into github_token
  from vault.decrypted_secrets
  where name = 'github_deploy_token'
  limit 1;

  if github_token is null then
    raise warning 'Vault secret github_deploy_token is not set; skipping site redeploy.';
    return null;
  end if;

  -- Queued, not sent inline: pg_net delivers it from a background worker
  -- after this transaction commits (and drops it if it rolls back), so the
  -- admin's save never waits on GitHub.
  perform net.http_post(
    url := 'https://api.github.com/repos/transitionwebm2026/Dr-Sameh-Kasem/dispatches',
    body := jsonb_build_object('event_type', 'cms-content-changed'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || github_token,
      'Accept', 'application/vnd.github+json',
      'X-GitHub-Api-Version', '2022-11-28',
      'User-Agent', 'dr-sameh-cms',
      'Content-Type', 'application/json'
    )
  );

  return null;
end;
$$;

-- Only ever runs as a trigger; nobody should be able to call it via /rpc.
revoke all on function public.trigger_site_deploy() from public, anon, authenticated;

-- FOR EACH STATEMENT, not per row: a reorder or bulk edit is one dispatch,
-- not one per touched row. The workflow's concurrency group further
-- collapses a burst of saves into a single trailing deploy.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['pages', 'page_heroes', 'sections', 'content_items', 'site_settings']
  loop
    execute format('drop trigger if exists deploy_site_on_change on public.%I', table_name);
    execute format(
      'create trigger deploy_site_on_change
         after insert or update or delete on public.%I
         for each statement execute function public.trigger_site_deploy()',
      table_name
    );
  end loop;
end;
$$;

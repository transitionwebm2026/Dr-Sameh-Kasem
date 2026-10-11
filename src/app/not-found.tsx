"use client";

import { useSyncExternalStore } from "react";

const LOCALES = ["ar", "en"] as const;
const DEFAULT_LOCALE = "ar";

const COPY = {
  ar: { heading: "الصفحة غير موجودة", link: "العودة للرئيسية", dir: "rtl" as const },
  en: { heading: "Page not found", link: "Back to home", dir: "ltr" as const },
};

function subscribe() {
  return () => {};
}

// null on the server (and on the client's very first, pre-hydration
// render, to avoid a hydration mismatch) — the real path only once mounted.
function getSnapshot() {
  return window.location.pathname + window.location.search;
}
function getServerSnapshot() {
  return null;
}

// Reached in two cases, both only possible because there's no middleware
// under output: 'export' to handle them server-side:
// 1. No locale segment at all (e.g. a bookmarked/typed "/contact" instead
//    of "/ar/contact") — redirect client-side to the default locale.
// 2. A path with a valid locale prefix but no matching page (e.g.
//    "/ar/nonexistent") — show a real 404 instead of redirecting forever.
export default function NotFound() {
  const url = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (url === null) return <div className="min-h-screen bg-brand-ivory" />;

  const firstSegment = url.split("/")[1];
  if (!(LOCALES as readonly string[]).includes(firstSegment)) {
    window.location.replace(`/${DEFAULT_LOCALE}${url}`);
    return <div className="min-h-screen bg-brand-ivory" />;
  }

  const copy = COPY[firstSegment as (typeof LOCALES)[number]];

  return (
    <div
      dir={copy.dir}
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-ivory px-4 text-center"
    >
      <h1 className="text-2xl font-black text-brand-forest">{copy.heading}</h1>
      <a
        href={`/${firstSegment}`}
        className="rounded-full bg-brand-forest px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-900"
      >
        {copy.link}
      </a>
    </div>
  );
}

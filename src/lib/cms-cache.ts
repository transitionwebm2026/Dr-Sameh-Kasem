import "server-only";
import { unstable_cache } from "next/cache";

// One shared tag for every cached CMS read (pages, heroes, sections,
// content items, across every page). An admin save anywhere calls
// updateTag(CMS_CACHE_TAG), which busts all of it — coarser than tagging
// per page, but editing one page is rare compared to how often visitors
// navigate the site, so the cost of a slightly wider invalidation is
// negligible next to the cost of re-fetching on every single page view.
export const CMS_CACHE_TAG = "cms-content";

/**
 * Wraps a read in Next's Data Cache under CMS_CACHE_TAG. `keyParts` must
 * uniquely identify this specific query (function name + its arguments) so
 * different pages/sections don't collide on the same cache entry.
 */
export function cachedCmsRead<T>(keyParts: string[], fn: () => Promise<T>): Promise<T> {
  return unstable_cache(fn, keyParts, { tags: [CMS_CACHE_TAG] })();
}

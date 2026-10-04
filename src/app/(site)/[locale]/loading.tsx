// Shown instantly while a page under this layout is still loading its data
// (every page here is dynamic, so a click needs some visual feedback before
// the new page actually arrives) — without this, clicking a nav link just
// looks unresponsive for however long the server render takes.
//
// This fills roughly a full viewport height (matching a typical page's own
// height) rather than just the thin top bar alone — the Footer sits right
// after this in the layout, so a near-zero-height fallback made it jump up
// to sit right under the navbar for a moment, then jump back down once the
// real page arrived. The min-h-screen block keeps that from happening.
export default function Loading() {
  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden"
        role="status"
        aria-label="Loading"
      >
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-r from-brand-gold via-brand-600 to-brand-forest" />
      </div>
      <div className="flex min-h-screen items-center justify-center bg-brand-ivory" aria-hidden="true">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-gold/25 border-t-brand-gold" />
      </div>
    </>
  );
}

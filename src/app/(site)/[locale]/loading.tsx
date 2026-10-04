// Shown instantly while a page under this layout is still loading its data
// (every page here is dynamic, so a click needs some visual feedback before
// the new page actually arrives) — without this, clicking a nav link just
// looks unresponsive for however long the server render takes.
export default function Loading() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden"
      role="status"
      aria-label="Loading"
    >
      <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-r from-brand-gold via-brand-600 to-brand-forest" />
    </div>
  );
}

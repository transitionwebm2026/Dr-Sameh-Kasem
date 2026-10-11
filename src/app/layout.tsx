import "./globals.css";

// Root layout for routes that match neither (site)/[locale] nor admin's own
// root layout (route groups each define their own root layout — see
// admin/layout.tsx's comment). In practice this only ever renders behind
// not-found.tsx, for a request that reached a path with no locale segment
// at all (e.g. a bookmarked/typed "/contact" instead of "/ar/contact") —
// there's no middleware anymore to add the prefix server-side under
// output: 'export', so not-found.tsx redirects client-side instead.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-brand-ivory">{children}</body>
    </html>
  );
}

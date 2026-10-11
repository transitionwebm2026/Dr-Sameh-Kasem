import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Static export: builds to a plain /out directory of HTML/CSS/JS with no
  // Node server required at runtime, for hosting as a static website
  // (e.g. Hostinger's static hosting tier, no Node.js "web app" slot).
  output: "export",
  // Emit path/index.html (not path.html) for every route, so a plain
  // Apache host serves clean URLs like /ar/services via its default
  // DirectoryIndex behavior with no custom rewrite rules needed.
  trailingSlash: true,
  // Limit build parallelism: this dev machine has very little free RAM,
  // and the default worker-per-CPU pool was exhausting heap during the
  // "Collecting page data" phase. Safe to remove on a beefier machine/CI.
  experimental: {
    cpus: 2,
    workerThreads: false,
  },
  images: {
    // No Node server to run the Image Optimization API under static
    // export, so images are served as uploaded/authored (no automatic
    // resize/format conversion/responsive srcset). Pre-size large photos
    // before uploading them in the admin dashboard.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Supabase Storage public URLs (cms-media bucket). Self-hosted or
        // custom-domain Supabase projects should replace this pattern with
        // their actual storage hostname.
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        // Auto-derived YouTube video thumbnails (see src/lib/video.ts).
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

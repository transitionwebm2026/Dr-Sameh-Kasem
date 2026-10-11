import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { listArticleSlugs } from "@/lib/articles";

const paths = ["", "/about", "/services", "/reviews", "/videos", "/articles", "/contact"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of paths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteConfig.domain}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteConfig.domain}/${l}${path}`])
          ),
        },
      });
    }
  }

  const slugs = await listArticleSlugs();
  for (const slug of slugs) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteConfig.domain}/${locale}/articles/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteConfig.domain}/${l}/articles/${slug}`])
          ),
        },
      });
    }
  }

  return entries;
}

import { getPageBySlug } from "@/lib/controllers/pages";
import { listSectionsByPageId } from "@/lib/controllers/sections";
import { listContentItemsBySection } from "@/lib/controllers/contentItems";
import { metaString } from "@/lib/cms-render";

export type Article = {
  slug: string;
  date: string;
  readTime: string;
  category: string;
  title: string;
  text: string;
  content: string[];
  image?: string;
};

const categoryImageMap: Record<string, string> = {
  "Brain Surgery": "/images/brain.png",
  "General Awareness": "/images/brain.png",
  Spine: "/images/spine.png",
  "Skull Base": "/images/pediatric.png",
  Vascular: "/images/brain.png",
  Epilepsy: "/images/nerves.png",
  "جراحات المخ": "/images/brain.png",
  "توعية عامة": "/images/brain.png",
  "العمود الفقري": "/images/spine.png",
  "قاع الجمجمة": "/images/pediatric.png",
  "الأوعية الدموية": "/images/brain.png",
  الصرع: "/images/nerves.png",
};

export function getArticleImage(category: string): string {
  return categoryImageMap[category] ?? "/images/brain.png";
}

export async function listArticleSlugs(): Promise<string[]> {
  const pageResult = await getPageBySlug("articles");
  if (!pageResult.ok || !pageResult.data) return [];

  const sectionsResult = await listSectionsByPageId(pageResult.data.id);
  const section = sectionsResult.ok
    ? sectionsResult.data.find((s) => s.section_key === "articlesSection")
    : undefined;
  if (!section) return [];

  const itemsResult = await listContentItemsBySection(section.id);
  if (!itemsResult.ok) return [];

  return itemsResult.data
    .filter((item) => !item.parent_id)
    .map((item) => metaString(item.meta, "slug"))
    .filter((slug) => slug.length > 0);
}

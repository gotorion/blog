import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // 每篇文章是 blog/<slug>/index.md，图片可以放在同一文件夹里。
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
    generateId: ({ entry }) =>
      entry.replace(/\.(md|mdx)$/, "").replace(/\/index$/, "") || "index",
  }),
  schema: z.object({
    title: z.string().trim().default(""),
  }),
});

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { blog, pages };

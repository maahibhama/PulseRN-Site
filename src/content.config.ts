import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        author: z.string().optional(),
        date: z.coerce.date().optional(),
        tags: z.array(z.string()).max(4).optional(),
        canonical_url: z.url().optional(),
        cover_image: z.url().optional(),
        published: z.boolean().optional(),
      }),
    }),
  }),
};

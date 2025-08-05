import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { parseISO } from 'date-fns'

const docs = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      // Transform string to Date object
      added: z.string().transform<Date>((str) => parseISO(str)),
      updated: z
        .string()
        .transform<Date>((str) => parseISO(str))
        .optional(),
    }),
})

export const collections = { docs }

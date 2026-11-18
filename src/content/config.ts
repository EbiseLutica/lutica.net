import { defineCollection, z } from 'astro:content';
import { VISIBILITIES } from '../scripts/blog';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.union([z.string(), z.date()]).transform((v) => new Date(v)),
    visibility: z.enum(VISIBILITIES).default('public'),
  }),
});

export const collections = {
  blog,
};

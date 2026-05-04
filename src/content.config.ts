import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SITE_KEYWORDS } from './consts';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			metaTitle: z.string(),
			metaDescription: z.string(),
			mainKeyword: z.enum(SITE_KEYWORDS),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			category: z.string(),
			tags: z.array(z.string()).min(3),
			internalLinks: z.array(z.string()).min(7),
			images: z
				.array(
					z.object({
						src: z.string().url(),
						alt: z.string(),
						title: z.string(),
						source: z.string().url(),
					}),
				)
				.min(3),
		}),
});

export const collections = { blog };

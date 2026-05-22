import { z } from 'zod';
import { SITE_KEYWORDS } from '@/consts';

export const blogFrontmatterSchema = z.object({
	title: z.string(),
	description: z.string(),
	metaTitle: z.string(),
	metaDescription: z.string(),
	mainKeyword: z.enum(SITE_KEYWORDS),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	category: z.string(),
	tags: z.array(z.string()).min(3),
	internalLinks: z.array(z.string()).min(10),
	images: z
		.array(
			z.object({
				src: z.string().url(),
				alt: z.string(),
				title: z.string(),
				description: z.string(),
				source: z.string().url(),
			}),
		)
		.min(3),
});

export type BlogFrontmatter = z.infer<typeof blogFrontmatterSchema>;

export type BlogPost = {
	slug: string;
	data: BlogFrontmatter;
	content: string;
};

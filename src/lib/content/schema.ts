import { z } from 'zod';
import { SITE_KEYWORDS } from '@/consts';

const faqItemSchema = z.object({
	question: z.string().min(8),
	answer: z.string().min(20),
});

export const blogFrontmatterSchema = z.object({
	title: z.string(),
	description: z.string(),
	metaTitle: z.string(),
	metaDescription: z.string(),
	mainKeyword: z.enum(SITE_KEYWORDS),
	secondaryKeywords: z.array(z.string().min(2)).max(6).optional(),
	contentType: z.enum(['pillar', 'cluster']).optional(),
	geoKeywords: z.array(z.string().min(2)).max(4).optional(),
	faq: z.array(faqItemSchema).max(8).optional(),
	materialChange: z.boolean().optional(),
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
export type BlogFaqItem = z.infer<typeof faqItemSchema>;

export type BlogPost = {
	slug: string;
	data: BlogFrontmatter;
	content: string;
};

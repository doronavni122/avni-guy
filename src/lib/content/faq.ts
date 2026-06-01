import type { BlogFaqItem, BlogFrontmatter } from './schema';

/** Extract FAQ pairs from MDX body (## שאלות נפוצות section with **question?** answers). */
export function parseFaqFromBody(body: string): BlogFaqItem[] {
	const sectionMatch = body.match(/##\s+שאלות נפוצות[\s\S]*/u);
	if (!sectionMatch) return [];

	const section = sectionMatch[0];
	const items: BlogFaqItem[] = [];
	const re = /\*\*([^*]+?\?)\*\*\s*([^\n*]+(?:\n(?![*#])[^\n*]+)*)/gu;
	let match: RegExpExecArray | null;
	while ((match = re.exec(section)) !== null) {
		const question = match[1].trim();
		const answer = match[2].trim().replace(/\n+/g, ' ');
		if (question.length >= 8 && answer.length >= 20) {
			items.push({ question, answer });
		}
	}
	return items;
}

/** Frontmatter faq array takes precedence; otherwise parse body section. */
export function resolveArticleFaq(data: BlogFrontmatter, body: string): BlogFaqItem[] {
	if (data.faq && data.faq.length > 0) return data.faq;
	return parseFaqFromBody(body);
}

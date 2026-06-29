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

const FAQ_SECTION_PATTERN = /##\s+שאלות נפוצות[\s\S]*$/u;

/** Remove in-body FAQ when frontmatter faq drives ArticleFaq (avoids duplicate render). */
export function stripFaqSectionFromBody(body: string): string {
	return body.replace(FAQ_SECTION_PATTERN, '').trimEnd();
}

/** Frontmatter faq array takes precedence; otherwise parse body section. */
export function resolveArticleFaq(data: BlogFrontmatter, body: string): BlogFaqItem[] {
	if (data.faq && data.faq.length > 0) return data.faq;
	return parseFaqFromBody(body);
}

/** Body passed to MDX: omit FAQ section when frontmatter supplies faq for ArticleFaq. */
export function bodyForRender(data: BlogFrontmatter, body: string): string {
	if (data.faq && data.faq.length > 0) {
		return stripFaqSectionFromBody(body);
	}
	return body;
}

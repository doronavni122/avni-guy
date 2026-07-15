import { SITE_CONTACT_EMAIL, SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/consts';
import { getSortedPosts } from '@/lib/content/posts';
import type { BlogPost } from '@/lib/content/schema';

export const dynamic = 'force-static';

const RSS_AUTHOR_NAME = 'גיא אבני';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Escape CDATA end marker so embedded HTML cannot close the section early. */
function sanitizeCdata(html: string): string {
	return html.replace(/]]>/g, ']]]]><![CDATA[>');
}

function absolutizeUrl(maybeRelative: string): string {
	try {
		return new URL(maybeRelative, SITE_URL).toString();
	} catch (err) {
		console.error('[rss.xml] absolutizeUrl failed', { maybeRelative, err });
		return maybeRelative;
	}
}

function guessImageMime(src: string): string {
	const lower = src.toLowerCase();
	if (lower.endsWith('.png')) return 'image/png';
	if (lower.endsWith('.webp')) return 'image/webp';
	if (lower.endsWith('.gif')) return 'image/gif';
	if (lower.endsWith('.avif')) return 'image/avif';
	if (lower.endsWith('.svg')) return 'image/svg+xml';
	return 'image/jpeg';
}

/** Escape plain text, then restore a small safe inline markdown subset as HTML. */
function inlineMarkdown(text: string): string {
	const placeholders: string[] = [];
	const stash = (html: string): string => {
		const i = placeholders.length;
		placeholders.push(html);
		return `\u0000${i}\u0000`;
	};

	let working = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
		const abs = absolutizeUrl(href);
		return stash(`<a href="${escapeHtml(abs)}">${escapeHtml(label)}</a>`);
	});

	working = working.replace(/\*\*([^*]+)\*\*/g, (_m, bold: string) => stash(`<strong>${escapeHtml(bold)}</strong>`));

	working = escapeHtml(working);
	return working.replace(/\u0000(\d+)\u0000/g, (_m, idx: string) => placeholders[Number(idx)] ?? '');
}

/**
 * Lightweight MDX/markdown → HTML for content:encoded.
 * Intentionally subset-only (no JSX execution, no script).
 */
function markdownToRssHtml(markdown: string, slug: string): string {
	try {
		const lines = markdown.replace(/\r\n/g, '\n').split('\n');
		const html: string[] = [];
		let listOpen = false;
		let paragraph: string[] = [];

		const closeList = () => {
			if (!listOpen) return;
			html.push('</ul>');
			listOpen = false;
		};

		const flushPara = () => {
			if (paragraph.length === 0) return;
			html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
			paragraph = [];
		};

		for (const rawLine of lines) {
			const trimmed = rawLine.trim();

			if (trimmed.length === 0) {
				flushPara();
				closeList();
				continue;
			}

			// Drop MDX/JSX import-like or component lines
			if (trimmed.startsWith('import ') || trimmed.startsWith('<') || trimmed.startsWith('{')) {
				continue;
			}

			const headingMatch = trimmed.match(/^(#{2,4})\s+(.+)$/);
			if (headingMatch) {
				flushPara();
				closeList();
				const level = headingMatch[1].length;
				html.push(`<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`);
				continue;
			}

			const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
			if (listMatch) {
				flushPara();
				if (!listOpen) {
					html.push('<ul>');
					listOpen = true;
				}
				html.push(`<li>${inlineMarkdown(listMatch[1])}</li>`);
				continue;
			}

			closeList();
			paragraph.push(trimmed);
		}

		flushPara();
		closeList();
		return html.join('\n');
	} catch (err) {
		console.error('[rss.xml] markdownToRssHtml failed', { slug, err });
		return `<p>${escapeHtml(markdown.slice(0, 500))}</p>`;
	}
}

function buildAuthorElements(): string {
	const authorEmail = SITE_CONTACT_EMAIL.trim();
	const authorTag =
		authorEmail.length > 0
			? `<author>${escapeXml(`${authorEmail} (${RSS_AUTHOR_NAME})`)}</author>\n`
			: '';
	return `${authorTag}<dc:creator>${escapeXml(RSS_AUTHOR_NAME)}</dc:creator>`;
}

function buildMediaContent(post: BlogPost): string {
	try {
		const image = post.data.images?.[0];
		if (!image?.src) return '';
		const url = absolutizeUrl(image.src);
		const type = guessImageMime(url);
		const titleAttr = image.title ? ` title="${escapeXml(image.title)}"` : '';
		return `<media:content url="${escapeXml(url)}" medium="image" type="${escapeXml(type)}"${titleAttr}/>
<media:title>${escapeXml(image.alt || image.title || post.data.title)}</media:title>`;
	} catch (err) {
		console.error('[rss.xml] buildMediaContent failed', { slug: post.slug, err });
		return '';
	}
}

function buildItem(post: BlogPost): string {
	const link = new URL(`/blog/${post.slug}/`, SITE_URL).toString();
	let encoded = '';
	try {
		encoded = sanitizeCdata(markdownToRssHtml(post.content, post.slug));
	} catch (err) {
		console.error('[rss.xml] content:encoded failed', { slug: post.slug, err });
		encoded = escapeHtml(post.data.description);
	}

	const media = buildMediaContent(post);
	const authorBlock = buildAuthorElements();

	return `<item>
<title>${escapeXml(post.data.title)}</title>
<description>${escapeXml(post.data.description)}</description>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${post.data.pubDate.toUTCString()}</pubDate>
${authorBlock}
<content:encoded><![CDATA[${encoded}]]></content:encoded>
${media}
</item>`;
}

export async function GET() {
	try {
		const posts = await getSortedPosts();
		const items = posts.map((post) => buildItem(post)).join('\n');

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${escapeXml(SITE_TITLE)}</title>
<description>${escapeXml(SITE_DESCRIPTION)}</description>
<link>${SITE_URL}/</link>
<language>he</language>
${items}
</channel>
</rss>`;

		return new Response(xml, {
			headers: {
				'Content-Type': 'application/rss+xml; charset=utf-8',
			},
		});
	} catch (err) {
		console.error('[rss.xml] GET failed', err);
		return new Response('RSS generation failed', { status: 500 });
	}
}

import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/consts';
import { getSortedPosts } from '@/lib/content/posts';

export const dynamic = 'force-static';

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	try {
		const posts = await getSortedPosts();
		const items = posts
			.map((post) => {
				const link = new URL(`/blog/${post.slug}/`, SITE_URL).toString();
				return `<item>
<title>${escapeXml(post.data.title)}</title>
<description>${escapeXml(post.data.description)}</description>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${post.data.pubDate.toUTCString()}</pubDate>
</item>`;
			})
			.join('\n');

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
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

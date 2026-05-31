#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

const SITE_URL = 'https://avniguy.co.il';
const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');
const OUTPUT_PATH = path.join(process.cwd(), 'public/llms.txt');

const STATIC_LINKS = [
	{ label: 'דף הבית', href: `${SITE_URL}/`, desc: 'נקודת כניסה, מסלולי קריאה מומלצים ושאלות נפוצות.' },
	{ label: 'אודות', href: `${SITE_URL}/about/`, desc: 'מי אנחנו והקשר המקצועי.' },
	{ label: 'שירותים', href: `${SITE_URL}/services/`, desc: 'מה המשרד מספק ולמי זה מתאים.' },
	{ label: 'יצירת קשר', href: `${SITE_URL}/contact/`, desc: 'תיאום שיחה והמשך תהליך.' },
	{ label: 'מאמרים', href: `${SITE_URL}/blog/`, desc: 'אינדקס כל המאמרים.' },
	{ label: 'קטגוריות', href: `${SITE_URL}/categories/`, desc: 'ארגון תוכן לפי נושאים.' },
	{ label: 'תגיות', href: `${SITE_URL}/tags/`, desc: 'ניווט לפי תגיות.' },
];

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[sync:llms] ${message}`, details);
		return;
	}
	console.log(`[sync:llms] ${message}`);
}

function slugFromFilePath(filePath) {
	const base = path.basename(filePath).replace(/\.(md|mdx)$/, '');
	if (base === 'index') return path.basename(path.dirname(filePath));
	return base;
}

function countWordsHe(text) {
	return text.split(/\s+/).filter(Boolean).length;
}

async function loadPosts() {
	const files = await fg('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
	const posts = [];
	for (const filePath of files) {
		try {
			const raw = await fs.readFile(filePath, 'utf8');
			const { data, content } = matter(raw);
			const slug = slugFromFilePath(filePath);
			posts.push({
				slug,
				title: data.title ?? slug,
				description: data.description ?? '',
				pubDate: data.pubDate ? new Date(data.pubDate) : new Date(0),
				wordCount: countWordsHe(content),
			});
		} catch (err) {
			console.error('[sync:llms] read failed', { filePath, err });
		}
	}
	return posts.sort((a, b) => b.pubDate - a.pubDate);
}

function formatSection(title, items) {
	const lines = items.map((item) => `- [${item.title}](${item.href}): ${item.desc}`);
	return `## ${title}\n\n${lines.join('\n')}\n`;
}

async function main() {
	logStep('loading posts');
	const posts = await loadPosts();

	const pillars = posts
		.filter((p) => p.wordCount >= 900)
		.slice(0, 8)
		.map((p) => ({
			title: p.title,
			href: `${SITE_URL}/blog/${p.slug}/`,
			desc: p.description.slice(0, 120),
		}));

	const recent = posts
		.filter((p) => p.wordCount < 900 || !pillars.some((x) => x.href.includes(p.slug)))
		.slice(0, 8)
		.map((p) => ({
			title: p.title,
			href: `${SITE_URL}/blog/${p.slug}/`,
			desc: p.description.slice(0, 120),
		}));

	const staticSection = STATIC_LINKS.map((l) => `- [${l.label}](${l.href}): ${l.desc}`).join('\n');

	const body = `# גיא אבני עו״ד: משפטים, כלכלה, נדלן ודין

> אתר תוכן מקצועי בעברית: מאמרים, שירותים ומסלולי קריאה ללקוחות פרטיים ועסקים. התוכן הוא למידע כללי ואינו מהווה ייעוץ משפטי אישי.

## דפים מרכזיים

${staticSection}

${formatSection('מאמרים עומק (מדריכים מקיפים)', pillars)}

${formatSection('מאמרים מומלצים (תהליכים ושגרה)', recent)}

## ממשקים למערכות AI

- [llms-full.txt](${SITE_URL}/llms-full.txt): כל התוכן בקובץ markdown אחד.
- חיפוש סמנטי: POST ${SITE_URL}/api/search/ body {"query":"..."}
- חיפוש GET: ${SITE_URL}/api/search/?q=...
- רשימת URLs: GET ${SITE_URL}/api/site-urls/?section=blog
- MCP (Streamable HTTP): POST ${SITE_URL}/api/mcp/
- כלים: search_site, list_site_urls

## Optional

- [מפת אתר (Sitemap)](${SITE_URL}/sitemap.xml): רשימת כתובות לזחילה טכנית.
- [פיד RSS](${SITE_URL}/rss.xml): עדכונים לפי פרסום מאמרים.
`;

	await fs.writeFile(OUTPUT_PATH, body, 'utf8');
	logStep('written', { path: OUTPUT_PATH, posts: posts.length, pillars: pillars.length });
}

main().catch((err) => {
	console.error('[sync:llms] fatal error', err);
	process.exit(1);
});

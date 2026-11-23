#!/usr/bin/env node
/**
 * Regenerate public/llms-full.txt from clean MDX + static hubs (no HTML scrape noise).
 * Skips quarantined blog slugs. Hook from publish-draft after successful writes.
 *
 * Usage: node scripts/regenerate-llms-full.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = path.join(ROOT, 'src/content/blog');
const OUT = path.join(ROOT, 'public/llms-full.txt');
const SITE = 'https://avniguy.co.il';

/** Keep in sync with src/lib/seo/indexation.ts QUARANTINED_BLOG_SLUGS */
const QUARANTINED = new Set([
	'time-management-for-legal-work',
	'process-improvement-for-legal-teams',
	'wrong-page-signature-checks-initials',
	'workplace-harassment-complaint-filing',
	'wage-delay-penalty-clock-start',
	'unregistered-lease-contract-saving-clause',
	'travel-ban-order-cancel-urgent',
	'third-party-car-insurance-denial-overturn',
	'rent-increase-over-five-percent-consent',
	'questions-expose-bad-lawyer-first-meeting',
	'property-purchase-tax-legal-reduction',
	'prenuptial-agreement-cost-divorce-savings',
	'non-compete-clause-israel-enforceability',
	'national-insurance-appeal-approval-reason',
	'mediation-cheaper-than-lawsuit-why-not-offered',
	'maternity-benefits-fifteen-weeks-three-conditions',
	'legal-retainer-eight-deliverables',
	'lawyer-dual-representation-ethics-complaint',
	'israeli-lease-contract-traps',
	'income-tax-refund-who-misses',
	'enforcement-freeze-bank-account-release-48-hours',
	'divorce-mediation-cost-vs-litigation',
	'defamation-claim-without-damage-proof',
	'debt-collection-claim-minimum-amount',
	'criminal-record-sealing-seven-years',
	'criminal-case-closure-no-record',
	'client-trust-roadmap',
]);

const HUBS = [
	{
		title: 'דף הבית',
		url: `${SITE}/`,
		blurb:
			'פורטל תוכן בעברית: מסלולי קריאה, שאלות נפוצות, וקישורים לאודות, שירותים ומאמרים. המידע כללי ואינו ייעוץ משפטי אישי.',
	},
	{
		title: 'אודות גיא אבני',
		url: `${SITE}/about/`,
		blurb:
			'עמוד היישות של גיא אבני, עו״ד: תחומי ליווי (נדל״ן, מיסוי מקרקעין, חוזים, ליטיגציה), גבולות השירות ומסלול פנייה.',
	},
	{
		title: 'שירותים',
		url: `${SITE}/services/`,
		blurb: 'מסלולי ליווי משפטי: מיקוד, תכנון, ליווי ומעקב. למי מתאים ומה מצפים בכל שלב.',
	},
	{
		title: 'יצירת קשר',
		url: `${SITE}/contact/`,
		blurb: 'תיאום שיחת מיקוד והמשך תהליך. הכינו תיאור קצר, מסמכים רלוונטיים ושתי מטרות.',
	},
	{
		title: 'ארכיון מאמרים',
		url: `${SITE}/blog/`,
		blurb: 'אינדקס כל המאמרים המפורסמים באתר.',
	},
];

function logStep(step, detail) {
	console.error(`[regenerate-llms-full:${step}]`, detail);
}

function extractLead(body, description) {
	const tldr = body.match(/##\s*(?:בקצרה|TL;DR)[^\n]*\n([\s\S]*?)(?=\n##\s|\n*$)/u);
	if (tldr?.[1]) {
		const bullets = [...tldr[1].matchAll(/^[-*]\s+(.+)$/gmu)].map((m) => m[1].trim());
		if (bullets.length) return bullets.slice(0, 4).join(' ');
	}
	const para = body
		.replace(/^##\s.+$/gm, '')
		.trim()
		.split(/\n\n+/)
		.find((p) => p.replace(/\s/g, '').length >= 40);
	if (para) return para.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
	return String(description || '').trim().slice(0, 400);
}

function loadPosts() {
	const files = fs.readdirSync(BLOG).filter((f) => f.endsWith('.mdx'));
	const posts = [];
	for (const file of files) {
		const slug = file.replace(/\.mdx$/, '');
		if (QUARANTINED.has(slug)) continue;
		const raw = fs.readFileSync(path.join(BLOG, file), 'utf8');
		let parsed;
		try {
			parsed = matter(raw);
		} catch (err) {
			logStep('parse-fail', { file, err: String(err) });
			continue;
		}
		const title = parsed.data?.title;
		if (!title) {
			logStep('skip-no-title', { file });
			continue;
		}
		const description = parsed.data?.description || parsed.data?.metaDescription || '';
		const lead = extractLead(parsed.content || '', description);
		const pub = parsed.data?.pubDate ? new Date(parsed.data.pubDate) : null;
		posts.push({
			slug,
			title: String(title).trim(),
			lead,
			pub: pub && !Number.isNaN(pub.getTime()) ? pub : new Date(0),
		});
	}
	posts.sort((a, b) => b.pub - a.pub || a.slug.localeCompare(b.slug));
	return posts;
}

function buildText(posts) {
	const lines = [
		'# גיא אבני עו״ד: תוכן מלא לאינדוקס AI',
		'',
		'> מאגר תוכן נקי של האתר לשימוש בכלי AI (לא מנגנון דירוג גוגל).',
		'> התוכן הוא למידע כללי בלבד ואינו מהווה ייעוץ משפטי אישי.',
		`> מקור: ${SITE}`,
		`> regenerated: ${new Date().toISOString().slice(0, 10)}`,
		'',
		'## דפים מרכזיים',
		'',
	];

	for (const hub of HUBS) {
		lines.push(`## ${hub.title}`, '', `URL: ${hub.url}`, '', hub.blurb, '', '---', '');
	}

	lines.push('## מאמרים', '');
	for (const post of posts) {
		const url = `${SITE}/blog/${post.slug}/`;
		lines.push(`## ${post.title}`, '', `URL: ${url}`, '', post.lead || post.title, '', '---', '');
	}

	lines.push(
		'## הערה',
		'',
		'לגילוי סוכן/MCP ראו גם public/llms.txt ו-public/agent-card.json. קבצים אלה אינם תחליף לאינדוקס HTML רגיל.',
		'',
	);
	return lines.join('\n');
}

function main() {
	try {
		const posts = loadPosts();
		const text = buildText(posts);
		fs.writeFileSync(OUT, text, 'utf8');
		logStep('wrote', { out: OUT, posts: posts.length, bytes: Buffer.byteLength(text, 'utf8') });
	} catch (err) {
		console.error('[regenerate-llms-full] FATAL', err);
		process.exit(1);
	}
}

main();

#!/usr/bin/env node
/**
 * Kit Phase 7 — publish reserch-based-articles draft → src/content/blog (site flat frontmatter).
 *
 * Canonical publish path (no batch bypass, no raw copy). Flow:
 *   1. Gate P pre-check: node .content-kit/validators/check-publish.mjs --pre-publish
 *   2. Images in target MDX (≥3): node scripts/assign-article-images.mjs …
 *   3. Publish: node scripts/publish-draft-to-content.mjs [NNNN …]
 *
 * Maps nested seo: → flat Zod fields. Strips brand prefix/suffix from seo.title for on-page title/H1;
 * metaTitle = `{brand} | {subject} | ישראל`. Validates via check-article; strips FAQ + leading H1 from body.
 *
 * Usage:
 *   node scripts/publish-draft-to-content.mjs              # all manifest subjects
 *   node scripts/publish-draft-to-content.mjs 0006 0007    # specific NNNN ids
 *
 * Preserves images from existing content file (assign via scripts/assign-article-images.mjs first).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import matter from 'gray-matter';
import { loadManifest, loadProfile } from '../.content-kit/validators/lib/load-profile.mjs';
import { validateSeoFrontmatter } from '../.content-kit/validators/lib/parse-frontmatter.mjs';
import { splitArticle, parseH2Sections } from '../.content-kit/validators/lib/parse-article.mjs';
import { faqHeadings, escapeRegex, matchesHeading } from '../.content-kit/validators/lib/heading-aliases.mjs';

const ROOT = process.cwd();
const CHECK_ARTICLE = path.join(ROOT, '.content-kit/validators/check-article.mjs');
const MANIFEST_REL = 'subject-manifest.json';

function logStep(step, detail) {
	console.error(`[publish-draft:${step}]`, detail);
}

function fail(step, detail) {
	console.error(`[publish-draft:${step}] ERROR`, detail);
	process.exit(1);
}

function slugifyTag(value) {
	const s = String(value).trim().toLowerCase();
	if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) return s;
	return null;
}

function deriveTags(subject, seoKeywords) {
	if (Array.isArray(subject.tags) && subject.tags.length >= 3) {
		return subject.tags.slice(0, 6);
	}
	const fromKeywords = (seoKeywords ?? []).map(slugifyTag).filter(Boolean);
	const tags = [...new Set(fromKeywords)];
	if (tags.length >= 3) return tags.slice(0, 6);
	if (subject.category) tags.push(subject.category);
	return [...new Set(tags)].slice(0, 6);
}

function parseFaqFromSection(sectionText) {
	const items = [];
	for (const block of sectionText.split(/^### /m).filter(Boolean)) {
		const lines = block.trim().split('\n');
		const question = lines[0].replace(/^#+\s*/, '').trim();
		const answer = lines.slice(1).join('\n').trim().replace(/\n+/g, ' ');
		if (question.length >= 8 && answer.length >= 20) {
			items.push({ question, answer });
		}
	}
	return items.slice(0, 8);
}

function stripFaqSection(body, profile) {
	const aliases = faqHeadings(profile);
	const pattern = aliases.map((h) => escapeRegex(h)).join('|');
	const re = new RegExp(`\\n##\\s+(${pattern})[\\s\\S]*$`, 'im');
	return body.replace(re, '').trimEnd();
}

function stripLeadingH1(body) {
	return body.replace(/^#\s[^\n]+\n+/m, '').trimStart();
}

/** Brand pipe/colon variants — longest first. Brand belongs in metaTitle only, not display title. */
const BRAND_TITLE_VARIANTS = [
	'גיא אבני משרד עורכי דין',
	'גיא אבני עורך דין',
	'גיא אבני עו״ד',
	'גיא אבני עו"ד',
	'גיא אבני',
];

function escapeBrandRe(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Remove leading/trailing brand pipe or colon from draft seo.title. */
function stripBrandFromTitle(rawTitle, brand = 'גיא אבני') {
	let title = String(rawTitle ?? '').trim();
	if (!title) return title;

	for (const variant of BRAND_TITLE_VARIANTS) {
		const prefixPipe = new RegExp(`^${escapeBrandRe(variant)}\\s*\\|\\s*`, 'u');
		const prefixColon = new RegExp(`^${escapeBrandRe(variant)}\\s*:\\s*`, 'u');
		if (prefixPipe.test(title)) {
			const before = title;
			title = title.replace(prefixPipe, '').trim();
			logStep('strip-brand-prefix', { before, after: title });
			break;
		}
		if (prefixColon.test(title)) {
			const before = title;
			title = title.replace(prefixColon, '').trim();
			logStep('strip-brand-prefix-colon', { before, after: title });
			break;
		}
	}

	const escaped = escapeBrandRe(brand);
	const suffix = new RegExp(
		`\\s*\\|\\s*${escaped}(?:\\s+(?:עו[״"']ד|עורך\\s+דין|משרד\\s+עורכי\\s+דין))?\\s*$`,
		'u',
	);
	const stripped = title.replace(suffix, '').trim();
	if (stripped !== title) {
		logStep('strip-brand-suffix', { before: title, after: stripped });
		title = stripped;
	}

	return title || String(rawTitle ?? '').trim();
}

function loadExistingImages(contentPath) {
	if (!fs.existsSync(contentPath)) return null;
	try {
		const { data } = matter(fs.readFileSync(contentPath, 'utf8'));
		if (Array.isArray(data.images) && data.images.length >= 3) return data.images;
	} catch (err) {
		logStep('load-images', { contentPath, err: String(err) });
	}
	return null;
}

function runCheckArticle(draftPath, nnnn) {
	logStep('validate', { draftPath, nnnn });
	const r = spawnSync(
		process.execPath,
		[CHECK_ARTICLE, draftPath, '--manifest', MANIFEST_REL, '--subject-nnnn', nnnn],
		{ cwd: ROOT, encoding: 'utf8' },
	);
	if (r.stdout) process.stdout.write(r.stdout);
	if (r.stderr) process.stderr.write(r.stderr);
	if (r.status !== 0) {
		fail('validate', `check-article failed for ${nnnn} (exit ${r.status})`);
	}
}

function mapDraftToSiteFrontmatter({ seo, subject, faq, images, profile }) {
	const pubDate = subject.date || seo.dateModified;
	const tags = deriveTags(subject, seo.keywords);
	if (tags.length < 3) {
		fail('map', {
			nnnn: subject.nnnn,
			message: 'need ≥3 tags — add subject.tags in manifest or slug-like seo.keywords',
		});
	}
	const displayTitle = stripBrandFromTitle(seo.title, profile.brand);
	return {
		title: displayTitle,
		description: seo.description,
		metaTitle: `${profile.brand} | ${subject.subject} | ישראל`,
		metaDescription: seo.description,
		mainKeyword: subject.mainKeyword || profile.brand,
		secondaryKeywords: (seo.keywords ?? []).slice(0, 6),
		pubDate,
		category: subject.category,
		updatedDate: seo.dateModified || pubDate,
		materialChange: true,
		tags,
		faq,
		internalLinks: subject.internalLinkManifest,
		images,
	};
}

function publishSubject(subject, profile) {
	const draftPath = path.join(ROOT, profile.articleDraftDir, `${subject.nnnn}_${subject.label}.md`);
	if (!fs.existsSync(draftPath)) {
		fail('read', `draft missing: ${draftPath}`);
	}

	runCheckArticle(draftPath, subject.nnnn);

	const raw = fs.readFileSync(draftPath, 'utf8');
	const { yaml, body, error } = splitArticle(raw);
	if (error) fail('parse', error);

	const { seo, errors: fmErrors } = validateSeoFrontmatter(yaml, profile);
	if (fmErrors.length) fail('frontmatter', fmErrors);

	const sections = parseH2Sections(body);
	const faqAliases = faqHeadings(profile);
	const faqSection = sections.find((s) => matchesHeading(s.heading, faqAliases));
	if (!faqSection) fail('faq', `no FAQ section for ${subject.nnnn}`);

	const faq = parseFaqFromSection(faqSection.text);
	if (faq.length < 5) fail('faq', `FAQ count ${faq.length} < 5 for ${subject.nnnn}`);

	const outPath = path.join(ROOT, profile.contentRoot, subject.contentFile);
	const images = loadExistingImages(outPath);
	if (!images) {
		fail('images', {
			nnnn: subject.nnnn,
			outPath,
			message: 'need ≥3 images in existing content file — run image pipeline first',
		});
	}

	const publishBody = stripLeadingH1(stripFaqSection(body, profile));
	const frontmatter = mapDraftToSiteFrontmatter({ seo, subject, faq, images, profile });

	fs.mkdirSync(path.dirname(outPath), { recursive: true });
	fs.writeFileSync(outPath, matter.stringify(`\n${publishBody}\n`, frontmatter), 'utf8');
	logStep('write', { outPath, faq: faq.length, chars: publishBody.length });
}

function main() {
	let profile;
	let manifest;
	try {
		({ profile } = loadProfile(ROOT));
		({ data: manifest } = loadManifest(ROOT, null, profile));
	} catch (err) {
		fail('init', String(err));
	}

	if (!manifest?.subjects?.length) fail('init', 'subject-manifest.json has no subjects');

	const requested = process.argv.slice(2);
	const nnnns = requested.length ? requested : manifest.subjects.map((s) => s.nnnn);
	const subjects = manifest.subjects.filter((s) => nnnns.includes(s.nnnn));

	if (!subjects.length) fail('args', `no manifest subjects for nnnn: ${nnnns.join(', ')}`);

	for (const subject of subjects) {
		publishSubject(subject, profile);
	}
}

main();

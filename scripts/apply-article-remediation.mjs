import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { ARTICLE_SPECS, ALL_SLUGS } from './lib/article-specs.mjs';
import {
	extractParagraphInternalHrefs,
	fitMetaDescription,
	fitMetaTitle,
	logRemediation,
	normalizeBodyHrefs,
	remediateComprehensiveGuideBody,
	serializeFrontmatter,
	stripForbiddenTitle,
} from './lib/article-body-kit.mjs';
import { runArticleContentChecks } from './lib/check-article-content.mjs';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blog');
const BATCH_UPDATED_DATE = '2026-05-05';

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function buildFrontmatterData(existing, spec) {
	const data = {
		title: stripForbiddenTitle(spec.title),
		description: spec.description.trim(),
		metaTitle: fitMetaTitle(spec.metaTitle),
		metaDescription: fitMetaDescription(spec.metaDescription),
		mainKeyword: spec.mainKeyword,
		pubDate: existing.pubDate
			? typeof existing.pubDate === 'string'
				? existing.pubDate
				: existing.pubDate.toISOString().slice(0, 10)
			: '2026-01-01',
		category: spec.category,
		tags: spec.tags,
		internalLinks: [],
	};
	if (existing.updatedDate) {
		const d = String(existing.updatedDate).slice(0, 10);
		if (d !== BATCH_UPDATED_DATE) {
			data.updatedDate = d;
		}
	}
	return data;
}

function writeMdx(slug, data, body, imagesSection) {
	const fm = serializeFrontmatter(data, imagesSection);
	const outPath = path.join(BLOG_DIR, `${slug}.mdx`);
	fs.writeFileSync(outPath, `${fm}\n\n${body}`, 'utf8');
}

function remediateSlug(slug) {
	const spec = ARTICLE_SPECS[slug];
	if (!spec) {
		logRemediation('ERROR', `missing ARTICLE_SPECS for ${slug}`);
		return false;
	}
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	let raw;
	try {
		raw = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		logRemediation('ERROR', `read failed ${slug}`, err.message);
		return false;
	}
	const imagesSection = extractImagesSection(raw);
	if (!imagesSection) {
		logRemediation('ERROR', `images block missing ${slug}`);
		return false;
	}
	const parsed = matter(raw);
	const data = buildFrontmatterData(parsed.data, spec);
	let body;
	try {
		if (spec.preserveBody) {
			body = remediateComprehensiveGuideBody(parsed.content, spec);
		} else {
			body = spec.buildBody();
		}
		body = normalizeBodyHrefs(body);
		data.internalLinks = extractParagraphInternalHrefs(body);
		if (data.internalLinks.length < 10) {
			logRemediation('ERROR', `${slug} internalLinks ${data.internalLinks.length} below 10`);
			return false;
		}
		writeMdx(slug, data, body, imagesSection);
		logRemediation('step', `wrote ${slug}`);
		return true;
	} catch (err) {
		logRemediation('ERROR', `build/write failed ${slug}`, err.message);
		return false;
	}
}

function main() {
	logRemediation('step', 'starting remediation for all blog MDX');
	const filesOnDisk = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
	const slugsOnDisk = filesOnDisk.map((f) => f.replace(/\.mdx$/, ''));
	if (slugsOnDisk.length !== 25) {
		logRemediation('ERROR', `expected 25 MDX files, found ${slugsOnDisk.length}`);
	}
	let written = 0;
	let failed = 0;
	for (const slug of ALL_SLUGS) {
		if (!slugsOnDisk.includes(slug)) {
			logRemediation('ERROR', `slug missing on disk ${slug}`);
			failed += 1;
			continue;
		}
		if (remediateSlug(slug)) written += 1;
		else failed += 1;
	}
	logRemediation('step', `files written ${written}/${ALL_SLUGS.length}, failed ${failed}`);
	const audit = runArticleContentChecks();
	if (!audit.ok) {
		logRemediation('step', `content:audit failures ${audit.errors.length}`);
		for (const err of audit.errors) {
			logRemediation('ERROR', err);
		}
		process.exit(1);
	}
	logRemediation('step', 'content:audit passed (0 errors)');
	console.log(
		JSON.stringify({
			written,
			failed,
			auditErrors: audit.errors.length,
			total: ALL_SLUGS.length,
		}),
	);
}

main();

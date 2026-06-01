import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { KEYWORD_STUB_SLUGS } from './lib/keyword-stub-slugs.mjs';
import { serializeFrontmatter } from './lib/article-body-kit.mjs';

const ROOT = path.join(process.cwd());
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const BLOG_IMG_DIR = path.join(ROOT, 'public/images/blog');
const SITE_URL = 'https://avniguy.co.il';

const MAIN_KEYWORD_EN_SLUG = {
	'גיא אבני': 'guy-avni',
	'גיא אבני עו״ד': 'guy-avni-more',
	'גיא אבני עורך דין': 'guy-avni-lawyer',
	'גיא אבני משרד עורכי דין': 'guy-avni-law-firm',
	'אבני גיא': 'avni-guy',
	'אבני גיא עו״ד': 'avni-guy-more',
};

const TEMPLATE_JPGS = [
	'guy-avni-apartment-buyer-required-documents-main-guy-avni-lawyer-category-real-estate-tags-buyer-documents-real-estate-img-1-photo-1.jpg',
	'guy-avni-apartment-buyer-required-documents-main-guy-avni-lawyer-category-real-estate-tags-buyer-documents-real-estate-img-2-photo-2.jpg',
	'guy-avni-apartment-buyer-required-documents-main-guy-avni-lawyer-category-real-estate-tags-buyer-documents-real-estate-img-3-photo-3.jpg',
];

function logStep(msg, extra) {
	if (extra !== undefined) console.error(`[seed-keyword-stub-images] ${msg}`, extra);
	else console.error(`[seed-keyword-stub-images] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[seed-keyword-stub-images] ERROR ${msg}`, extra ?? '');
}

function sanitizeStem(s) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9.-]+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

function buildBlogFilename(slug, mainKeyword, category, tags, idx) {
	const kwSlug = MAIN_KEYWORD_EN_SLUG[mainKeyword];
	const sortedTags = [...tags].map((t) => t.toLowerCase()).sort();
	const tagPart = sortedTags.join('-');
	let stem = `${slug}-main-${kwSlug}-category-${category}-tags-${tagPart}-img-${idx}-photo-${idx}`;
	stem = sanitizeStem(stem);
	const max = 200;
	if (stem.length > max) {
		const shortTags = sortedTags.map((t) => (t.length > 12 ? t.slice(0, 12) : t)).join('-');
		stem = sanitizeStem(`${slug}-main-${kwSlug}-category-${category}-tags-${shortTags}-img-${idx}-photo-${idx}`);
	}
	if (stem.length > max) {
		const h = crypto.createHash('sha1').update(sortedTags.join(',')).digest('hex').slice(0, 10);
		stem = sanitizeStem(`${slug}-main-${kwSlug}-category-${category}-tags-${h}-img-${idx}-photo-${idx}`);
	}
	return `${stem}.jpg`;
}

function requiredTokens(mainKeyword, category, tags, idx) {
	const kw = MAIN_KEYWORD_EN_SLUG[mainKeyword];
	return [kw, category.toLowerCase(), ...tags.map((t) => t.toLowerCase()), `img-${idx}`, `photo-${idx}`];
}

function buildImagesSection(slug, mainKeyword, category, tags) {
	const blocks = [1, 2, 3].map((idx) => {
		const filename = buildBlogFilename(slug, mainKeyword, category, tags, idx);
		const tokens = requiredTokens(mainKeyword, category, tags, idx);
		const tokenStr = tokens.join(' ');
		const src = `${SITE_URL}/images/blog/${filename}`;
		const alt = `תצלום משפטי ${idx} - ${tokenStr} - Avni Guy legal content`;
		const title = `${tokenStr.replace(/\s+/g, ' ')} | legal image ${idx} | ${slug}`;
		const description = `Description ${idx} (EN keywords): ${tokens.join('; ')}. Legal stock photo for blog article ${slug}.`;
		const esc = (s) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
		return `  - src: "${src}"
    alt: "${esc(alt)}"
    title: "${esc(title)}"
    description: "${esc(description)}"
    source: "https://unsplash.com/license"`;
	});
	return `images:\n${blocks.join('\n')}`;
}

function extractImagesSection(raw) {
	const m = raw.match(/^images:\n[\s\S]*?(?=\n---)/m);
	return m ? m[0].replace(/\s+$/, '') : '';
}

function seedSlug(slug) {
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
	const raw = fs.readFileSync(filePath, 'utf8');
	const parsed = matter(raw);
	const { mainKeyword, category, tags } = parsed.data;
	if (!mainKeyword || !category || !Array.isArray(tags)) {
		logErr('missing frontmatter fields', { slug });
		return false;
	}
	for (let i = 0; i < 3; i++) {
		const template = path.join(BLOG_IMG_DIR, TEMPLATE_JPGS[i]);
		const targetName = buildBlogFilename(slug, mainKeyword, category, tags, i + 1);
		const target = path.join(BLOG_IMG_DIR, targetName);
		if (!fs.existsSync(template)) {
			logErr('template missing', { template });
			return false;
		}
		try {
			fs.copyFileSync(template, target);
		} catch (err) {
			logErr('copy failed', { slug, target, message: err.message });
			return false;
		}
	}
	const imagesSection = buildImagesSection(slug, mainKeyword, category, tags);
	const fm = serializeFrontmatter(parsed.data, imagesSection);
	fs.writeFileSync(filePath, `${fm}\n\n${parsed.content.trimEnd()}\n`, 'utf8');
	logStep('seeded', { slug });
	return true;
}

function main() {
	logStep('step 0: start', { count: KEYWORD_STUB_SLUGS.length });
	let ok = 0;
	for (const slug of KEYWORD_STUB_SLUGS) {
		if (seedSlug(slug)) ok += 1;
	}
	logStep('done', { ok, total: KEYWORD_STUB_SLUGS.length });
	if (ok !== KEYWORD_STUB_SLUGS.length) process.exit(1);
}

main();

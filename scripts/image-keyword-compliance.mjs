/**
 * Verifies and applies SSOT image keyword rules. Run: node scripts/image-keyword-compliance.mjs
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SITE_URL = 'https://avniguy.co.il';
const BLOG_IMG_DIR = path.join(ROOT, 'public', 'images', 'blog');
const SHARED_IMG_DIR = path.join(ROOT, 'public', 'images', 'shared');
const BRAND_DIR = path.join(ROOT, 'public', 'images', 'branding');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');

const MAIN_KEYWORD_EN_SLUG = {
	'גיא אבני': 'guy-avni',
	'גיא אבני עו״ד': 'guy-avni-more',
	'גיא אבני עורך דין': 'guy-avni-lawyer',
	'גיא אבני משרד עורכי דין': 'guy-avni-law-firm',
	'אבני גיא': 'avni-guy',
	'אבני גיא עו״ד': 'avni-guy-more',
};

const BRANDING_TOKENS = ['guy-avni', 'avni-guy', 'law-firm', 'lawyer'];
const BRAND_LOGO = 'guy-avni-avni-guy-law-firm-lawyer-brand-logo.svg';
const BRAND_FAVICON = 'guy-avni-avni-guy-law-firm-lawyer-brand-favicon.svg';
const BRAND_OG = 'guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg';

function logErr(step, err, extra) {
	console.error(`[image-keyword-compliance] ${step} failed`, err, extra ?? '');
}

function requiredTokens(mainKeyword, category, tags, idx) {
	const kw = MAIN_KEYWORD_EN_SLUG[mainKeyword];
	if (!kw) {
		logErr('requiredTokens', new Error('unknown mainKeyword'), { mainKeyword });
		process.exit(1);
	}
	return [kw, category.toLowerCase(), ...tags.map((t) => t.toLowerCase()), `img-${idx}`, `photo-${idx}`];
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

function splitFrontmatter(raw) {
	const parts = raw.split(/\n---\n/);
	if (parts.length < 2) return null;
	let head = parts[0];
	if (head.startsWith('---\n')) head = head.slice(4);
	const body = parts.slice(1).join('\n---\n');
	return { head, body };
}

function parseScalar(fm, key) {
	const re = new RegExp(`^${key}:\\s*"(.*)"\\s*$`, 'm');
	const m = fm.match(re);
	return m ? m[1] : null;
}

function parseTags(fm) {
	const m = fm.match(/^tags:\s*\[(.*?)\]\s*$/m);
	if (!m) return null;
	return m[1]
		.split(',')
		.map((t) => t.trim().replace(/^"|"$/g, ''))
		.filter(Boolean);
}

function parseImageSrcs(fm) {
	return [...fm.matchAll(/^  - src:\s*"(https:\/\/[^"]+)"\s*$/gm)].map((x) => x[1]);
}

function extractQuotedField(block, field) {
	const re = new RegExp(`^    ${field}:\\s*"((?:\\\\.|[^"\\\\])*)"\s*$`, 'm');
	const m = block.match(re);
	return m ? m[1].replace(/\\"/g, '"') : null;
}

function basenameFromUrl(u) {
	try {
		return path.basename(new URL(u).pathname);
	} catch (e) {
		logErr('basenameFromUrl', e, { u });
		return null;
	}
}

function textHasAllTokens(text, tokens) {
	if (!text) return false;
	const low = text.toLowerCase();
	for (const t of tokens) {
		if (!low.includes(t.toLowerCase())) return false;
	}
	return true;
}

function filenameHasAllTokens(fileBase, tokens) {
	const low = fileBase.toLowerCase().replace(/\.(jpg|jpeg|png|webp|svg)$/i, '');
	for (const t of tokens) {
		if (!low.includes(t.toLowerCase())) return false;
	}
	return true;
}

function extractImageBlocks(fm) {
	const re =
		/  - src:\s*"https:\/\/[^"]+"\s*\n    alt:\s*"[^"]*"\s*\n    title:\s*"[^"]*"\s*\n    description:\s*"[^"]*"\s*\n    source:\s*"[^"]*"/g;
	return fm.match(re) ?? [];
}

function buildImageCopyYaml(slug, mainKeyword, category, tags, idx, filename) {
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
}

function verifyBlogPost(fm, slug) {
	const issues = [];
	const mainKeyword = parseScalar(fm, 'mainKeyword');
	const category = parseScalar(fm, 'category');
	const tags = parseTags(fm);
	if (!mainKeyword || !category || !tags) {
		issues.push(`${slug}: missing mainKeyword/category/tags`);
		return issues;
	}
	const blocks = extractImageBlocks(fm);
	if (blocks.length !== 3) issues.push(`${slug}: expected 3 image blocks, got ${blocks.length}`);
	for (let i = 0; i < Math.min(3, blocks.length); i++) {
		const idx = i + 1;
		const block = blocks[i];
		const srcM = block.match(/  - src:\s*"(https:\/\/[^"]+)"/);
		const src = srcM ? srcM[1] : null;
		const alt = extractQuotedField(block, 'alt');
		const title = extractQuotedField(block, 'title');
		const description = extractQuotedField(block, 'description');
		const fname = src ? basenameFromUrl(src) : null;
		const toks = requiredTokens(mainKeyword, category, tags, idx);
		if (!fname) issues.push(`${slug}: image ${idx} missing src`);
		else if (!filenameHasAllTokens(fname, toks)) issues.push(`${slug}: filename missing EN tokens: ${fname}`);
		for (const [label, val] of [
			['alt', alt],
			['title', title],
			['description', description],
		]) {
			if (!val) issues.push(`${slug}: missing ${label} on image ${idx}`);
			else if (!textHasAllTokens(val, toks)) issues.push(`${slug}: ${label} missing EN tokens on image ${idx}`);
		}
	}
	return issues;
}

function verifyBranding() {
	const issues = [];
	for (const [label, fname] of [
		['logo', BRAND_LOGO],
		['favicon', BRAND_FAVICON],
		['og', BRAND_OG],
	]) {
		for (const t of BRANDING_TOKENS) {
			if (!fname.toLowerCase().includes(t)) issues.push(`branding ${label}: filename missing "${t}"`);
		}
		const disk =
			label === 'og' ? path.join(SHARED_IMG_DIR, fname) : path.join(BRAND_DIR, fname);
		if (!fs.existsSync(disk)) issues.push(`branding ${label}: missing file ${disk}`);
	}
	return issues;
}

function verifyAll() {
	const issues = [];
	for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx')).sort()) {
		const slug = file.replace(/\.mdx$/, '');
		const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
		const sp = splitFrontmatter(raw);
		if (!sp) {
			issues.push(`${slug}: bad frontmatter`);
			continue;
		}
		issues.push(...verifyBlogPost(sp.head, slug));
	}
	issues.push(...verifyBranding());
	return issues;
}

function applyBlogImages() {
	for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx')).sort()) {
		const slug = file.replace(/\.mdx$/, '');
		const fp = path.join(BLOG_DIR, file);
		const raw = fs.readFileSync(fp, 'utf8');
		const sp = splitFrontmatter(raw);
		if (!sp) {
			logErr('applyBlogImages', new Error('bad frontmatter'), { file });
			process.exit(1);
		}
		const fm = sp.head;
		const mainKeyword = parseScalar(fm, 'mainKeyword');
		const category = parseScalar(fm, 'category');
		const tags = parseTags(fm);
		if (!mainKeyword || !category || !tags) {
			logErr('applyBlogImages', new Error('missing fields'), { file });
			process.exit(1);
		}
		const srcs = parseImageSrcs(fm);
		if (srcs.length !== 3) {
			logErr('applyBlogImages', new Error('need 3 src lines'), { file, n: srcs.length });
			process.exit(1);
		}
		for (let i = 0; i < 3; i++) {
			const idx = i + 1;
			const expectedName = buildBlogFilename(slug, mainKeyword, category, tags, idx);
			const expectedPath = path.join(BLOG_IMG_DIR, expectedName);
			const oldName = basenameFromUrl(srcs[i]);
			const oldPath = path.join(BLOG_IMG_DIR, oldName);
			if (!fs.existsSync(oldPath)) {
				logErr('applyBlogImages', new Error('missing source file'), { oldPath, file });
				process.exit(1);
			}
			if (oldName !== expectedName) {
				try {
					if (fs.existsSync(expectedPath)) fs.unlinkSync(expectedPath);
					fs.renameSync(oldPath, expectedPath);
				} catch (e) {
					logErr('applyBlogImages rename', e, { oldPath, expectedPath });
					process.exit(1);
				}
			}
		}
		const yamlBlocks = [1, 2, 3].map((idx) => {
			const expectedName = buildBlogFilename(slug, mainKeyword, category, tags, idx);
			return buildImageCopyYaml(slug, mainKeyword, category, tags, idx, expectedName);
		});
		const newImagesYaml = `images:\n${yamlBlocks.join('\n')}`;
		const imgIdx = fm.indexOf('images:');
		if (imgIdx === -1) {
			logErr('applyBlogImages', new Error('no images:'), { file });
			process.exit(1);
		}
		const newHead = fm.slice(0, imgIdx) + newImagesYaml;
		const newRaw = `---\n${newHead}\n---\n${sp.body}`;
		fs.writeFileSync(fp, newRaw);
	}
}

function applyBranding() {
	fs.mkdirSync(BRAND_DIR, { recursive: true });
	fs.mkdirSync(SHARED_IMG_DIR, { recursive: true });
	const oldLogo = path.join(ROOT, 'public', 'logo.svg');
	const oldFav = path.join(ROOT, 'public', 'favicon.svg');
	const oldOg = path.join(SHARED_IMG_DIR, 'og-law-fallback.jpg');
	const newLogoPath = path.join(BRAND_DIR, BRAND_LOGO);
	const newFavPath = path.join(BRAND_DIR, BRAND_FAVICON);
	const newOgPath = path.join(SHARED_IMG_DIR, BRAND_OG);
	try {
		if (fs.existsSync(oldLogo)) {
			fs.copyFileSync(oldLogo, newLogoPath);
			fs.unlinkSync(oldLogo);
		}
		if (fs.existsSync(oldFav)) {
			fs.copyFileSync(oldFav, newFavPath);
			fs.unlinkSync(oldFav);
		}
		if (fs.existsSync(oldOg)) {
			if (fs.existsSync(newOgPath)) fs.unlinkSync(newOgPath);
			fs.renameSync(oldOg, newOgPath);
		}
		if (!fs.existsSync(newLogoPath) || !fs.existsSync(newFavPath) || !fs.existsSync(newOgPath)) {
			logErr('applyBranding', new Error('branding files incomplete'), {});
			process.exit(1);
		}
	} catch (e) {
		logErr('applyBranding', e, {});
		process.exit(1);
	}
}

function patchHeaderBaseHead() {
	const headerPath = path.join(ROOT, 'src', 'components', 'Header.astro');
	const basePath = path.join(ROOT, 'src', 'components', 'BaseHead.astro');
	if (!fs.existsSync(headerPath) || !fs.existsSync(basePath)) {
		console.error('[image-keyword-compliance] skip patchHeaderBaseHead (no Astro header/base files)');
		return;
	}
	let header = fs.readFileSync(headerPath, 'utf8');
	let base = fs.readFileSync(basePath, 'utf8');
	if (!header.includes('/images/branding/')) {
		header = header.replace(
			`<img
				src="/logo.svg"
				alt="לוגו גיא אבני"
				width="44"
				height="44"
				loading="eager"
				class="size-11 shrink-0 rounded-xl ring-1 ring-border/60 shadow-sm"
			/>`,
			`<figure class="m-0 contents">
				<img
					src="/images/branding/${BRAND_LOGO}"
					alt="Guy Avni Avni Guy law firm lawyer brand logo 1 - לוגו גיא אבני"
					title="Guy Avni Avni Guy law firm lawyer brand logo 1"
					width="44"
					height="44"
					loading="eager"
					class="size-11 shrink-0 rounded-xl ring-1 ring-border/60 shadow-sm"
				/>
				<figcaption class="sr-only">
					Description 1: guy-avni avni-guy law-firm lawyer brand logo for site header.
				</figcaption>
			</figure>`,
		);
	}
	if (!base.includes(BRAND_FAVICON)) {
		base = base.replace('href="/favicon.svg"', `href="/images/branding/${BRAND_FAVICON}"`);
	}
	if (!base.includes(BRAND_OG)) {
		base = base.replace(
			"const FALLBACK_OG_IMAGE = '/images/shared/og-law-fallback.jpg';",
			`const FALLBACK_OG_IMAGE = '/images/shared/${BRAND_OG}';`,
		);
	}
	fs.writeFileSync(headerPath, header);
	fs.writeFileSync(basePath, base);
}

function deleteOrphanBlogJpgs() {
	const allowed = new Set();
	for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
		const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
		const sp = splitFrontmatter(raw);
		if (!sp) continue;
		for (const u of parseImageSrcs(sp.head)) {
			const b = basenameFromUrl(u);
			if (b) allowed.add(b);
		}
	}
	for (const f of fs.readdirSync(BLOG_IMG_DIR)) {
		if (!f.endsWith('.jpg')) continue;
		if (!allowed.has(f)) {
			try {
				fs.unlinkSync(path.join(BLOG_IMG_DIR, f));
				console.error('[image-keyword-compliance] removed orphan', f);
			} catch (e) {
				logErr('deleteOrphan', e, { f });
			}
		}
	}
}

function main() {
	let round = 0;
	while (round < 8) {
		round++;
		try {
			applyBlogImages();
			applyBranding();
			patchHeaderBaseHead();
			deleteOrphanBlogJpgs();
		} catch (e) {
			logErr(`apply round ${round}`, e);
			process.exit(1);
		}
		const v = verifyAll();
		if (v.length === 0) {
			console.error(`[image-keyword-compliance] OK after ${round} round(s)`);
			return;
		}
		console.error(`[image-keyword-compliance] round ${round} violations:`, v);
	}
	console.error('[image-keyword-compliance] exceeded max rounds');
	process.exit(1);
}

main();

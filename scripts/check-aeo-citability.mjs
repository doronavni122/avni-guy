#!/usr/bin/env node
/**
 * Project AEO/GEO citability gate for published MDX (or draft paths).
 * Usage: node scripts/check-aeo-citability.mjs [file.mdx…]
 * No args → all src/content/blog/*.mdx (skips quarantined stubs listed inline soft-warn).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = path.join(ROOT, 'src/content/blog');

const PRIMARY_HOST =
	/\.(gov\.il|justice\.gov\.il|boi\.org\.il|israelbar\.org\.il|knesset\.gov\.il|court\.gov\.il)/i;
const TLDR_RE = /^##\s*(?:בקצרה|TL;DR)\b/m;
const FAQ_FM_RE = /^faq:\s*$/m;
const FAQ_H2_RE = /^##\s+שאלות נפוצות\b/m;
const NACHON_RE = /נכון\s*ל[־\-–]?\s*\S+/u;
const MEKOROT_RE = /מקורות/;
const BAR_UNSAFE = /שיעור\s*הצלחה|מומחה\s+מס['׳']?\s*1|מובטח\s+לנצח/u;

function logStep(step, detail) {
	console.error(`[check-aeo-citability:${step}]`, detail);
}

function fail(msg) {
	console.error(`[check-aeo-citability] FAIL: ${msg}`);
	process.exitCode = 1;
}

function pass(msg) {
	console.log(`[check-aeo-citability] OK: ${msg}`);
}

function splitMdx(raw) {
	if (!raw.startsWith('---')) return { front: '', body: raw };
	const end = raw.indexOf('\n---', 3);
	if (end < 0) return { front: '', body: raw };
	return { front: raw.slice(3, end), body: raw.slice(end + 4) };
}

function firstProseBlock(body) {
	const cleaned = body.replace(/^##\s.+$/gm, '\n').trim();
	const para = cleaned.split(/\n\n+/).find((p) => p.replace(/\s/g, '').length >= 40);
	return (para ?? '').replace(/\n/g, ' ').trim();
}

function checkFile(filePath) {
	const rel = path.relative(ROOT, filePath);
	let raw;
	try {
		raw = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		fail(`cannot read ${rel}: ${err.message}`);
		return;
	}
	const { front, body } = splitMdx(raw);
	const errors = [];

	if (!TLDR_RE.test(body)) {
		errors.push('missing TL;DR / בקצרה H2');
	}

	const lead = firstProseBlock(body);
	if (lead.length < 60) {
		errors.push('opening definition/lead too short (<60 chars of prose)');
	}

	const hasFaq = FAQ_FM_RE.test(front) || FAQ_H2_RE.test(body);
	if (!hasFaq) {
		errors.push('missing faq: frontmatter or ## שאלות נפוצות');
	}

	const hasPrimary = PRIMARY_HOST.test(body) || PRIMARY_HOST.test(front);
	if (!hasPrimary) {
		errors.push('no primary .gov.il / regulator / Bar host cite');
	}

	if (!MEKOROT_RE.test(body)) {
		errors.push('missing מקורות section/line');
	}

	const hasNumbers = /\d{1,3}(?:,\d{3})+|\d+\s*%|\d{4}/.test(body);
	if (hasNumbers && !NACHON_RE.test(body)) {
		errors.push('numeric/dated claims without נכון ל־ freshness marker');
	}

	if (BAR_UNSAFE.test(body) || BAR_UNSAFE.test(front)) {
		errors.push('Bar-unsafe success-rate / מומחה inflation phrasing');
	}

	if (errors.length) {
		for (const e of errors) fail(`${rel}: ${e}`);
		logStep('file-fail', { rel, count: errors.length });
	} else {
		pass(rel);
	}
}

function listDefaultFiles() {
	return fs
		.readdirSync(BLOG)
		.filter((f) => f.endsWith('.mdx'))
		.map((f) => path.join(BLOG, f));
}

const args = process.argv.slice(2);
const files = args.length
	? args.map((a) => path.resolve(ROOT, a))
	: listDefaultFiles();

if (!files.length) {
	fail('no files to check');
	process.exit(1);
}

logStep('start', { count: files.length });
for (const f of files) checkFile(f);
if (!process.exitCode) pass(`all ${files.length} file(s)`);

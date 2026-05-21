import fs from 'node:fs';
import path from 'node:path';

/** U+2014 em dash is banned in all user-facing and content source text. */
export const BANNED_EM_DASH = '\u2014';

const SCAN_ROOTS = ['src', 'public', 'scripts'];
const SCAN_ROOT_FILES = ['AGENTS.md', 'SSOT.md'];
const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.mdx', '.md', '.mjs', '.js', '.txt', '.json']);

const SKIP_PATH_SEGMENTS = new Set(['node_modules', '.next', 'dist', '.git']);

function logStep(message, details) {
	if (details !== undefined) {
		console.log(`[banned-chars] ${message}`, details);
		return;
	}
	console.log(`[banned-chars] ${message}`);
}

function shouldScanFile(filePath) {
	const ext = path.extname(filePath);
	if (!SCAN_EXTENSIONS.has(ext)) return false;
	if (filePath.endsWith('check-banned-characters.mjs')) return false;
	return true;
}

function walk(dir, files = []) {
	if (!fs.existsSync(dir)) return files;
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		if (SKIP_PATH_SEGMENTS.has(ent.name)) continue;
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) walk(full, files);
		else if (shouldScanFile(full)) files.push(full);
	}
	return files;
}

function linePreview(text, index) {
	const lineStart = text.lastIndexOf('\n', index) + 1;
	const lineEnd = text.indexOf('\n', index);
	const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
	return line.trim().slice(0, 120);
}

/**
 * @returns {{ ok: true } | { ok: false, violations: Array<{ file: string, line: number, preview: string }> }}
 */
export function findBannedEmDashViolations(cwd = process.cwd()) {
	const violations = [];
	for (const relFile of SCAN_ROOT_FILES) {
		const abs = path.join(cwd, relFile);
		if (!fs.existsSync(abs)) continue;
		const content = fs.readFileSync(abs, 'utf8');
		let index = content.indexOf(BANNED_EM_DASH);
		while (index !== -1) {
			const line = content.slice(0, index).split('\n').length;
			violations.push({ file: relFile, line, preview: linePreview(content, index) });
			index = content.indexOf(BANNED_EM_DASH, index + 1);
		}
	}
	for (const root of SCAN_ROOTS) {
		const absRoot = path.join(cwd, root);
		for (const file of walk(absRoot)) {
			const rel = path.relative(cwd, file);
			const content = fs.readFileSync(file, 'utf8');
			let index = content.indexOf(BANNED_EM_DASH);
			while (index !== -1) {
				const line = content.slice(0, index).split('\n').length;
				violations.push({ file: rel, line, preview: linePreview(content, index) });
				index = content.indexOf(BANNED_EM_DASH, index + 1);
			}
		}
	}
	if (violations.length > 0) {
		console.error('[banned-chars] findBannedEmDashViolations failed', { count: violations.length });
		return { ok: false, violations };
	}
	return { ok: true };
}

export function runBannedCharacterChecks(cwd = process.cwd()) {
	logStep('scanning for banned em dash (U+2014)');
	const result = findBannedEmDashViolations(cwd);
	if (!result.ok) {
		for (const v of result.violations.slice(0, 20)) {
			console.error(`[banned-chars] FAIL ${v.file}:${v.line} ${v.preview}`);
		}
		if (result.violations.length > 20) {
			console.error(`[banned-chars] ... and ${result.violations.length - 20} more`);
		}
		throw new Error(`Banned character U+2014 found in ${result.violations.length} place(s)`);
	}
	logStep('no banned em dash found');
}

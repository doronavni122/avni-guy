/**
 * Remediation program cap SSOT (committed config/remediation-program.json).
 */
import fs from 'node:fs';
import path from 'node:path';

export const PROGRAM_PATH = path.join(process.cwd(), 'config', 'remediation-program.json');

const DEFAULT_PROGRAM = {
	enabled: true,
	maxArticles: 20,
	batchSize: 5,
	completedSlugs: [],
	pausedReason: null,
};

function logErr(msg, extra) {
	console.error(`[remediation-program] ERROR ${msg}`, extra ?? '');
}

/**
 * @returns {{
 *   enabled: boolean,
 *   maxArticles: number,
 *   batchSize: number,
 *   completedSlugs: string[],
 *   pausedReason: string | null
 * }}
 */
export function loadProgram() {
	try {
		if (!fs.existsSync(PROGRAM_PATH)) {
			return { ...DEFAULT_PROGRAM };
		}
		const raw = JSON.parse(fs.readFileSync(PROGRAM_PATH, 'utf8'));
		const maxArticles = Number(raw.maxArticles);
		const batchSize = Number(raw.batchSize);
		if (!Number.isFinite(maxArticles) || maxArticles < 1) {
			throw new Error('maxArticles must be a positive number');
		}
		if (!Number.isFinite(batchSize) || batchSize < 1) {
			throw new Error('batchSize must be a positive number');
		}
		const completedSlugs = Array.isArray(raw.completedSlugs)
			? [...new Set(raw.completedSlugs.map((s) => String(s).trim()).filter(Boolean))]
			: [];
		return {
			enabled: raw.enabled !== false,
			maxArticles,
			batchSize,
			completedSlugs,
			pausedReason: raw.pausedReason ?? null,
		};
	} catch (err) {
		logErr('loadProgram failed', err.message);
		throw err;
	}
}

/**
 * @param {ReturnType<typeof loadProgram>} program
 */
export function saveProgram(program) {
	try {
		fs.mkdirSync(path.dirname(PROGRAM_PATH), { recursive: true });
		const payload = {
			enabled: program.enabled,
			maxArticles: program.maxArticles,
			batchSize: program.batchSize,
			completedSlugs: program.completedSlugs,
			pausedReason: program.pausedReason,
		};
		fs.writeFileSync(PROGRAM_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
	} catch (err) {
		logErr('saveProgram failed', err.message);
		throw err;
	}
}

export function remainingSlots(program = loadProgram()) {
	return Math.max(0, program.maxArticles - program.completedSlugs.length);
}

export function isProgramActive(program = loadProgram()) {
	if (!program.enabled) return false;
	if (program.pausedReason) return false;
	return program.completedSlugs.length < program.maxArticles;
}

export function effectiveBatchSize(requestedSize, program = loadProgram()) {
	const slots = remainingSlots(program);
	if (slots === 0) return 0;
	return Math.max(1, Math.min(requestedSize, program.batchSize, slots));
}

/**
 * @param {Array<{ slug: string }>} pending
 * @param {ReturnType<typeof loadProgram>} [program]
 */
export function filterPendingForProgram(pending, program = loadProgram()) {
	const done = new Set(program.completedSlugs);
	return pending.filter((p) => !done.has(p.slug));
}

/**
 * @param {string} slug
 */
export function markSlugCompleted(slug) {
	const program = loadProgram();
	if (program.completedSlugs.includes(slug)) {
		return { program, added: false };
	}
	program.completedSlugs.push(slug);
	saveProgram(program);
	return { program, added: true };
}

export function getProgramStatus(program = loadProgram()) {
	return {
		enabled: program.enabled,
		active: isProgramActive(program),
		maxArticles: program.maxArticles,
		completedCount: program.completedSlugs.length,
		remaining: remainingSlots(program),
		batchSize: program.batchSize,
		pausedReason: program.pausedReason,
		completedSlugs: program.completedSlugs,
	};
}

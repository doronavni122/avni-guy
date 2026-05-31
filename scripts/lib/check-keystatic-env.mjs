function logErr(message, extra) {
	console.error(`[check-keystatic-env] ERROR ${message}`, extra ?? '');
}

const GITHUB_REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

/**
 * @param {{ enforce?: boolean }} [options]
 * @returns {{ ok: boolean, errors: string[], warnings: string[] }}
 */
export function runKeystaticEnvChecks(options = {}) {
	const enforce = options.enforce === true;
	const kind = process.env.KEYSTATIC_STORAGE_KIND?.trim() ?? '';
	const errors = [];
	const warnings = [];

	if (!kind || kind === 'local') {
		return { ok: true, errors, warnings };
	}

	if (kind !== 'github') {
		const msg = `KEYSTATIC_STORAGE_KIND must be "local" or "github" (got "${kind}")`;
		if (enforce) errors.push(msg);
		else warnings.push(msg);
		return { ok: errors.length === 0, errors, warnings };
	}

	const repo = process.env.KEYSTATIC_GITHUB_REPO?.trim() ?? '';
	if (!repo) {
		errors.push('KEYSTATIC_GITHUB_REPO is required when KEYSTATIC_STORAGE_KIND=github');
	} else if (!GITHUB_REPO_RE.test(repo)) {
		errors.push(`KEYSTATIC_GITHUB_REPO must be owner/repo (got "${repo}")`);
	}

	if (enforce) {
		for (const key of ['KEYSTATIC_GITHUB_CLIENT_ID', 'KEYSTATIC_GITHUB_CLIENT_SECRET', 'KEYSTATIC_SECRET']) {
			if (!process.env[key]?.trim()) {
				errors.push(`${key} is required when KEYSTATIC_STORAGE_KIND=github in CI`);
			}
		}
	} else {
		for (const key of ['KEYSTATIC_GITHUB_CLIENT_ID', 'KEYSTATIC_GITHUB_CLIENT_SECRET', 'KEYSTATIC_SECRET']) {
			if (!process.env[key]?.trim()) {
				warnings.push(`${key} is unset (required for Keystatic GitHub auth on Vercel)`);
			}
		}
	}

	if (warnings.length) {
		for (const w of warnings) console.warn(`[check-keystatic-env] WARN: ${w}`);
	}
	if (errors.length) {
		for (const e of errors) logErr(e);
	}

	return { ok: errors.length === 0, errors, warnings };
}

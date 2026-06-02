#!/usr/bin/env node
/**
 * Full internal links audit - 61 rules with PASS/FAIL/MANUAL output (Scope 10).
 * Run: pnpm run links:audit:full
 * Env: LINKS_AUDIT_ENFORCE=1, CONTENT_LINKS_STRICT=1, CONTENT_STRICT=1 (affects rule strictness)
 */
import { runInternalLinksFullAudit, INTERNAL_LINKS_RULE_COUNT } from './lib/internal-links-rules-registry.mjs';

function logStep(msg, extra) {
	if (extra !== undefined) console.error(`[links:audit:full] ${msg}`, extra);
	else console.error(`[links:audit:full] ${msg}`);
}

function main() {
	logStep('starting 61-rule internal links audit');
	const slugFilter = process.env.CONTENT_AUDIT_SLUGS?.split(',').map((s) => s.trim()).filter(Boolean);
	const audit = runInternalLinksFullAudit(slugFilter?.length ? { slugFilter } : {});

	console.log('\n=== INTERNAL LINKS FULL AUDIT ===');
	console.log(`Rules: ${INTERNAL_LINKS_RULE_COUNT} | Articles: ${audit.ctx.articleCount} | Inbound mode: ${audit.ctx.inboundMode}`);
	console.log(`PASS: ${audit.summary.pass} | FAIL: ${audit.summary.fail} | MANUAL: ${audit.summary.manual}`);

	const byCategory = new Map();
	for (const r of audit.results) {
		if (!byCategory.has(r.category)) byCategory.set(r.category, { pass: 0, fail: 0, manual: 0 });
		const bucket = byCategory.get(r.category);
		bucket[r.status.toLowerCase()] += 1;
	}
	console.log('\nBy category:');
	for (const [cat, counts] of [...byCategory.entries()].sort()) {
		console.log(`  ${cat}: PASS=${counts.pass} FAIL=${counts.fail} MANUAL=${counts.manual}`);
	}

	console.log('\n--- FAIL ---');
	for (const r of audit.results.filter((x) => x.status === 'FAIL')) {
		console.log(`${r.id} FAIL ${r.reason}`);
		if (r.sample) console.log(`  sample: ${JSON.stringify(r.sample).slice(0, 200)}`);
	}

	console.log('\n--- MANUAL ---');
	for (const r of audit.results.filter((x) => x.status === 'MANUAL')) {
		console.log(`${r.id} MANUAL ${r.reason}`);
	}

	if (process.env.LINKS_AUDIT_FULL_ENFORCE === '1' && audit.summary.fail > 0) {
		logStep('FAILED', audit.summary);
		process.exit(1);
	}

	logStep(audit.summary.fail ? 'completed with FAIL rules' : 'PASSED', audit.summary);
	process.exit(audit.summary.fail > 0 && process.env.LINKS_AUDIT_FULL_ENFORCE === '1' ? 1 : 0);
}

main();

#!/usr/bin/env node
/**
 * PR body for auto/remediation scaffold batches (avoids YAML << heredoc in GHA).
 * Log: [emit-remediation-pr-body]
 */
import fs from 'node:fs';

function logErr(msg, extra) {
	console.error(`[emit-remediation-pr-body] ERROR ${msg}`, extra ?? '');
}

let slugs = process.env.PIPELINE_SLUGS?.trim() ?? '';
const completed = process.env.REMEDIATION_COMPLETED?.trim() ?? '?';
const max = process.env.REMEDIATION_MAX?.trim() ?? '?';

if (!slugs) {
	try {
		const q = JSON.parse(fs.readFileSync('config/remediation-batch.json', 'utf8'));
		slugs = String(q.pipelineSlugs ?? q.batchSlugs?.join(',') ?? '').trim();
	} catch (err) {
		logErr('read remediation-batch.json', err.message);
		slugs = '(pending batch)';
	}
}

const body = `## Automated Pass 1 batch (scaffold)

Research scaffolds under \`content-research/\`. Program progress: **${completed}/${max}** completed.

\`PIPELINE_SLUGS=${slugs}\`

\`config/remediation-batch.json\` lists batch slugs. Cursor Automation should run Pass 1 and merge when audits pass.

### Pass 1 (Cursor Automation / agent)
Requires \`EXA_API_KEY\` in **Cursor Automation environment** (same value as GitHub secret \`EXA_API_KEY\` / Vercel; not synced automatically).

Per slug:
1. \`pnpm run article:pipeline -- <slug> --force-research\`
2. \`CONTENT_AUDIT_SLUGS=<slug> CONTENT_STRICT=1 PIPELINE_CONTRACT=1 pnpm run content:audit\`
3. \`LINKS_AUDIT_SLUGS=<slug> LINKS_AUDIT_ENFORCE=1 PIPELINE_CONTRACT=1 pnpm run links:audit\`
4. \`pnpm run research:audit -- <slug>\`

After batch: \`node scripts/run-article-remediation.mjs --verify\` with \`PIPELINE_SLUGS\` set; update \`config/remediation-program.json\` \`completedSlugs\`; merge when all pass.

Studies stay in \`content-research/\`; do not delete unless \`RESEARCH_ALLOW_DELETE=1\`.
`;

process.stdout.write(body);

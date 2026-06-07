#!/usr/bin/env node
/**
 * Fail fast when EXA_API_KEY is missing (GHA / automation preflight).
 * Log: [check-exa-api-key]
 */
function logErr(msg) {
	console.error(`[check-exa-api-key] ERROR ${msg}`);
}

const key = process.env.EXA_API_KEY?.trim();
if (!key) {
	logErr('EXA_API_KEY missing (set GitHub secret or Cursor Automation env)');
	process.exit(1);
}
console.error(`[check-exa-api-key] ok (configured, len=${key.length})`);

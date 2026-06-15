#!/usr/bin/env node
/**
 * CI guard: block obvious auth-token logging in server code (not tests).
 * Run from repo root: node scripts/tools/check-sensitive-log-patterns.js
 */
const { execSync } = require('child_process');

const patterns = [
  { name: 'log.*Bearer in call', rg: String.raw`log\.(info|warn|error)\([^)]*\bBearer\b` },
  { name: 'console.*Bearer in call', rg: String.raw`console\.(log|info|warn|error|debug)\([^)]*\bBearer\b` },
];

let failed = false;
for (const { name, rg } of patterns) {
  try {
    execSync(
      `rg -n --glob '*.ts' --glob '*.tsx' --glob '!**/*.test.ts' --glob '!**/*.spec.ts' '${rg}' src`,
      { stdio: 'inherit', cwd: require('path').join(__dirname, '../..') }
    );
    console.error(`check-sensitive-log-patterns: matched forbidden pattern (${name})`);
    failed = true;
  } catch (e) {
    const code = e.status;
    if (code === 1) continue;
    if (code === 127) {
      console.error('check-sensitive-log-patterns: ripgrep (rg) not found; install rg or skip in CI.');
      process.exit(0);
    }
    process.exit(code ?? 1);
  }
}

if (failed) process.exit(1);
console.log('check-sensitive-log-patterns: OK');

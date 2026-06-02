#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const sourceDir = path.join(repoRoot, 'scripts', 'git-hooks');
const targetDir = path.join(repoRoot, '.git', 'hooks');

function ensureExists(p, label) {
  if (!fs.existsSync(p)) {
    process.stderr.write(`install-git-hooks: missing ${label} at ${p}\n`);
    process.exit(1);
  }
}

ensureExists(sourceDir, 'source hooks dir');
ensureExists(targetDir, 'git hooks dir');

for (const hookName of ['pre-commit', 'commit-msg']) {
  const src = path.join(sourceDir, hookName);
  const dst = path.join(targetDir, hookName);
  ensureExists(src, `hook template ${hookName}`);
  fs.copyFileSync(src, dst);
  fs.chmodSync(dst, 0o755);
  process.stdout.write(`install-git-hooks: installed ${hookName}\n`);
}

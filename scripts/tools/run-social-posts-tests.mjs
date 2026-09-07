#!/usr/bin/env node
/**
 * Node 24 `node --test <dir>` treats the directory as a file (MODULE_NOT_FOUND).
 * Collect *.test.mjs and pass explicit paths.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const start = path.join(root, 'scripts/social-posts');

function collect(dir) {
	const out = [];
	try {
		for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
			const p = path.join(dir, ent.name);
			if (ent.isDirectory()) out.push(...collect(p));
			else if (ent.name.endsWith('.test.mjs')) out.push(p);
		}
	} catch (err) {
		console.error('[run-social-posts-tests]', { dir, err: String(err) });
	}
	return out;
}

const files = collect(start);
if (!files.length) {
	console.error('[run-social-posts-tests] no *.test.mjs under scripts/social-posts');
	process.exit(1);
}

const r = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit', cwd: root });
process.exit(r.status === null ? 1 : r.status);

#!/usr/bin/env node
/**
 * Fixes generic source link anchors in blog MDX (e.g. "| לשכה", slug-as-anchor).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog');

const DOMAIN_LABELS = [
	[/israelbar\.org\.il/i, 'לשכת עורכי הדין'],
	[/justice\.gov\.il/i, 'משרד המשפטים'],
	[/gov\.il\/he\/departments\/israel_tax_authority/i, 'רשות המיסים'],
	[/gov\.il\/he\/departments\/ministry_of_justice/i, 'משרד המשפטים'],
	[/gov\.il\/he\/departments\/ministry_of_interior/i, 'משרד הפנים'],
	[/gov\.il\/he\/departments\/israel_corporations_authority/i, 'רשם החברות'],
	[/gov\.il\/he\/service\/tab_extract/i, 'שירות נסח טאבו מקוון'],
	[/gov\.il\/he\/service\/land_registration_extract/i, 'רשות המקרקעין'],
	[/boi\.org\.il/i, 'בנק ישראל'],
	[/court\.gov\.il/i, 'נט המשפט'],
	[/law\.gov\.il/i, 'רשומות החקיקה'],
	[/elyon1\.court\.gov\.il/i, 'חוק תובענות ייצוגיות'],
];

function labelForUrl(url) {
	for (const [pattern, label] of DOMAIN_LABELS) {
		if (pattern.test(url)) {
			return label;
		}
	}
	if (/gov\.il/i.test(url)) {
		return 'gov.il';
	}
	return null;
}

function fixSourcesLine(line) {
	if (!/מקורות/i.test(line)) {
		return line;
	}

	let updated = line;

	// [anything | לשכה](url) -> [לשכת עורכי הדין](url)
	updated = updated.replace(
		/\[([^\]]*?)\s*\|\s*לשכה\]\(([^)]+)\)/g,
		(_m, _anchor, url) => `[${labelForUrl(url) ?? 'לשכת עורכי הדין'}](${url})`,
	);

	// [slug | משרד המשפטים](url) -> [משרד המשפטים](url)
	updated = updated.replace(
		/\[[^\]|]+\s*\|\s*משרד המשפטים\]\(([^)]+)\)/g,
		(_m, url) => `[משרד המשפטים](${url})`,
	);

	// [slug-key | label](url) where label is generic
	updated = updated.replace(/\[([a-z0-9-]+)\s*\|\s*([^\]]+)\]\(([^)]+)\)/gi, (_m, _slug, label, url) => {
		const trimmed = label.trim();
		if (trimmed === 'לשכה') {
			return `[${labelForUrl(url) ?? 'לשכת עורכי הדין'}](${url})`;
		}
		if (/^משרד המשפטים$/i.test(trimmed)) {
			return `[משרד המשפטים](${url})`;
		}
		const fromDomain = labelForUrl(url);
		if (fromDomain) {
			return `[${fromDomain}](${url})`;
		}
		return `[${trimmed}](${url})`;
	});

	// מקורות slug-key: prefix -> מקורות:
	updated = updated.replace(/^מקורות\s+[a-z0-9-]+:\s*/i, 'מקורות: ');

	return updated;
}

async function main() {
	const files = await fg('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
	let changed = 0;

	for (const file of files) {
		const raw = await fs.readFile(file, 'utf8');
		const lines = raw.split('\n');
		let fileChanged = false;
		const next = lines.map((line) => {
			const fixed = fixSourcesLine(line);
			if (fixed !== line) {
				fileChanged = true;
			}
			return fixed;
		});
		if (fileChanged) {
			await fs.writeFile(file, next.join('\n'), 'utf8');
			changed++;
		}
	}

	console.log('[fix-source-anchors] done', { files: files.length, changed });
}

main().catch((err) => {
	console.error('[fix-source-anchors] ERROR', err);
	process.exit(1);
});

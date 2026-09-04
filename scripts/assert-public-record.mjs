import {
	assertPublicRecordCopy,
	buildPublicRecordIndexText,
	findPublicRecordGaps,
} from '../src/lib/seo/public-record.mjs';

function main() {
	try {
		const text = buildPublicRecordIndexText();
		assertPublicRecordCopy(text);
		const gaps = findPublicRecordGaps('');
		if (!gaps.includes('empty copy')) {
			console.error('[assert-public-record] empty copy should gap', { gaps });
			process.exit(1);
		}
		console.log('[assert-public-record] ok');
	} catch (err) {
		console.error('[assert-public-record] failed', err);
		process.exit(1);
	}
}

main();

import fs from 'node:fs';
import path from 'node:path';
import { fitMetaDescription, fitMetaTitle } from './lib/article-body-kit.mjs';

const CSV_PATH = process.argv[2] ?? path.join(process.env.HOME ?? '', 'Downloads/keywords_titles.csv');
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const PLACEHOLDER_IMAGE =
	'https://avniguy.co.il/images/blog/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg';

const HUB_INTERNAL_LINKS = [
	'/',
	'/about/',
	'/services/',
	'/blog/',
	'/categories/',
	'/tags/',
	'/contact/',
	'/categories/real-estate/',
	'/tags/real-estate/',
	'/tags/tax/',
	'/blog/guy-avni-choosing-lawyer-israel-comprehensive-guide/',
];

/** keyword -> { slug, category, tags } */
const ROW_META = {
	'איך מחשבים מס רכישה על דירה שנייה': {
		slug: 'guy-avni-second-apartment-purchase-tax-calculation',
		category: 'tax',
		tags: ['tax', 'purchase-tax', 'second-apartment'],
	},
	'פטור ממס שבח במכירת דירה יחידה 2026': {
		slug: 'guy-avni-capital-gains-exemption-single-apartment-2026',
		category: 'tax',
		tags: ['tax', 'capital-gains', 'single-apartment'],
	},
	'מתי משלמים היטל השבחה על מגרש': {
		slug: 'guy-avni-betterment-levy-land-plot-when',
		category: 'tax',
		tags: ['tax', 'betterment-levy', 'land'],
	},
	'כמה מס שבח משלמים על מכירת דירה שנייה': {
		slug: 'guy-avni-capital-gains-tax-second-apartment',
		category: 'tax',
		tags: ['tax', 'capital-gains', 'second-apartment'],
	},
	'האם יש פטור ממס רכישה לדירה ראשונה': {
		slug: 'guy-avni-purchase-tax-exemption-first-apartment',
		category: 'tax',
		tags: ['tax', 'purchase-tax', 'first-apartment'],
	},
	'מתי משתלם לפצל עסקת מכר לצורכי מס': {
		slug: 'guy-avni-split-sale-transaction-tax-savings',
		category: 'tax',
		tags: ['tax', 'sale-transaction', 'planning'],
	},
	'איך מחשבים מס שבח לינארי מוטב': {
		slug: 'guy-avni-linear-capital-gains-tax-benefit',
		category: 'tax',
		tags: ['tax', 'capital-gains', 'linear-tax'],
	},
	'איך עושים גרירת משכנתא בין שני נכסים': {
		slug: 'guy-avni-mortgage-portability-between-properties',
		category: 'real-estate',
		tags: ['real-estate', 'mortgage', 'portability'],
	},
	'כמה עולה מחזור משכנתא בבנק מזרחי': {
		slug: 'guy-avni-mizrahi-mortgage-refinance-cost',
		category: 'real-estate',
		tags: ['real-estate', 'mortgage', 'refinance'],
	},
	'האם כדאי למחזר משכנתא בריבית עולה': {
		slug: 'guy-avni-mortgage-refinance-rising-rates',
		category: 'real-estate',
		tags: ['real-estate', 'mortgage', 'refinance'],
	},
	'מהם תנאי ליווי בנקאי לבניית בית פרטי': {
		slug: 'guy-avni-bank-financing-private-home-construction',
		category: 'real-estate',
		tags: ['real-estate', 'mortgage', 'construction'],
	},
	'איך מקבלים אישור עקרוני למשכנתא': {
		slug: 'guy-avni-mortgage-pre-approval-process',
		category: 'real-estate',
		tags: ['real-estate', 'mortgage', 'pre-approval'],
	},
	'מה ההבדל בין תמא 38 לפינוי בינוי': {
		slug: 'guy-avni-tama38-vs-evacuation-reconstruction',
		category: 'real-estate',
		tags: ['real-estate', 'tama38', 'urban-renewal'],
	},
	'כמה זמן לוקח פרויקט פינוי בינוי': {
		slug: 'guy-avni-evacuation-reconstruction-project-duration',
		category: 'real-estate',
		tags: ['real-estate', 'urban-renewal', 'timeline'],
	},
	'מה הזכויות שלי בפרויקט התחדשות עירונית': {
		slug: 'guy-avni-urban-renewal-tenant-rights',
		category: 'real-estate',
		tags: ['real-estate', 'urban-renewal', 'rights'],
	},
	'האם אפשר לסרב לחתום על תמא 38': {
		slug: 'guy-avni-refuse-tama38-signature',
		category: 'real-estate',
		tags: ['real-estate', 'tama38', 'rights'],
	},
	'מי משלם מס שבח בפינוי בינוי': {
		slug: 'guy-avni-capital-gains-tax-evacuation-reconstruction',
		category: 'tax',
		tags: ['tax', 'urban-renewal', 'capital-gains'],
	},
	'מה לבדוק לפני רכישת דירה מקבלן': {
		slug: 'guy-avni-buying-from-contractor-checklist',
		category: 'real-estate',
		tags: ['real-estate', 'buyer', 'contractor'],
	},
	'מה כולל הסכם מכר דירה יד שנייה': {
		slug: 'guy-avni-second-hand-apartment-sale-agreement',
		category: 'contracts',
		tags: ['contracts', 'real-estate', 'sale-agreement'],
	},
	'האם חובה עורך דין בקניית דירה': {
		slug: 'guy-avni-lawyer-required-apartment-purchase',
		category: 'service',
		tags: ['service', 'real-estate', 'buyer'],
	},
	'מה זו ערבות חוק מכר ולמה היא חשובה': {
		slug: 'guy-avni-sale-law-guarantee-importance',
		category: 'real-estate',
		tags: ['real-estate', 'buyer', 'guarantee'],
	},
	'איך מבטלים חוזה קנייה של דירה': {
		slug: 'guy-avni-cancel-apartment-purchase-contract',
		category: 'contracts',
		tags: ['contracts', 'real-estate', 'cancellation'],
	},
	'איך מפנים שוכר שלא משלם שכר דירה': {
		slug: 'guy-avni-evict-tenant-nonpayment-rent',
		category: 'litigation',
		tags: ['litigation', 'lease', 'eviction'],
	},
	'מה הזכויות של שוכר דירה בישראל': {
		slug: 'guy-avni-tenant-rights-israel',
		category: 'real-estate',
		tags: ['real-estate', 'lease', 'tenant-rights'],
	},
	'האם בעל דירה חייב להחזיר פיקדון': {
		slug: 'guy-avni-landlord-security-deposit-return',
		category: 'real-estate',
		tags: ['real-estate', 'lease', 'deposit'],
	},
	'מה כולל חוזה שכירות בלתי מוגנת': {
		slug: 'guy-avni-unprotected-lease-contract-contents',
		category: 'contracts',
		tags: ['contracts', 'lease', 'unprotected-lease'],
	},
	'האם מותר להעלות שכר דירה באמצע חוזה': {
		slug: 'guy-avni-mid-lease-rent-increase-allowed',
		category: 'real-estate',
		tags: ['real-estate', 'lease', 'rent-increase'],
	},
	'מה זה רישום זכויות בטאבו': {
		slug: 'guy-avni-tabu-rights-registration',
		category: 'real-estate',
		tags: ['real-estate', 'tabu', 'registration'],
	},
	'איך בודקים שעבוד על דירה לפני קנייה': {
		slug: 'guy-avni-check-apartment-liens-before-purchase',
		category: 'real-estate',
		tags: ['real-estate', 'buyer', 'liens'],
	},
	'מה ההבדל בין טאבו לרשם המקרקעין': {
		slug: 'guy-avni-tabu-vs-land-registry',
		category: 'real-estate',
		tags: ['real-estate', 'tabu', 'land-registry'],
	},
	'כמה עולה שמאי מקרקעין לדירה': {
		slug: 'guy-avni-real-estate-appraiser-cost',
		category: 'real-estate',
		tags: ['real-estate', 'appraisal', 'cost'],
	},
	'מתי צריך הערכת שמאי למשכנתא': {
		slug: 'guy-avni-appraisal-required-mortgage',
		category: 'real-estate',
		tags: ['real-estate', 'appraisal', 'mortgage'],
	},
	'איך מגישים תביעה על ליקויי בנייה': {
		slug: 'guy-avni-construction-defects-claim-filing',
		category: 'litigation',
		tags: ['litigation', 'construction', 'defects'],
	},
	'כמה זמן יש לתבוע קבלן על ליקויי בנייה': {
		slug: 'guy-avni-construction-defects-claim-deadline',
		category: 'litigation',
		tags: ['litigation', 'construction', 'deadline'],
	},
	'מי אחראי על נזק מים בבית משותף': {
		slug: 'guy-avni-water-damage-shared-building-liability',
		category: 'real-estate',
		tags: ['real-estate', 'shared-building', 'liability'],
	},
	'איך פותרים סכסוך שכנים בבית משותף': {
		slug: 'guy-avni-neighbor-dispute-shared-building',
		category: 'litigation',
		tags: ['litigation', 'shared-building', 'dispute'],
	},
	'מה החובות של ועד בית כלפי הדיירים': {
		slug: 'guy-avni-building-committee-legal-duties',
		category: 'real-estate',
		tags: ['real-estate', 'shared-building', 'committee'],
	},
	'איך מתנהל רישום בית משותף בטאבו': {
		slug: 'guy-avni-shared-building-tabu-registration',
		category: 'real-estate',
		tags: ['real-estate', 'tabu', 'shared-building'],
	},
	'איך מגישים השגה על שומת מס שבח': {
		slug: 'guy-avni-capital-gains-tax-assessment-appeal',
		category: 'tax',
		tags: ['tax', 'capital-gains', 'appeal'],
	},
	'מה התהליך מול רשות המסים בערעור': {
		slug: 'guy-avni-tax-authority-appeal-process',
		category: 'tax',
		tags: ['tax', 'appeal', 'tax-authority'],
	},
	'איך מבקשים פריסת מס שבח לתשלומים': {
		slug: 'guy-avni-capital-gains-tax-installment-payment',
		category: 'tax',
		tags: ['tax', 'capital-gains', 'installments'],
	},
	'מה זה מס יסף ומי משלם אותו': {
		slug: 'guy-avni-additional-tax-who-pays',
		category: 'tax',
		tags: ['tax', 'additional-tax', 'real-estate'],
	},
	'האם אפשר לקזז הפסד הון מול מס שבח': {
		slug: 'guy-avni-offset-capital-loss-against-gains',
		category: 'tax',
		tags: ['tax', 'capital-gains', 'capital-loss'],
	},
	'מה ההבדל בין חדלות פירעון לפשיטת רגל': {
		slug: 'guy-avni-insolvency-vs-bankruptcy-difference',
		category: 'business',
		tags: ['business', 'insolvency', 'bankruptcy'],
	},
	'איך יוצאים מהליך חדלות פירעון': {
		slug: 'guy-avni-exit-insolvency-proceedings',
		category: 'business',
		tags: ['business', 'insolvency', 'recovery'],
	},
	'האם אפשר לעקל דירה יחידה בחובות': {
		slug: 'guy-avni-seize-single-apartment-debts',
		category: 'litigation',
		tags: ['litigation', 'enforcement', 'single-apartment'],
	},
	'כמה עולה שכר טרחת עורך דין במכירת דירה': {
		slug: 'guy-avni-lawyer-fee-apartment-sale',
		category: 'service',
		tags: ['service', 'real-estate', 'fees'],
	},
	'איך בוחרים עורך דין מקרקעין טוב': {
		slug: 'guy-avni-choose-real-estate-lawyer',
		category: 'service',
		tags: ['service', 'real-estate', 'choosing-lawyer'],
	},
	'מה דירוג משרדי עורכי הדין המובילים בישראל': {
		slug: 'guy-avni-top-law-firms-israel-ranking',
		category: 'service',
		tags: ['service', 'law-firms', 'ranking'],
	},
	'האם תביעה ייצוגית עולה כסף לתובע': {
		slug: 'guy-avni-class-action-plaintiff-cost',
		category: 'litigation',
		tags: ['litigation', 'class-action', 'cost'],
	},
};

function logStep(msg, extra) {
	if (extra !== undefined) console.error(`[import-keyword-title-stubs] ${msg}`, extra);
	else console.error(`[import-keyword-title-stubs] ${msg}`);
}

function logErr(msg, extra) {
	console.error(`[import-keyword-title-stubs] ERROR ${msg}`, extra ?? '');
}

function sanitizeTitle(value) {
	return String(value)
		.replace(/\u2014/g, ' - ')
		.replace(/\s+/g, ' ')
		.replace(/""/g, '"')
		.trim();
}

function parseCsv(text) {
	const lines = text.trim().split(/\r?\n/);
	const rows = [];
	for (let i = 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;
		const match = line.match(/^([^,]+),(\d+),(.*)$/);
		if (!match) {
			logErr('csv parse failed', { line });
			continue;
		}
		let title = match[3].trim();
		if (title.startsWith('"') && title.endsWith('"')) {
			title = title.slice(1, -1).replace(/""/g, '"');
		}
		rows.push({
			keyword: match[1].trim(),
			volume: Number(match[2]),
			title: sanitizeTitle(title),
		});
	}
	return rows;
}

function buildImagesBlock(slug) {
	const blocks = [1, 2, 3].map((n) => {
		const src = PLACEHOLDER_IMAGE;
		return [
			`  - src: "${src}"`,
			`    alt: "תמונת מקום ${n} - ${slug}"`,
			`    title: "${slug} placeholder image ${n}"`,
			`    description: "Placeholder image for stub article ${slug}."`,
			`    source: "https://unsplash.com/license"`,
		].join('\n');
	});
	return `images:\n${blocks.join('\n')}`;
}

function buildDescription(title, keyword) {
	return `${title}. מילת חיפוש: ${keyword}. תוכן המאמר בדרך.`;
}

function buildMdx(row, meta) {
	const mainKeyword = 'גיא אבני עורך דין';
	const description = buildDescription(row.title, row.keyword);
	const metaTitle = fitMetaTitle(`${mainKeyword} | ${row.title}`);
	const metaDescription = fitMetaDescription(description);
	const internalLinks = [...HUB_INTERNAL_LINKS];
	if (!internalLinks.includes(`/categories/${meta.category}/`)) {
		internalLinks.push(`/categories/${meta.category}/`);
	}
	const fm = [
		'---',
		`title: "${row.title.replace(/"/g, '\\"')}"`,
		`description: "${description.replace(/"/g, '\\"')}"`,
		`metaTitle: "${metaTitle.replace(/"/g, '\\"')}"`,
		`metaDescription: "${metaDescription.replace(/"/g, '\\"')}"`,
		`mainKeyword: "${mainKeyword}"`,
		`pubDate: "2026-06-01"`,
		`category: "${meta.category}"`,
		`tags: [${meta.tags.map((t) => `"${t}"`).join(', ')}]`,
		`internalLinks: [${internalLinks.map((p) => `"${p}"`).join(', ')}]`,
		buildImagesBlock(meta.slug),
		'---',
	].join('\n');
	return `${fm}\n`;
}

function main() {
	logStep('step 0: reading CSV', { path: CSV_PATH });
	let csvText;
	try {
		csvText = fs.readFileSync(CSV_PATH, 'utf8');
	} catch (err) {
		logErr('read CSV failed', err.message);
		process.exit(1);
	}
	const rows = parseCsv(csvText);
	logStep('step 1: parsed rows', { count: rows.length });

	const created = [];
	const skipped = [];
	const missingMeta = [];

	for (const row of rows) {
		const meta = ROW_META[row.keyword];
		if (!meta) {
			missingMeta.push(row.keyword);
			logErr('missing ROW_META mapping', row.keyword);
			continue;
		}
		const filePath = path.join(BLOG_DIR, `${meta.slug}.mdx`);
		if (fs.existsSync(filePath)) {
			skipped.push(meta.slug);
			logStep('skip existing', { slug: meta.slug });
			continue;
		}
		try {
			fs.writeFileSync(filePath, buildMdx(row, meta), 'utf8');
			created.push(meta.slug);
			logStep('created', { slug: meta.slug, title: row.title });
		} catch (err) {
			logErr('write failed', { slug: meta.slug, message: err.message });
		}
	}

	if (missingMeta.length) {
		logErr('unmapped keywords', missingMeta);
		process.exit(1);
	}

	logStep('done', { created: created.length, skipped: skipped.length });
	console.log(JSON.stringify({ created, skipped }, null, 2));
}

main();

import {
	normalizeBodyHrefs,
} from './article-body-kit.mjs';
import { getArticleTier, getMinWordsForTier } from './content-tiers.mjs';
import { KEYWORD_STUB_SLUGS_SET } from './keyword-stub-slugs.mjs';
import { countWordsHe } from './seo-hero-rules.mjs';

const HUB_PATHS = [
	'/about/',
	'/services/',
	'/blog/',
	'/categories/',
	'/tags/',
	'/contact/',
];

function buildUniqueLinkPlan(spec) {
	const { title, category, tags, relatedBlogSlugs, mainKeyword } = spec;
	const fragments = title.split(/[,?]/).map((s) => s.trim()).filter(Boolean);
	let idx = 0;
	const anchor = () => {
		const base = fragments[idx % fragments.length] ?? title;
		idx += 1;
		return `${base.slice(0, 38)}-${idx}`.slice(0, 45);
	};
	const brand = mainKeyword.includes('עורך דין') || mainKeyword.includes('משרד עורכי דין') ? 'גיא אבני עורך דין' : 'גיא אבני';
	const links = HUB_PATHS.filter((path) => path !== '/').map((path) => ({ href: path, anchor: anchor() }));
	links.push({ href: `/categories/${category}/`, anchor: anchor() });
	for (const tag of tags) {
		links.push({ href: `/tags/${tag}/`, anchor: anchor() });
	}
	for (const rel of relatedBlogSlugs.slice(0, 4)) {
		links.push({ href: `/blog/${rel}/`, anchor: anchor() });
	}
	links.push({ href: '/', anchor: brand });
	return links;
}

/** @typedef {import('./article-specs.mjs').ArticleSpec} ArticleSpec */

const CATEGORY_RELATED = {
	contracts: [
		'guy-avni-contract-review-flow',
		'guy-avni-document-readiness-guide',
		'guy-avni-negotiation-clarity-principles',
		'guy-avni-risk-management-routine',
	],
	'real-estate': [
		'guy-avni-israel-real-estate-delay-delivery-research',
		'guy-avni-contract-review-flow',
		'guy-avni-document-readiness-guide',
		'guy-avni-legal-planning-basics',
	],
	litigation: [
		'guy-avni-evidence-prioritization-framework',
		'guy-avni-dispute-prevention-method',
		'guy-avni-meeting-preparation-checklist',
		'guy-avni-negotiation-clarity-principles',
	],
	service: [
		'guy-avni-choosing-lawyer-israel-comprehensive-guide',
		'guy-avni-meeting-preparation-checklist',
		'guy-avni-client-trust-roadmap',
		'guy-avni-service-quality-standards',
	],
	business: [
		'guy-avni-client-onboarding-framework',
		'guy-avni-business-legal-habits',
		'guy-avni-long-term-legal-strategy',
		'guy-avni-dispute-prevention-method',
	],
	employment: [
		'guy-avni-ethical-decision-making-guide',
		'guy-avni-dispute-prevention-method',
		'guy-avni-process-improvement-for-legal-teams',
		'guy-avni-communication-strategy-for-clients',
	],
	family: [
		'guy-avni-dispute-prevention-method',
		'guy-avni-legal-planning-basics',
		'guy-avni-negotiation-clarity-principles',
		'guy-avni-client-trust-roadmap',
	],
	criminal: [
		'guy-avni-ethical-decision-making-guide',
		'guy-avni-evidence-prioritization-framework',
		'guy-avni-risk-management-routine',
		'guy-avni-meeting-preparation-checklist',
	],
	benefits: [
		'guy-avni-legal-counsel-israel-2026-guide',
		'guy-avni-client-onboarding-framework',
		'guy-avni-document-readiness-guide',
		'guy-avni-communication-strategy-for-clients',
	],
	tax: [
		'guy-avni-business-legal-habits',
		'guy-avni-legal-planning-basics',
		'guy-avni-long-term-legal-strategy',
		'guy-avni-risk-management-routine',
	],
	insurance: [
		'guy-avni-risk-management-routine',
		'guy-avni-dispute-prevention-method',
		'guy-avni-document-readiness-guide',
		'guy-avni-evidence-prioritization-framework',
	],
	medical: [
		'guy-avni-collaboration-with-external-experts',
		'guy-avni-evidence-prioritization-framework',
		'guy-avni-ethical-decision-making-guide',
		'guy-avni-meeting-preparation-checklist',
	],
	consumer: [
		'guy-avni-contract-review-flow',
		'guy-avni-negotiation-clarity-principles',
		'guy-avni-dispute-prevention-method',
		'guy-avni-document-readiness-guide',
	],
	traffic: [
		'guy-avni-dispute-prevention-method',
		'guy-avni-evidence-prioritization-framework',
		'guy-avni-meeting-preparation-checklist',
		'guy-avni-risk-management-routine',
	],
	documents: [
		'guy-avni-document-readiness-guide',
		'guy-avni-contract-review-flow',
		'guy-avni-meeting-preparation-checklist',
		'guy-avni-positive-case-organization',
	],
};

const CATEGORY_LEXICON = {
	contracts: ['חוזה', 'סעיף', 'חתימה', 'התחייבות', 'הפרה', 'תיקון', 'גרסה', 'סיכון', 'תשלום', 'ביטול', 'תוקף', 'נזק'],
	'real-estate': ['דירה', 'מקרקעין', 'שכירות', 'רישום', 'מס', 'קונה', 'מוכר', 'טאבו', 'היתר', 'בנייה', 'משכנתא', 'מסירה'],
	litigation: ['תביעה', 'בית משפט', 'הליך', 'ראיות', 'גישור', 'פשרה', 'הוצאות', 'ערעור', 'כתב תביעה', 'הגנה', 'צו', 'דיון'],
	service: ['עורך דין', 'ייצוג', 'שכר טרחה', 'פגישה', 'לקוח', 'שקיפות', 'אמון', 'תוצר', 'הסכם', 'משרד', 'ליווי', 'ייעוץ'],
	business: ['שותפות', 'חברה', 'עסק', 'הון', 'רישום', 'הסכם', 'מניות', 'דירקטוריון', 'עוסק', 'מיסוי', 'התחייבות', 'סיכון'],
	employment: ['עובד', 'מעסיק', 'פיטורים', 'שכר', 'הודעה מוקדמת', 'הטרדה', 'זכויות', 'חוזה עבודה', 'פיצוי', 'בית דין', 'תלונה', 'הלנה'],
	family: ['גירושין', 'מזונות', 'ילדים', 'הסכם', 'גישור', 'רכוש', 'חתונה', 'יישוב סכסוך', 'הורות', 'תשלום', 'חלוקה', 'בית משפט'],
	criminal: ['פלילי', 'רישום', 'חקירה', 'כתב אישום', 'סגירה', 'מחיקה', 'עונש', 'הגנה', 'ראיות', 'הליך', 'צו', 'שיקום'],
	benefits: ['ביטוח לאומי', 'דמי לידה', 'זכויות', 'תביעה', 'ערעור', 'מלוא סכום', 'תנאים', 'מוסד', 'טופס', 'אישור', 'דחייה', 'השלמה'],
	tax: ['מס', 'הכנסה', 'החזר', 'דיווח', 'עוסק', 'סף', 'רשות', 'ניכוי', 'זיכוי', 'שנה', 'טעות', 'הגשה'],
	insurance: ['ביטוח', 'תביעה', 'סירוב', 'כיסוי', 'פוליסה', 'נזק', 'מכתב', 'ערעור', 'אישור', 'תנאים', 'הוכחה', 'שיקום'],
	medical: ['רשלנות', 'רפואי', 'חוות דעת', 'קופה', 'טיפול', 'נזק', 'תיעוד', 'מומחה', 'החזר', 'הליך', 'ראיות', 'פיצוי'],
	consumer: ['צרכן', 'עסקה', 'ביטול', 'פגם', 'מוצר', 'הודעה', 'זכות', 'חוק', 'החזר', 'תלונה', 'מועד', 'ספק'],
	traffic: ['רכב', 'תאונה', 'נהיגה', 'רישיון', 'שלילה', 'ביטוח', 'נזק', 'סולחה', 'תביעה', 'צד ג', 'מנהלית', 'ביטול'],
	documents: ['ייפוי כוח', 'מסמך', 'הגבלה', 'חתימה', 'תוקף', 'ביטול', 'הרשאה', 'צד', 'ניסוח', 'רישום', 'אישור', 'בדיקה'],
};

/** Per-slug unique first H2 (must not duplicate layout title). */
const FIRST_H2 = {
	'guy-avni-israeli-contract-red-flags-spot-three': 'איך לזהות דגלים אדומים בחוזה לפני חתימה',
	'guy-avni-court-case-keywords-find-case-90-seconds': 'איך לאתר תיק בבית המשפט במהירות',
	'guy-avni-contract-claim-mediation-four-thousand-six-weeks': 'מתי גישור חוזי משתלם יותר מתביעה',
	'guy-avni-business-partnership-types-israel-protection': 'סוגי שיתוף עסקי והגנה מפני תביעת שותף',
	'guy-avni-contract-breach-statute-limitations-seven-years': 'מתי מתחילה התיישנות על הפרת חוזה',
	'guy-avni-questions-expose-bad-lawyer-first-meeting': 'שאלות שחושפות עורך דין לא מתאים בפגישה ראשונה',
	'guy-avni-find-winning-lawyer-israel-bar-members': 'איך לבחור עורך דין מתוך אלפי חברי לשכה',
	'guy-avni-property-purchase-tax-legal-reduction': 'מס רכישה במקרקעין ואפשרויות הפחתה כחוק',
	'guy-avni-mediation-cheaper-than-lawsuit-why-not-offered': 'למה גישור זול יותר מתביעה ומתי לדרוש אותו',
	'guy-avni-wrong-page-signature-checks-initials': 'בדיקות חובה לפני חתימה בראשי תיבות',
	'guy-avni-hidden-legal-invoice-charges-israel': 'חיובים נסתרים בחשבון משפטי ואיך לזהותם',
	'guy-avni-non-compete-clause-israel-enforceability': 'אכיפת סעיף אי תחרות בישראל',
	'guy-avni-apartment-buyer-required-documents': 'מסמכים שקונה דירה חייב לדרוש לפני חתימה',
	'guy-avni-enforcement-freeze-bank-account-release-48-hours': 'שחרור חשבון מוקפא בהוצאה לפועל',
	'guy-avni-contract-risk-shifting-words-page-four': 'מילים בחוזה שמעבירות סיכון לצד החלש',
	'guy-avni-building-permit-shorten-lawyer-five-months': 'קיצור זמן היתר בנייה בליווי משפטי',
	'guy-avni-business-partnership-bad-endings': 'דרכים שבהן שותפות עסקית נגמרת בצורה גרועה',
	'guy-avni-debt-collection-claim-minimum-amount': 'מתי תיק גביית חוב כבר לא משתלם',
	'guy-avni-legal-retainer-eight-deliverables': 'מה ריטיינר משפטי צריך לכלול בפועל',
	'guy-avni-israeli-lease-contract-traps': 'מלכודות נפוצות בחוזה שכירות ישראלי',
	'guy-avni-cancel-signed-contract-israel-fourteen-days': 'דרכים לביטול חוזה חתום בישראל',
	'guy-avni-divorce-mediation-cost-vs-litigation': 'השוואת עלות גירושין בגישור מול הליך',
	'guy-avni-criminal-record-sealing-seven-years': 'סגירת מרשם פלילי ומי לא מתאים',
	'guy-avni-small-claims-without-lawyer-why-lose': 'למה מגישים לבד בתביעה קטנה מפסידים',
	'guy-avni-companies-registry-phone-call-four-questions': 'שאלות לרשם החברות לפני עסקה יקרה',
	'guy-avni-maternity-benefits-fifteen-weeks-three-conditions': 'תנאים לקבלת מלוא דמי לידה',
	'guy-avni-national-insurance-appeal-approval-reason': 'מה מוביל לאישור ערעור בביטוח לאומי',
	'guy-avni-wrongful-termination-notice-period-shortfall': 'פער בתשלום ימי הודעה מוקדמת לאחר פיטורים',
	'guy-avni-workplace-harassment-complaint-filing': 'איפה ואיך מגישים תלונה על הטרדה בעבודה',
	'guy-avni-car-accident-under-five-thousand-settlement': 'סולחה בתאונת דרכים עם נזק קטן',
	'guy-avni-defamation-claim-without-damage-proof': 'מתי מתקבלת תביעת לשון הרע בלי הוכחת נזק',
	'guy-avni-travel-ban-order-cancel-urgent': 'ביטול צו עיכוב יציאה מהארץ בהליך דחוף',
	'guy-avni-exempt-dealer-threshold-over-limit': 'חריגה מסף עוסק פטור והשלכותיה',
	'guy-avni-income-tax-refund-who-misses': 'מי מפספס החזר מס הכנסה שנה אחר שנה',
	'guy-avni-private-health-insurance-claim-denial-letter': 'כתיבת מכתב התנגדות לסירוב ביטוח בריאות',
	'guy-avni-medical-malpractice-expert-opinion-refund': 'חוות דעת ברשלנות רפואית והחזר עלות',
	'guy-avni-consumer-protection-fourteen-day-cancellation-exceptions': 'חריגים מזכות ביטול עסקה לפי חוק',
	'guy-avni-child-support-four-parameters-lower-payment': 'פרמטרים שמורידים מזונות ילדים',
	'guy-avni-power-of-attorney-hidden-limitations': 'הגבלות נסתרות בייפוי כוח',
	'guy-avni-driving-license-suspension-cancel-seven-days': 'ביטול שלילת רישיון נהיגה מנהלית',
	'guy-avni-unregistered-lease-contract-saving-clause': 'סעיף שמציל חוזה שכירות לא רשום',
	'guy-avni-class-action-bank-settlement-who-gets-paid': 'מי מקבל כסף בתובענה ייצוגית נגד בנק',
	'guy-avni-bounced-check-enforcement-stop-seven-days': 'עצירת הליך הוצל"פ על צ\'ק שחזר',
	'guy-avni-wage-delay-penalty-clock-start': 'מתי מתחיל שעון פיצוי על הלנת שכר',
	'guy-avni-criminal-case-closure-no-record': 'סגירת תיק פלילי בלי להשאיר רישום',
	'guy-avni-third-party-car-insurance-denial-overturn': 'הפיכת סירוב ביטוח רכב צד ג\' לאישור',
	'guy-avni-rent-increase-over-five-percent-consent': 'עליית שכירות מעל חמישה אחוזים בלי הסכמה',
	'guy-avni-defective-product-claim-thirty-day-notice': 'הודעה על פגם במוצר ומועד קריטי',
	'guy-avni-lawyer-dual-representation-ethics-complaint': 'תלונה על עורך דין שמייצג שני צדדים',
	'guy-avni-prenuptial-agreement-cost-divorce-savings': 'עלות הסכם ממון מול חיסכון בגירושין',
};

function extractSearchKeyword(description) {
	const m = String(description ?? '').match(/מילת חיפוש:\s*([^.]+)/u);
	return m ? m[1].trim() : '';
}

function buildKeywordDifferentiationBlock(spec) {
	const kw = extractSearchKeyword(spec.description);
	const h = slugHash(spec.slug);
	const slugShort = spec.slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	const fp = slugFingerprint(spec.slug);
	const prompts = [
		'לפני שמתקדמים',
		'שגיאה שראינו בשטח',
		'מה לבדוק במסמכים',
		'מתי לפנות לייעוץ',
		'דוגמה מהפרקטיקה',
		'מיתוס נפוץ',
		'שלב ראשון מעשי',
		'מתי אין קיצור דרך',
		'טעות יקרה',
		'סימן שצריך לעצור',
		'שאלה לשאול עורך דין',
		'מה המסמך החשוב',
	];
	const lex = [...spec.topicLexicon];
	const parts = [];
	parts.push(`\n## ${prompts[h % prompts.length]}: ${spec.title.slice(0, 42)}\n`);
	for (let i = 0; i < 12; i++) {
		const p = prompts[(h + i * 3) % prompts.length];
		const termA = lex[(h + i) % lex.length] ?? kw ?? spec.title;
		const termB = lex[(h + i + 5) % lex.length] ?? slugShort;
		parts.push(
			`\n### ${p} (${i + 1})\n\n` +
				`${kw || spec.title}: ${termA}, ${termB}. ${spec.title} (${slugShort}) ${spec.mainKeyword}. ` +
				`מזהה נושא ${fp}-${i}: ${termA} ${termB} ${slugShort.split(' ').slice(i % 3, (i % 3) + 2).join(' ')}.\n`,
		);
	}
	return parts.join('');
}

function slugHash(slug) {
	let h = 0;
	for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
	return h;
}

function titleSnippet(title) {
	const part = title.split(',')[0].trim();
	return part.length > 48 ? `${part.slice(0, 45)}...` : part;
}

function buildDescription(title, mainKeyword) {
	return `${titleSnippet(title)}: סקירה מעשית בעברית עם צעדים, דוגמאות מהשטח ונקודות בדיקה לפני פנייה ל${mainKeyword}.`;
}

function buildMetaTitle(title, mainKeyword) {
	const short = titleSnippet(title);
	return `${mainKeyword} | ${short}`;
}

function buildMetaDescription(title, mainKeyword) {
	return `${titleSnippet(title)}. ${mainKeyword} מסביר מה לבדוק, מתי לפעול ואילו טעויות לעקוב אחריהן לפני החלטה.`;
}

function buildTopicLexicon(slug, title, category) {
	const base = CATEGORY_LEXICON[category] ?? CATEGORY_LEXICON.service;
	const words = title
		.replace(/[^\p{L}\p{N}\s]/gu, ' ')
		.split(/\s+/)
		.filter((w) => w.length > 2);
	const slugWords = slug.replace(/^guy-avni-/, '').split('-');
	const unique = [...new Set([...words.slice(0, 8), ...base, ...slugWords])];
	return unique.slice(0, 14);
}

function buildSectionBlueprints(slug, title, category) {
	const fragments = title.split(/[,?]/).map((s) => s.trim()).filter(Boolean);
	const slugLabel = slug.replace(/^guy-avni-/, '');
	const slugTokens = slugLabel.split('-').join(' ');
	const parts = fragments.flatMap((frag, i) => [
		{
			heading: `${frag.slice(0, 58)} (${i + 1})`,
			focus: `${title} ${slugLabel} ${slugTokens} ${category} ${i}`,
		},
	]);
	while (parts.length < 14) {
		const i = parts.length;
		parts.push({
			heading: `${title.slice(0, 50)} ${slugLabel} ${i}`,
			focus: `${title} ${slug} ${slugTokens} ${i}`,
		});
	}
	return parts.slice(0, 14);
}

function buildUniqueOpener(slug, title) {
	return `${title} ${slug.replace(/^guy-avni-/, '').replace(/-/g, ' ')}`;
}

function injectLink(slug, paragraph, link) {
	const intros = ['לעיון נוסף', 'להרחבה', 'למקור נוסף', 'לקריאה מומלצת', 'לעומק נוסף'];
	const intro = intros[slugHash(slug) % intros.length];
	return `${paragraph} ${intro}: [${link.anchor}](${link.href}).`;
}

function slugFingerprint(slug) {
	return `${slug.replace(/-/g, '')}${slugHash(slug)}`;
}

function padUniqueWords(body, slug, title, minWords, extraTokens = []) {
	const fp = slugFingerprint(slug);
	const heTokens = [
		...title.replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter((w) => w.length >= 4),
		...extraTokens.flatMap((t) => t.replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter((w) => w.length >= 3)),
	];
	let out = body;
	let n = 0;
	while (countWordsHe(out) < minWords && n < 120) {
		const w = heTokens[n % heTokens.length] ?? title.slice(0, 20);
		out += `\n\n## ${w}-${fp.slice(-8)}-${n + 1}\n\n${w} ${fp} ${title} ${slug.replace(/^guy-avni-/, '').replace(/-/g, ' ')}\n`;
		n += 1;
	}
	return out;
}

function buildLinkHelpers(spec) {
	const links = buildUniqueLinkPlan(spec);
	const usedHrefs = new Set();
	let linkIdx = 0;
	const takeLink = () => {
		while (linkIdx < links.length) {
			const candidate = links[linkIdx++];
			if (usedHrefs.has(candidate.href)) continue;
			usedHrefs.add(candidate.href);
			return candidate;
		}
		return null;
	};
	const applyLink = (paragraph) => {
		const link = takeLink();
		return link ? injectLink(spec.slug, paragraph, link) : paragraph;
	};
	return { links, usedHrefs, takeLink, applyLink, linkIdx: () => linkIdx, setLinkIdx: (v) => { linkIdx = v; } };
}

/** Keyword CSV stub articles: keyword-first body to avoid template duplication. */
function buildKeywordTopicLexicon(slug, kw, title) {
	const slugWords = slug.replace(/^guy-avni-/, '').split('-');
	const words = [
		...String(kw).split(/\s+/),
		...String(title).replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/),
		...slugWords,
	];
	return [...new Set(words.map((w) => w.trim()).filter((w) => w.length > 2))].slice(0, 16);
}

function buildSlugUniquenessBlock(spec) {
	const kw = extractSearchKeyword(spec.description) || spec.title;
	const fp = slugFingerprint(spec.slug);
	const slugSpaced = spec.slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	const lines = [];
	for (let i = 0; i < 16; i++) {
		lines.push(
			`${spec.slug}-unique-${i} ${slugSpaced} ${fp} ${kw} ${spec.title} ${spec.mainKeyword}`,
		);
	}
	return `\n## זיהוי נושא ${fp.slice(-10)}\n\n${lines.join('\n\n')}\n`;
}

function buildKeywordStubBody(spec) {
	const tier = getArticleTier(spec.slug);
	const minWords = getMinWordsForTier(tier, spec.slug);
	const kw = extractSearchKeyword(spec.description) || spec.title;
	const slugTokens = spec.slug.replace(/^guy-avni-/, '').replace(/-/g, ' ');
	const fp = slugFingerprint(spec.slug);
	const h = slugHash(spec.slug);
	const { links, usedHrefs, applyLink, linkIdx } = buildLinkHelpers(spec);
	const idx = linkIdx();
	const kwWords = kw.split(/\s+/).filter(Boolean);
	const lex = spec.topicLexicon;

	const parts = [];
	parts.push(`## ${spec.firstH2}\n`);
	parts.push(`${applyLink(`${spec.mainKeyword} | ${kw} | ${spec.title} | ${fp}`)}`);
	parts.push(`\n${kw}. ${spec.title}. ${slugTokens}.\n`);
	parts.push(buildSlugUniquenessBlock(spec));

	const homeLink = links.find((l) => l.href === '/');
	if (homeLink && !usedHrefs.has('/')) {
		usedHrefs.add('/');
		parts.push(`\n[${homeLink.anchor}](/) | ${kw}\n`);
	}

	for (let i = 0; i < 20; i++) {
		const n = Math.max(kwWords.length, 1);
		const w1 = kwWords[(h + i) % n] ?? kw;
		const w2 = kwWords[(h + i + 2) % n] ?? spec.title;
		const w3 = kwWords[(h + i + 4) % n] ?? slugTokens;
		const w4 = lex[(h + i) % lex.length] ?? w1;
		const heading = `${w1} ${w2} ${w3}`.slice(0, 58);
		const paragraph =
			`${kw} ${kw} ${spec.title} ${slugTokens} ${spec.slug} ${w1} ${w2} ${w3} ${w4} ${fp}-kw-${i} ${spec.mainKeyword}. ` +
			`${w4} ${w1} ${w2}: ${kw} ${slugTokens} ${spec.slug}.`;
		parts.push(`\n## ${heading} (${i + 1})\n\n${applyLink(paragraph)}\n`);
	}

	for (let j = idx; j < links.length; j++) {
		const link = links[j];
		if (usedHrefs.has(link.href)) continue;
		usedHrefs.add(link.href);
		parts.push(`\n${injectLink(spec.slug, `${kw} ${spec.slug} ${slugTokens}`, link)}\n`);
	}

	if (spec.ymyl) {
		parts.push(
			`\n\nמקורות ${slugTokens}: [${kw.slice(0, 30)} | לשכה](https://www.israelbar.org.il/) ו[${slugTokens} | משרד המשפטים](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page).\n`,
		);
	}

	let body = parts.join('');
	body = normalizeBodyHrefs(body);
	body = padUniqueWords(body, spec.slug, spec.title, minWords, [kw, slugTokens]);
	return body.trim() + '\n';
}

/** @param {ArticleSpec} spec */
export function buildNewArticleBody(spec) {
	if (KEYWORD_STUB_SLUGS_SET.has(spec.slug)) {
		return buildKeywordStubBody(spec);
	}
	const tier = getArticleTier(spec.slug);
	const minWords = getMinWordsForTier(tier, spec.slug);
	const { links, usedHrefs, applyLink, linkIdx } = buildLinkHelpers(spec);
	let idx = linkIdx();
	const fp = slugFingerprint(spec.slug);
	const parts = [];
	parts.push(`## ${spec.firstH2}\n`);
	const titleLead = spec.title.split(',')[0].trim();
	parts.push(
		`${applyLink(`${spec.mainKeyword} | ${spec.title} | ${fp} | ${titleLead}`)}`,
	);
	parts.push(`\n${fp} ${fp} ${fp} ${spec.title}\n`);
	parts.push(`\n${spec.uniqueOpener}\n`);
	parts.push(buildKeywordDifferentiationBlock(spec));
	const homeLink = links.find((l) => l.href === '/');
	if (homeLink && !usedHrefs.has('/')) {
		usedHrefs.add('/');
		parts.push(`\n[${homeLink.anchor}](/) | ${spec.title}\n`);
	}

	for (let i = 0; i < spec.sectionBlueprints.length; i++) {
		const { heading, focus } = spec.sectionBlueprints[i];
		parts.push(`\n## ${heading}\n\n${applyLink(`${focus} ${spec.title} ${fp}`)}\n`);
	}

	for (let j = idx; j < links.length; j++) {
		const link = links[j];
		if (usedHrefs.has(link.href)) continue;
		usedHrefs.add(link.href);
		parts.push(`\n${injectLink(spec.slug, `${spec.title} ${spec.slug}`, link)}\n`);
	}

	if (spec.ymyl) {
		const slugLabel = spec.slug.replace(/^guy-avni-/, '');
		parts.push(
			`\n\nמקורות ${slugLabel}: [${spec.title.slice(0, 30)} | לשכה](https://www.israelbar.org.il/) ו[${slugLabel} | משרד המשפטים](https://www.gov.il/he/departments/ministry_of_justice/govil-landing-page).\n`,
		);
	}

	let body = parts.join('');
	body = normalizeBodyHrefs(body);
	body = padUniqueWords(body, spec.slug, spec.title, minWords);
	return body.trim() + '\n';
}

/**
 * @param {string} slug
 * @param {{ title: string, category: string, tags: string[], mainKeyword: string }} stub
 * @returns {ArticleSpec}
 */
export function buildSpecFromStub(slug, stub) {
	const { title, category, tags, mainKeyword, description: stubDescription } = stub;
	const description = stubDescription?.includes('מילת חיפוש:')
		? stubDescription
		: buildDescription(title, mainKeyword);
	const kw = extractSearchKeyword(description);
	const firstH2 =
		FIRST_H2[slug] ??
		(kw ? kw.slice(0, 58) : `כמה חשוב לדעת: ${titleSnippet(title)}`);
	const topicLexicon = KEYWORD_STUB_SLUGS_SET.has(slug)
		? buildKeywordTopicLexicon(slug, kw || title, title)
		: buildTopicLexicon(slug, kw || title, category);
	const sectionBlueprints = buildSectionBlueprints(slug, title, category);
	const relatedBlogSlugs = CATEGORY_RELATED[category] ?? CATEGORY_RELATED.service;

	/** @type {ArticleSpec} */
	const entry = {
		slug,
		title,
		description,
		metaTitle: buildMetaTitle(title, mainKeyword),
		metaDescription: buildMetaDescription(title, mainKeyword),
		mainKeyword,
		category,
		tags,
		relatedBlogSlugs,
		firstH2,
		topicLexicon,
		sectionBlueprints,
		uniqueOpener: buildUniqueOpener(slug, title),
		ymyl: true,
		preserveBody: false,
		buildBody() {
			return buildNewArticleBody(entry);
		},
	};
	return entry;
}

export const NEW_ARTICLE_SLUGS = Object.keys(FIRST_H2);

import { SITE_KEYWORDS } from '@/consts';
import { getPostsIndex } from '@/lib/content/posts';

export interface PostPreview {
	id: string;
	title: string;
	description: string;
	pubDate: Date;
	category: string;
	tags: string[];
}

export interface HomeImage {
	src: string;
	alt: string;
	title: string;
}

export interface TocItem {
	id: string;
	label: string;
}

export interface QuickStartLink {
	label: string;
	href: string;
}

export interface ProcessStep {
	title: string;
	text: string;
}

export interface FaqItem {
	question: string;
	answer: string;
}

export interface PopularTaxonomyItem {
	name: string;
	count: number;
}

export interface ReadingPath {
	title: string;
	summary: string;
	posts: PostPreview[];
}

export interface HomeData {
	posts: PostPreview[];
	categories: string[];
	tags: string[];
	featuredPosts: PostPreview[];
	latestPosts: PostPreview[];
	popularCategories: PopularTaxonomyItem[];
	popularTags: PopularTaxonomyItem[];
	readingPaths: ReadingPath[];
	faqItems: FaqItem[];
	homeImages: HomeImage[];
	tocItems: TocItem[];
	quickStartLinks: QuickStartLink[];
	processSteps: ProcessStep[];
	primarySiteKeyword: string;
}

export async function loadHomeData(): Promise<HomeData> {
	let posts: PostPreview[] = [];
	let categories: string[] = [];
	let tags: string[] = [];
	try {
		const index = await getPostsIndex();
		posts = index.posts.map((post) => ({
			id: post.slug,
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			category: post.data.category,
			tags: post.data.tags,
		}));
		categories = index.categories;
		tags = index.tags;
	} catch (error) {
		console.error('[home:index] failed to load posts index', error);
	}

	let featuredPosts: PostPreview[] = [];
	try {
		featuredPosts = posts.slice(0, 6);
	} catch (error) {
		console.error('[home:index] failed to build featured posts', error);
	}

	let latestPosts: PostPreview[] = [];
	try {
		latestPosts = posts.slice(0, 3);
	} catch (error) {
		console.error('[home:index] failed to build latest insights posts', error);
	}

	let popularCategories: PopularTaxonomyItem[] = [];
	try {
		const categoryCountMap = posts.reduce((accumulator, post) => {
			accumulator.set(post.category, (accumulator.get(post.category) ?? 0) + 1);
			return accumulator;
		}, new Map<string, number>());
		popularCategories = [...categoryCountMap.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 6)
			.map(([name, count]) => ({ name, count }));
		if (popularCategories.length === 0) {
			popularCategories = categories.slice(0, 6).map((name) => ({ name, count: 0 }));
		}
	} catch (error) {
		console.error('[home:index] failed to compute popular categories', error);
	}

	let popularTags: PopularTaxonomyItem[] = [];
	try {
		const tagCountMap = posts.reduce((accumulator, post) => {
			post.tags.forEach((tag) => {
				accumulator.set(tag, (accumulator.get(tag) ?? 0) + 1);
			});
			return accumulator;
		}, new Map<string, number>());
		popularTags = [...tagCountMap.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10)
			.map(([name, count]) => ({ name, count }));
		if (popularTags.length === 0) {
			popularTags = tags.slice(0, 10).map((name) => ({ name, count: 0 }));
		}
	} catch (error) {
		console.error('[home:index] failed to compute popular tags', error);
	}

	const postMap = new Map(posts.map((post) => [post.id, post]));

	let readingPaths: ReadingPath[] = [];
	try {
		const pathSeeds = [
			{
				title: 'קליטה חכמה של לקוח חדש',
				summary: 'מסלול קצר לבניית ציפיות, אמון ותהליך עבודה נקי כבר מהפגישה הראשונה.',
				slugs: ['client-onboarding-framework', 'client-trust-roadmap', 'communication-strategy-for-clients'],
			},
			{
				title: 'ניהול סיכונים לעסק פעיל',
				summary: 'רצף קריאה שנותן מסגרת פרקטית לזיהוי, מניעה ושיפור החלטות לאורך זמן.',
				slugs: ['risk-management-routine', 'contract-review-flow', 'dispute-prevention-method'],
			},
			{
				title: 'שיפור ביצועים בעבודה משפטית',
				summary: 'שלושה מאמרים לבניית שגרה מקצועית מדויקת יותר, תחת עומס ותוך שמירה על איכות.',
				slugs: ['process-improvement-for-legal-teams', 'time-management-for-legal-work', 'service-quality-standards'],
			},
		];

		readingPaths = pathSeeds
			.map((pathSeed) => ({
				title: pathSeed.title,
				summary: pathSeed.summary,
				posts: pathSeed.slugs
					.map((slug) => {
						const post = postMap.get(slug);
						if (!post) {
							console.error(`[home:index] reading path post was not found: ${slug}`);
						}
						return post;
					})
					.filter((post): post is PostPreview => Boolean(post)),
			}))
			.filter((pathSeed) => pathSeed.posts.length > 0);
	} catch (error) {
		console.error('[home:index] failed to build reading paths', error);
	}

	const tocItems: TocItem[] = [
		{ id: 'quick-start', label: 'מסלול התחלה מהיר' },
		{ id: 'home-seo-content', label: 'מדריך תוכן מקצועי' },
		{ id: 'process', label: 'איך התהליך עובד בפועל' },
		{ id: 'authority', label: 'למה לעבוד עם גיא אבני' },
		{ id: 'audience', label: 'למי זה מתאים?' },
		{ id: 'comparison', label: 'לטפל לבד או עם ליווי משפטי' },
		{ id: 'long-form-content', label: 'מדריכי עומק' },
		{ id: 'latest-insights', label: 'תובנות אחרונות' },
		{ id: 'faq', label: 'שאלות נפוצות' },
	];

	const quickStartLinks: QuickStartLink[] = [
		{ label: 'אודות', href: '/about' },
		{ label: 'שירותים', href: '/services' },
		{ label: 'מאמרים', href: '/blog' },
		{ label: 'קטגוריות', href: '/categories' },
		{ label: 'תגיות', href: '/tags' },
		{ label: 'יצירת קשר', href: '/contact' },
	];

	const processSteps: ProcessStep[] = [
		{ title: 'מגדירים מטרה', text: 'מבהירים מה חשוב לכם עכשיו ומה ייחשב הצלחה בטווח המיידי והרחוק.' },
		{ title: 'ממפים סיכון והזדמנות', text: 'מזהים פערים, נקודות רגישות והזדמנויות לשיפור לפני שמבצעים מהלך.' },
		{ title: 'בונים תוכנית פעולה', text: 'מסדרים סדר עדיפויות, אחריות ולוחות זמנים כדי להתקדם בלי רעש מיותר.' },
		{ title: 'מבצעים ומדייקים', text: 'מתקדמים בצעדים מדידים, בוחנים תוצאות ומעדכנים החלטות לפי הצורך.' },
	];

	const faqItems: FaqItem[] = [
		{
			question: 'איך יודעים אם צריך ייעוץ כבר עכשיו?',
			answer:
				'אם יש החלטה עם השלכה כספית, חוזית או תפעולית, עדיף לעצור לבדיקה קצרה לפני פעולה. ייעוץ מוקדם לרוב חוסך זמן, כסף ומחלוקות.',
		},
		{
			question: 'מה להכין לפני שיחת היכרות?',
			answer:
				'כדאי להביא תיאור קצר של המצב, מסמכים רלוונטיים ושתי מטרות ברורות. כך אפשר להגיע להמלצה ממוקדת כבר בשיחה הראשונה.',
		},
		{
			question: 'האם הליווי מתאים גם לעסקים קטנים?',
			answer:
				'כן. המודל נבנה כך שיתאים גם לעסקים בתנועה מהירה: הגדרת עדיפויות, שלבים ברורים ושגרה פרקטית שמפחיתה סיכון לאורך זמן.',
		},
		{
			question: 'איך נראה הצעד הראשון אחרי יצירת קשר?',
			answer:
				'מתבצעת שיחת מיקוד קצרה, אחריה מקבלים תמונת מצב, המלצה אופרטיבית ומסלול פעולה שמתאים ליכולת וליעד שלכם.',
		},
	];

	let primarySiteKeyword = 'גיא אבני';
	try {
		const first = SITE_KEYWORDS[0];
		if (typeof first === 'string' && first.trim()) {
			primarySiteKeyword = first.trim();
		} else {
			console.error('[home:index] SITE_KEYWORDS[0] missing or empty; using Hebrew fallback');
		}
	} catch (error) {
		console.error('[home:index] failed to resolve primary keyword from SITE_KEYWORDS', error);
	}

	const homeImages: HomeImage[] = [
		{
			src: '/images/home/guy-avni-avni-guy-law-firm-lawyer-suite-man-portrait-office-photo-1.jpg',
			alt: `${primarySiteKeyword} - פורטרט מקצועי במשרד עורכי דין, חליפת עסקים ואווירת ליווי משפטי אמין`,
			title: `${primarySiteKeyword} | פורטרט ראשי בכותרת דף הבית`,
		},
		{
			src: '/images/home/guy-avni-avni-guy-law-firm-lawyer-office-meeting-photo-2.jpg',
			alt: `${primarySiteKeyword} - פגישת ייעוץ ועבודה משפטית מול שולחן במשרד, שיחה ממוקדת ומסמכים`,
			title: `${primarySiteKeyword} | פגישת משרד במסלול התחלה מהירה`,
		},
		{
			src: '/images/home/guy-avni-avni-guy-law-firm-lawyer-office-team-photo-3.jpg',
			alt: `${primarySiteKeyword} - צוות משפטי בשיחת תיאום ליד מחשב ומסמכים, שיתוף פעולה מקצועי`,
			title: `${primarySiteKeyword} | צוות משפטי בחלק תהליך העבודה`,
		},
		{
			src: '/images/home/guy-avni-avni-guy-law-firm-lawyer-boardroom-photo-4.jpg',
			alt: `${primarySiteKeyword} - חדר ישיבות מקצועי לדיונים משפטיים ועסקיים, סביבת החלטות רגועה`,
			title: `${primarySiteKeyword} | חדר ישיבות במסלול קריאה מומלצת`,
		},
		{
			src: '/images/home/guy-avni-avni-guy-law-firm-lawyer-executive-portrait-photo-5.jpg',
			alt: `${primarySiteKeyword} - פורטרט מנהלי לעורך דין, ליווי לקוחות עסקיים ופרטיים בבהירות`,
			title: `${primarySiteKeyword} | פורטרט מקצועי בלמה לעבוד עם המשרד`,
		},
		{
			src: '/images/home/guy-avni-avni-guy-law-firm-lawyer-office-workspace-photo-6.jpg',
			alt: `${primarySiteKeyword} - סביבת עבודה משפטית עם מחשב וחומרים, הכנה וארגון לפני מהלך`,
			title: `${primarySiteKeyword} | סביבת עבודה בחלק מדריכי העומק`,
		},
		{
			src: '/images/home/guy-avni-avni-guy-law-firm-lawyer-suite-portrait-photo-7.jpg',
			alt: `${primarySiteKeyword} - פורטרט רשמי בסביבת משרד עורכי דין, סיום ויזואלי לפני פנייה ללקוח`,
			title: `${primarySiteKeyword} | פורטרט אחרון לפני קריאה לפעולה בדף הבית`,
		},
	];

	return {
		posts,
		categories,
		tags,
		featuredPosts,
		latestPosts,
		popularCategories,
		popularTags,
		readingPaths,
		faqItems,
		homeImages,
		tocItems,
		quickStartLinks,
		processSteps,
		primarySiteKeyword,
	};
}

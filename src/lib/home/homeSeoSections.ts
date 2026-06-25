import type { HomeImage } from '@/lib/home/loadHomeData';

export type HomeSeoSectionDef = {
	id: string;
	title: string;
	imageIndex: number;
};

export const HOME_SEO_SECTION_DEFS: HomeSeoSectionDef[] = [
	{ id: 'seo-practice-areas', title: 'תחומי ליווי משפטי לפרטיים ולעסקים', imageIndex: 1 },
	{ id: 'seo-israel-context', title: 'ייעוץ משפטי בישראל - הקשר המקומי', imageIndex: 2 },
	{ id: 'seo-when-to-call', title: 'מתי כדאי לפנות לעורך דין לפני מהלך', imageIndex: 3 },
	{ id: 'seo-transparency', title: 'שקיפות, זמינות ותיאום ציפיות', imageIndex: 4 },
	{ id: 'seo-real-estate', title: 'נדל״ן ועסקאות - מבט משפטי מעשי', imageIndex: 5 },
	{ id: 'seo-choosing-lawyer', title: 'איך בוחרים עורך דין מתאים', imageIndex: 6 },
	{ id: 'seo-ethics', title: 'אתיקה מקצועית והחלטות אחראיות', imageIndex: 7 },
	{ id: 'seo-documents', title: 'מסמכים שכדאי להכין מראש', imageIndex: 8 },
	{ id: 'seo-counsel-vs-representation', title: 'ייעוץ מול ייצוג - מה ההבדל בפועל', imageIndex: 9 },
	{ id: 'seo-first-contact', title: 'מה קורה אחרי פנייה ראשונה', imageIndex: 10 },
];

export function resolveHomeSeoSectionImages(homeImages: HomeImage[]): HomeImage[] {
	try {
		return HOME_SEO_SECTION_DEFS.map((section) => {
			const image = homeImages[section.imageIndex];
			if (!image) {
				console.error('[homeSeoSections] missing image for section', {
					sectionId: section.id,
					imageIndex: section.imageIndex,
				});
				return (
					homeImages[0] ?? {
						src: '/images/home/home-hero-legal-contract-super-macro-photo-0.jpg',
						alt: 'גיא אבני - תמונת משרד עורכי דין',
						title: 'גיא אבני | תמונת משרד',
					}
				);
			}
			return image;
		});
	} catch (err) {
		console.error('[homeSeoSections] resolveHomeSeoSectionImages failed', err);
		return [];
	}
}

import type { HomeImage } from '@/lib/home/loadHomeData';

export type HomeSeoSectionDef = {
	id: string;
	title: string;
	imageIndex: number;
};

export const HOME_SEO_SECTION_DEFS: HomeSeoSectionDef[] = [
	{ id: 'seo-practice-areas', title: 'תחומי ליווי משפטי לפרטיים ולעסקים', imageIndex: 0 },
	{ id: 'seo-israel-context', title: 'ייעוץ משפטי בישראל - הקשר המקומי', imageIndex: 1 },
	{ id: 'seo-when-to-call', title: 'מתי כדאי לפנות לעורך דין לפני מהלך', imageIndex: 2 },
	{ id: 'seo-transparency', title: 'שקיפות, זמינות ותיאום ציפיות', imageIndex: 3 },
	{ id: 'seo-real-estate', title: 'נדל״ן ועסקאות - מבט משפטי מעשי', imageIndex: 4 },
	{ id: 'seo-choosing-lawyer', title: 'איך בוחרים עורך דין מתאים', imageIndex: 5 },
	{ id: 'seo-ethics', title: 'אתיקה מקצועית והחלטות אחראיות', imageIndex: 0 },
	{ id: 'seo-documents', title: 'מסמכים שכדאי להכין מראש', imageIndex: 1 },
	{ id: 'seo-counsel-vs-representation', title: 'ייעוץ מול ייצוג - מה ההבדל בפועל', imageIndex: 2 },
	{ id: 'seo-first-contact', title: 'מה קורה אחרי פנייה ראשונה', imageIndex: 3 },
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
						src: '/images/home/guy-avni-avni-guy-law-firm-lawyer-suite-man-portrait-office-photo-1.jpg',
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

import { HomePage } from '@/components/home/HomePage';
import { SiteShell } from '@/components/layout/SiteShell';
import { SITE_URL } from '@/consts';
import { loadHomeData } from '@/lib/home/loadHomeData';
import { buildPageMetadata } from '@/lib/metadata';
import { buildPersonSchema, readPersonSameAsUrls } from '@/lib/seo/schema-person';
import { attachSpeakable } from '@/lib/seo/speakable';
import {
	buildBreadcrumbSchema,
	buildFaqSchema,
	buildHomeWebPageSchema,
	buildItemListSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const HOME_OG_IMAGE = `${SITE_URL}/images/home/home-hero-legal-contract-super-macro-photo-0.jpg`;
const HOME_DATE_MODIFIED = '2026-11-08';

export const metadata = buildPageMetadata({
	title: 'משרד גיא אבני · מאמרים, שירותים וייעוץ',
	description:
		'עו״ד גיא אבני (גיא אבני עורך דין) - מאמרים משפטיים בעברית, שירותים לפרטיים ולעסקים, ומסלול ברור לפגישת ייעוץ ראשונה. האתר הרשמי של המשרד.',
	keyword: 'גיא אבני',
	keywords: ['גיא אבני', 'גיא אבני עורך דין', 'גיא אבני עו״ד', 'גיא אבני משרד עורכי דין'],
	path: '/',
	image: HOME_OG_IMAGE,
	absoluteTitle: true,
});

export default async function Home() {
	const data = await loadHomeData();

	const featuredListItems = data.featuredPosts.map((post) => ({
		name: post.title,
		url: new URL(`/blog/${post.id}/`, SITE_URL).toString(),
	}));

	const sameAs = readPersonSameAsUrls();
	const homeBreadcrumbItems = [{ name: 'דף הבית', path: '/' }];
	const jsonLd = [
		buildBreadcrumbSchema(homeBreadcrumbItems),
		attachSpeakable(
			buildHomeWebPageSchema({
				name: 'משרד גיא אבני · מאמרים, שירותים וייעוץ',
				description:
					'עו״ד גיא אבני (גיא אבני עורך דין) מלווה פרטיים ועסקים. מאמרים, שירותים וייעוץ ראשון.',
				dateModified: HOME_DATE_MODIFIED,
			}),
		),
		buildPersonSchema({ sameAs: sameAs.length ? sameAs : undefined }),
		// FAQ kept for Bing/entity understanding — not Google HowTo/FAQ theater (F12/F13).
		buildFaqSchema(data.faqItems),
		...(featuredListItems.length > 0 ? [buildItemListSchema(featuredListItems)] : []),
		// HowTo JSON-LD removed: Google HowTo rich results deprecated 2023; process HTML remains (F12).
	];

	return (
		<SiteShell currentPath="/" extraJsonLd={jsonLd}>
			<HomePage {...data} lastUpdatedLabel="יולי 2026" />
		</SiteShell>
	);
}

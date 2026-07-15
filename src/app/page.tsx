import { HomePage } from '@/components/home/HomePage';
import { SiteShell } from '@/components/layout/SiteShell';
import { SITE_URL } from '@/consts';
import { loadHomeData } from '@/lib/home/loadHomeData';
import { buildPageMetadata } from '@/lib/metadata';
import {
	buildFaqSchema,
	buildHomeWebPageSchema,
	buildHowToSchema,
	buildItemListSchema,
} from '@/utils/structured-data';

export const dynamic = 'force-static';

const HOME_OG_IMAGE = `${SITE_URL}/images/home/home-hero-legal-contract-super-macro-photo-0.jpg`;
const HOME_DATE_MODIFIED = '2026-07-09';

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

	const jsonLd = [
		buildHomeWebPageSchema({
			name: 'משרד גיא אבני · מאמרים, שירותים וייעוץ',
			description:
				'עו״ד גיא אבני (גיא אבני עורך דין) מלווה פרטיים ועסקים. מאמרים, שירותים וייעוץ ראשון.',
			dateModified: HOME_DATE_MODIFIED,
		}),
		buildFaqSchema(data.faqItems),
		...(featuredListItems.length > 0 ? [buildItemListSchema(featuredListItems)] : []),
		buildHowToSchema({
			name: 'כך עובד התהליך כשמדברים עם גיא אבני עורך דין',
			description: 'מסלול מודולרי: מטרה, מיפוי, תוכנית וביצוע.',
			steps: data.processSteps.map((step) => ({ name: step.title, text: step.text })),
		}),
	];

	return (
		<SiteShell currentPath="/" extraJsonLd={jsonLd}>
			<HomePage {...data} lastUpdatedLabel="יולי 2026" />
		</SiteShell>
	);
}

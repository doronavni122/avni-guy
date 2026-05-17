import { HomePage } from '@/components/home/HomePage';
import { SiteShell } from '@/components/layout/SiteShell';
import { loadHomeData } from '@/lib/home/loadHomeData';
import { buildPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbSchema, buildFaqSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: 'גיא אבני | בית למאמרים משפטיים וליווי מקצועי',
	description:
		'גיא אבני מרכז כאן מאמרים משפטיים בעברית, שירותים לפרטיים ולעסקים, ומסלול ברור לפגישת ייעוץ ראשונה בעורך הדין.',
	keyword: 'גיא אבני',
	path: '/',
});

export default async function Home() {
	const data = await loadHomeData();
	const jsonLd = [buildBreadcrumbSchema([{ name: 'דף הבית', path: '/' }]), buildFaqSchema(data.faqItems)];

	return (
		<SiteShell extraJsonLd={jsonLd}>
			<HomePage {...data} />
		</SiteShell>
	);
}

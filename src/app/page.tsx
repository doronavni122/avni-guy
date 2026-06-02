import { HomePage } from '@/components/home/HomePage';
import { SiteShell } from '@/components/layout/SiteShell';
import { SITE_TITLE } from '@/consts';
import { loadHomeData } from '@/lib/home/loadHomeData';
import { buildPageMetadata } from '@/lib/metadata';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { buildBreadcrumbSchema, buildFaqSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

export const metadata = buildPageMetadata({
	title: SITE_TITLE,
	description:
		'גיא אבני מרכז כאן מאמרים משפטיים בעברית, שירותים לפרטיים ולעסקים, ומסלול ברור לפגישת ייעוץ ראשונה. האתר מחבר בין קריאה לבין תיאום שיחה ממוקדת.',
	keyword: 'גיא אבני',
	path: '/',
});

export default async function Home() {
	const data = await loadHomeData();
	const breadcrumbItems = [{ name: 'דף הבית', path: '/' }];
	const jsonLd = [buildBreadcrumbSchema(breadcrumbItems), buildFaqSchema(data.faqItems)];

	return (
		<SiteShell currentPath="/" extraJsonLd={jsonLd}>
			<div className="mb-6">
				<BreadcrumbNav items={breadcrumbItems} />
			</div>
			<HomePage {...data} />
		</SiteShell>
	);
}

import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { SiteShell } from '@/components/layout/SiteShell';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';
import { SITE_URL } from '@/consts';
import { buildPageMetadata } from '@/lib/metadata';
import { buildPersonSchema, readPersonSameAsUrls } from '@/lib/seo/schema-person';
import {
	getPracticeBridge,
	type PracticeBridgeDef,
} from '@/lib/seo/practice-bridge-pages';
import { buildBreadcrumbSchema, buildWebPageSchema } from '@/utils/structured-data';

export const dynamic = 'force-static';

function requireBridge(path: string): PracticeBridgeDef {
	const found = getPracticeBridge(path);
	if (!found) {
		console.error('[practice-bridge] missing def', { path });
		throw new Error(`practice bridge missing ${path}`);
	}
	return found;
}

const def = requireBridge('/nedlan-lawyer-guy-avni/');

export const metadata = buildPageMetadata({
	title: def.title,
	description: def.description,
	keyword: def.keyword,
	path: def.path,
	absoluteTitle: true,
});

export default function PracticeBridgePage() {
	const breadcrumbItems = [
		{ name: 'דף הבית', path: '/' },
		{ name: def.h1, path: def.path },
	];
	const sameAs = readPersonSameAsUrls();
	const jsonLd = [
		buildBreadcrumbSchema(breadcrumbItems),
		buildWebPageSchema({
			'@id': `${SITE_URL}${def.path}#webpage`,
			url: `${SITE_URL}${def.path}`,
			name: def.title,
			description: def.description,
			dateModified: '2026-07-14',
		}),
		buildPersonSchema({ sameAs: sameAs.length ? sameAs : undefined }),
	];

	return (
		<SiteShell currentPath={def.path} extraJsonLd={jsonLd}>
			<div className="flex flex-col gap-10">
				<BreadcrumbNav items={breadcrumbItems} />
				<header className="flex max-w-3xl flex-col gap-3">
					<p className="swiss-label">{def.subtitle}</p>
					<h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
						{def.h1}
					</h1>
				</header>
				<PageSection>
					<div className="flex max-w-3xl flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
						{def.intro.map((paragraph) => (
							<p key={paragraph.slice(0, 32)}>{paragraph}</p>
						))}
					</div>
					<ul className="mt-8 flex max-w-3xl list-disc flex-col gap-2 pr-6 text-muted-foreground">
						{def.nextLinks.map((link) => (
							<li key={link.href}>
								<Link className="link-underline" href={link.href}>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</PageSection>
			</div>
		</SiteShell>
	);
}

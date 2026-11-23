import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildLeanPersonSchema, SITE_PERSON_ID } from '@/lib/seo/schema-person';
import { cn } from '@/lib/utils';
import {
	buildJsonLdGraph,
	buildOrganizationSchema,
	buildWebSiteJsonLd,
} from '@/utils/structured-data';

type SiteShellProps = {
	children: ReactNode;
	currentPath: string;
	extraJsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function graphHasPersonId(nodes: Record<string, unknown>[]): boolean {
	try {
		return nodes.some((node) => node['@id'] === SITE_PERSON_ID);
	} catch (err) {
		console.error('[SiteShell] graphHasPersonId failed', { err });
		return false;
	}
}

export function SiteShell({ children, currentPath, extraJsonLd }: SiteShellProps) {
	const extras = extraJsonLd ? (Array.isArray(extraJsonLd) ? extraJsonLd : [extraJsonLd]) : [];
	const nodes = [
		buildOrganizationSchema(),
		buildWebSiteJsonLd(),
		...(graphHasPersonId(extras) ? [] : [buildLeanPersonSchema()]),
		...extras,
	];
	const jsonLdGraph = buildJsonLdGraph(nodes);

	return (
		<>
			<JsonLd data={jsonLdGraph} />
			<Header currentPath={currentPath} />
			<main className="flex flex-1 flex-col">
				<div className="mx-auto w-full max-w-screen-xl flex-1 px-4 sm:px-6 lg:px-10">
					<div
						className={cn(
							'page-enter flex-1 border-x border-border px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20',
						)}
					>
						{children}
					</div>
				</div>
			</main>
			<Footer />
			{process.env.NODE_ENV === 'production' ? <Analytics /> : null}
		</>
	);
}

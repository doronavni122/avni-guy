import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildOrganizationSchema, buildWebSiteJsonLd } from '@/utils/structured-data';

type SiteShellProps = {
	children: ReactNode;
	extraJsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function SiteShell({ children, extraJsonLd }: SiteShellProps) {
	const globalJsonLd = [buildOrganizationSchema(), buildWebSiteJsonLd(), ...(extraJsonLd ? (Array.isArray(extraJsonLd) ? extraJsonLd : [extraJsonLd]) : [])];

	return (
		<>
			<JsonLd data={globalJsonLd} />
			<Header />
			<main className="flex flex-1 flex-col">
				<div className="container mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:py-16">{children}</div>
			</main>
			<Footer />
			{process.env.NODE_ENV === 'production' ? <Analytics /> : null}
		</>
	);
}

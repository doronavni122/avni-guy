import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildOrganizationSchema, buildWebSiteJsonLd } from '@/utils/structured-data';
import { cn } from '@/lib/utils';

type SiteShellProps = {
	children: ReactNode;
	currentPath: string;
	extraJsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function SiteShell({ children, currentPath, extraJsonLd }: SiteShellProps) {
	const globalJsonLd = [buildOrganizationSchema(), buildWebSiteJsonLd(), ...(extraJsonLd ? (Array.isArray(extraJsonLd) ? extraJsonLd : [extraJsonLd]) : [])];

	return (
		<>
			<JsonLd data={globalJsonLd} />
			<Header currentPath={currentPath} />
			<main className="flex flex-1 flex-col">
				<div
					className={cn(
						'page-enter mx-auto w-full max-w-screen-xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16',
					)}
				>
					{children}
				</div>
			</main>
			<Footer />
			{process.env.NODE_ENV === 'production' ? <Analytics /> : null}
		</>
	);
}

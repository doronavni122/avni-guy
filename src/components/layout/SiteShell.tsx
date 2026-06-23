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

import type { Metadata } from 'next';
import { Assistant, Frank_Ruhl_Libre } from 'next/font/google';
import '@/styles/global.css';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/consts';
import { cn } from '@/lib/utils';

const assistant = Assistant({
	subsets: ['hebrew', 'latin'],
	variable: '--font-sans',
	display: 'swap',
	weight: ['400', '500', '600', '700'],
});

const frankRuhl = Frank_Ruhl_Libre({
	subsets: ['hebrew', 'latin'],
	variable: '--font-serif',
	display: 'swap',
	weight: ['400', '500', '700', '800', '900'],
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_TITLE,
		template: `%s | ${SITE_TITLE}`,
	},
	description: SITE_DESCRIPTION,
};

/** Applies the persisted theme before paint to avoid a flash. */
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
	const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

	return (
		<html
			lang="he"
			dir="rtl"
			suppressHydrationWarning
			className={cn(assistant.variable, frankRuhl.variable, 'bg-background font-sans')}
		>
			<head>
				{/* eslint-disable-next-line react/no-danger */}
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
				<link rel="icon" type="image/svg+xml" href="/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-favicon.svg" />
				<link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/rss.xml" />
				<meta name="theme-color" content="#f5f0e6" media="(prefers-color-scheme: light)" />
				<meta name="theme-color" content="#2b2722" media="(prefers-color-scheme: dark)" />
				{googleVerification ? <meta name="google-site-verification" content={googleVerification} /> : null}
				{bingVerification ? <meta name="msvalidate.01" content={bingVerification} /> : null}
			</head>
			<body className={cn(assistant.className, 'flex min-h-dvh flex-col')}>{children}</body>
		</html>
	);
}

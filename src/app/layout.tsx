import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/global.css';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/consts';
import { cn } from '@/lib/utils';

const geistSans = Geist({
	subsets: ['latin'],
	variable: '--font-sans',
	display: 'swap',
});

const geistMono = Geist_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
	display: 'swap',
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_TITLE,
		template: `%s | ${SITE_TITLE}`,
	},
	description: SITE_DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
	const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

	return (
		<html
			lang="he"
			dir="rtl"
			className={cn(geistSans.variable, geistMono.variable, 'scroll-smooth font-sans')}
		>
			<head>
				<link rel="icon" type="image/svg+xml" href="/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-favicon.svg" />
				<link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/rss.xml" />
				<meta name="theme-color" content="#1b4d3e" />
				{googleVerification ? <meta name="google-site-verification" content={googleVerification} /> : null}
				{bingVerification ? <meta name="msvalidate.01" content={bingVerification} /> : null}
			</head>
			<body className={cn(geistSans.className, 'flex min-h-dvh flex-col antialiased')}>{children}</body>
		</html>
	);
}

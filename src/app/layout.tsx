import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/global.css';
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from '@/consts';

const atkinson = localFont({
	src: [
		{ path: '../assets/fonts/atkinson-regular.woff', weight: '400', style: 'normal' },
		{ path: '../assets/fonts/atkinson-bold.woff', weight: '700', style: 'normal' },
	],
	variable: '--font-atkinson',
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
		<html lang="he" dir="rtl" className={`${atkinson.variable} scroll-smooth`}>
			<head>
				<link rel="icon" type="image/svg+xml" href="/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-favicon.svg" />
				<link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/rss.xml" />
				<meta name="theme-color" content="#1b4d3e" />
				{googleVerification ? <meta name="google-site-verification" content={googleVerification} /> : null}
				{bingVerification ? <meta name="msvalidate.01" content={bingVerification} /> : null}
			</head>
			<body className="flex min-h-dvh flex-col antialiased font-sans">{children}</body>
		</html>
	);
}

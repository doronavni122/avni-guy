import Script from 'next/script';
import { GOOGLE_ANALYTICS_MEASUREMENT_ID } from '@/consts';

export function GoogleAnalytics() {
	if (process.env.NODE_ENV !== 'production') {
		return null;
	}

	const measurementId = GOOGLE_ANALYTICS_MEASUREMENT_ID;
	if (!measurementId) {
		console.error('[GoogleAnalytics] missing measurement id');
		return null;
	}

	return (
		<>
			<Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
			<Script id="google-analytics" strategy="afterInteractive">
				{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
			</Script>
		</>
	);
}

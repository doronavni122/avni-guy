import { permanentRedirect } from 'next/navigation';

export const dynamic = 'force-static';

/** Thin practice landing disposed — consolidate into services hub (008 thin-practice-landings). */
export default function NedlanPracticeLandingRedirectPage() {
	console.info('[nedlan-lawyer-guy-avni] permanentRedirect → /services/');
	permanentRedirect('/services/');
}

import Link from 'next/link';
import { OptimizedImage } from '@/components/media/OptimizedImage';
import { SITE_CONTACT_EMAIL } from '@/consts';

const ATTORNEY_NAME = 'גיא אבני';
const ATTORNEY_TITLE = 'עורך דין';
const ATTORNEY_PHOTO = '/images/shared/guy-avni-avni-guy-law-firm-lawyer-og-law-fallback-photo-1.jpg';

function readIsraelBarUrl(): string | undefined {
	try {
		const url = process.env.PERSON_ISRAEL_BAR_URL?.trim();
		return url?.startsWith('http') ? url : undefined;
	} catch (err) {
		console.error('[AttorneyCredentialBlock] readIsraelBarUrl failed', { err });
		return undefined;
	}
}

function readPublicEnv(key: string): string | undefined {
	try {
		const v = process.env[key]?.trim();
		return v || undefined;
	} catch (err) {
		console.error('[AttorneyCredentialBlock] readPublicEnv failed', { key, err });
		return undefined;
	}
}

export function AttorneyCredentialBlock() {
	const israelBarUrl = readIsraelBarUrl();
	const officeLocality = readPublicEnv('NEXT_PUBLIC_OFFICE_LOCALITY') ?? 'ישראל';
	const officePhone = readPublicEnv('NEXT_PUBLIC_OFFICE_PHONE');
	const officeStreet = readPublicEnv('NEXT_PUBLIC_OFFICE_STREET');
	const barLicenseId = readPublicEnv('NEXT_PUBLIC_BAR_LICENSE_ID');

	return (
		<section
			id="person"
			className="mt-8 flex max-w-3xl flex-col gap-5 sm:flex-row-reverse sm:items-start"
			aria-labelledby="attorney-credential-title"
		>
			<OptimizedImage
				src={ATTORNEY_PHOTO}
				alt={`${ATTORNEY_NAME} ${ATTORNEY_TITLE} - תמונת פרופיל מקצועית`}
				title={`${ATTORNEY_NAME} ${ATTORNEY_TITLE}`}
				width={160}
				height={160}
				className="mx-auto h-40 w-40 shrink-0 border border-border object-cover sm:mx-0"
			/>
			<div className="flex flex-col gap-3 text-right">
				<span className="swiss-label">יישות מקצועית</span>
				<h2 id="attorney-credential-title" className="font-heading text-xl font-semibold text-foreground">
					{ATTORNEY_NAME}, {ATTORNEY_TITLE}
				</h2>
				<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
					עורך דין ישראלי, רישיון לשכת עורכי הדין
					{barLicenseId ? ` (מס׳ רישיון ${barLicenseId})` : ''}. מלווה פרטיים ועסקים בנדל״ן, מיסוי מקרקעין,
					חוזים וליטיגציה אזרחית. ניסיון מעשי בשטח, שקיפות בפגישת מיקוד, וסיכומים ברורים אחרי כל שיחה.
				</p>
				<address className="not-italic text-sm leading-relaxed text-muted-foreground" id="office-nap">
					{officeStreet ? <span className="block">{officeStreet}</span> : null}
					<span className="block">{officeLocality}</span>
					{officePhone ? (
						<a className="link-underline block" href={`tel:${officePhone.replace(/\s+/g, '')}`}>
							{officePhone}
						</a>
					) : null}
					<a className="link-underline block" href={`mailto:${SITE_CONTACT_EMAIL}`}>
						{SITE_CONTACT_EMAIL}
					</a>
				</address>
				{israelBarUrl ? (
					<p className="text-sm text-muted-foreground">
						<Link className="link-underline" href={israelBarUrl} rel="noopener noreferrer" target="_blank">
							פרופיל בלשכת עורכי הדין
						</Link>
					</p>
				) : null}
			</div>
		</section>
	);
}

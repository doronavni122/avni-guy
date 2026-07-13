import Link from 'next/link';
import { OptimizedImage } from '@/components/media/OptimizedImage';

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

export function AttorneyCredentialBlock() {
	const israelBarUrl = readIsraelBarUrl();

	return (
		<section
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
					עורך דין ישראלי, רישיון לשכת עורכי הדין. מלווה פרטיים ועסקים בנדל״ן, מיסוי מקרקעין, חוזים וליטיגציה
					אזרחית. ניסיון מעשי בשטח, שקיפות בפגישת מיקוד, וסיכומים ברורים אחרי כל שיחה.
				</p>
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

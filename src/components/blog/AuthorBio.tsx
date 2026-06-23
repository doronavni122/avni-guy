import Link from 'next/link';
import { OptimizedImage } from '@/components/media/OptimizedImage';

const AUTHOR_NAME = 'גיא אבני';
const AUTHOR_TITLE = 'עורך דין';
const AUTHOR_LOGO = '/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-logo.svg';

export function AuthorBio() {
	return (
		<section
			className="flex flex-col gap-5 border border-border bg-card p-8 text-right sm:flex-row-reverse sm:items-start"
			aria-labelledby="author-bio-title"
		>
			<OptimizedImage
				src={AUTHOR_LOGO}
				alt={`${AUTHOR_NAME} ${AUTHOR_TITLE} - לוגו המשרד`}
				title={`${AUTHOR_NAME} ${AUTHOR_TITLE}`}
				width={96}
				height={96}
				className="mx-auto h-24 w-24 shrink-0 border border-border bg-background object-contain p-3 sm:mx-0"
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-3">
				<span className="swiss-label">הכותב / Author</span>
				<h2 id="author-bio-title" className="font-heading text-xl font-semibold text-foreground">
					על {AUTHOR_NAME}, {AUTHOR_TITLE}
				</h2>
				<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
					{AUTHOR_NAME} מלווה לקוחות בעסקאות נדל&quot;ן, חוזים וייצוג מול רשויות, עם דגש על שקיפות, תיעוד מסודר
					והחלטות מבוססות ניסיון מהשטח. המידע במאמרים באתר אינו תחליף לייעוץ משפטי אישי.
				</p>
				<div className="mt-1 flex flex-wrap justify-end gap-x-5 gap-y-2 border-t border-border pt-3 text-sm">
					<Link className="link-underline" href="/about/">
						רקע מקצועי וערכי עבודה
					</Link>
					<Link className="link-underline" href="/services/">
						תחומי שירות
					</Link>
					<Link className="link-underline" href="/contact/">
						לתיאום פגישה
					</Link>
				</div>
			</div>
		</section>
	);
}

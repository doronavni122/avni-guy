import Link from 'next/link';
import { OptimizedImage } from '@/components/media/OptimizedImage';

const AUTHOR_NAME = 'גיא אבני';
const AUTHOR_TITLE = 'עורך דין';
const AUTHOR_LOGO = '/images/branding/guy-avni-avni-guy-law-firm-lawyer-brand-logo.svg';

export function AuthorBio() {
	return (
		<section
			className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/20 p-6 text-right sm:flex-row sm:items-start"
			aria-labelledby="author-bio-title"
		>
			<OptimizedImage
				src={AUTHOR_LOGO}
				alt={`${AUTHOR_NAME} ${AUTHOR_TITLE} - לוגו המשרד`}
				title={`${AUTHOR_NAME} ${AUTHOR_TITLE}`}
				width={96}
				height={96}
				className="mx-auto h-24 w-24 shrink-0 rounded-full bg-background object-contain p-2 ring-1 ring-border/60 sm:mx-0"
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-3">
				<h2 id="author-bio-title" className="font-heading text-lg font-semibold text-foreground">
					על {AUTHOR_NAME}, {AUTHOR_TITLE}
				</h2>
				<p className="text-pretty text-sm leading-relaxed text-muted-foreground">
					{AUTHOR_NAME} מלווה לקוחות בעסקאות נדל&quot;ן, חוזים וייצוג מול רשויות, עם דגש על שקיפות, תיעוד מסודר
					והחלטות מבוססות ניסיון מהשטח. המידע במאמרים באתר אינו תחליף לייעוץ משפטי אישי.
				</p>
				<div className="flex flex-wrap justify-end gap-3 text-sm">
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about/">
						רקע מקצועי וערכי עבודה
					</Link>
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
						תחומי שירות
					</Link>
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
						לתיאום פגישה
					</Link>
				</div>
			</div>
		</section>
	);
}

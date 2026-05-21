import Image from 'next/image';
import Link from 'next/link';
import { HOME_SEO_SECTION_DEFS, resolveHomeSeoSectionImages } from '@/lib/home/homeSeoSections';
import type { HomeImage } from '@/lib/home/loadHomeData';

const linkClass = 'font-medium text-primary underline-offset-2 hover:underline';

type HomeSeoContentSectionsProps = {
	homeImages: HomeImage[];
};

export function HomeSeoContentSections({ homeImages }: HomeSeoContentSectionsProps) {
	let sectionImages: HomeImage[] = [];
	try {
		sectionImages = resolveHomeSeoSectionImages(homeImages);
		if (sectionImages.length !== HOME_SEO_SECTION_DEFS.length) {
			console.error('[HomeSeoContentSections] image count mismatch', {
				expected: HOME_SEO_SECTION_DEFS.length,
				got: sectionImages.length,
			});
		}
	} catch (err) {
		console.error('[HomeSeoContentSections] failed to resolve section images', err);
	}

	return (
		<section
			id="home-seo-content"
			className="home-anchor-target flex flex-col gap-10 text-right"
			aria-labelledby="home-seo-content-title"
		>
			<div className="flex flex-col gap-3">
				<h2 id="home-seo-content-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					מדריך תוכן מקצועי - גיא אבני עורך דין
				</h2>
				<p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
					עשרה נושאי ליבה בניסוח ברור, עם קישורים פנימיים למאמרים, קטגוריות ועמודי האתר - כדי להבין את המסלול לפני פנייה.
					הטקסטים כאן משלימים את כרטיסי המאמרים והמדריכים הקיימים בדף, ומיועדים לגולשים שמחפשים הסבר מלא בפסקה אחת לכל נושא.
				</p>
			</div>

			{HOME_SEO_SECTION_DEFS.map((section, index) => {
				const image = sectionImages[index];
				return (
					<article
						key={section.id}
						id={section.id}
						className="home-anchor-target flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8"
						aria-labelledby={`${section.id}-title`}
					>
						<h3 id={`${section.id}-title`} className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
							{section.title}
						</h3>
						{renderSectionBody(section.id)}
						{image ? (
							<figure className="overflow-hidden rounded-xl border border-border/60 bg-background/80">
								<Image
									src={image.src}
									alt={image.alt}
									title={image.title}
									width={1400}
									height={900}
									loading={index < 2 ? 'eager' : 'lazy'}
									className="h-48 w-full object-cover sm:h-56"
								/>
							</figure>
						) : null}
					</article>
				);
			})}
		</section>
	);
}

function renderSectionBody(sectionId: string) {
	switch (sectionId) {
		case 'seo-practice-areas':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					משרד עורכי דין שמלווה פרטיים ועסקים צריך לחבר בין אסטרטגיה, חוזים ותקשורת ברורה - בין תביעה אזרחית, מו״מ מסחרי
					וליווי שוטף של החלטות הנהלה. בעמוד{' '}
					<Link className={linkClass} href="/services/">
						שירותי גיא אבני
					</Link>{' '}
					תמצאו מסלולי ייעוץ, ליווי מסמכים ומעקב שוטף; במאמר{' '}
					<Link className={linkClass} href="/blog/guy-avni-business-legal-habits/">
						שגרות משפטיות לעסק
					</Link>{' '}
					תראו איך בונים הרגלים שמונעים משברים ומקטינים חשיפה לתביעות. לעומק נושאי השירות, עברו ל{' '}
					<Link className={linkClass} href="/categories/service/">
						קטגוריית שירות
					</Link>{' '}
						: נקודת פתיחה טובה לפני כל פנייה לייעוץ או ייצוג.
				</p>
			);
		case 'seo-israel-context':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					משפט ישראלי משתנה בקצב מהיר, ולכן חשוב לעבוד עם מי שמכיר דינים מקומיים, רגולציה ופרקטיקה שדה - במיוחד כשמדובר
					בחוזים, ציות וסכסוכים מול גופים מוסדיים. המדריך{' '}
					<Link className={linkClass} href="/blog/guy-avni-legal-counsel-israel-2026-guide/">
						ייעוץ משפטי בישראל 2026
					</Link>{' '}
					מסביר מתי נדרש ליווי; בנושא רישוי והבדלים מקצועיים קראו על{' '}
					<Link className={linkClass} href="/blog/guy-avni-jurist-vs-lawyer-israel-licensing-guide/">
						גישור מול עורך דין
					</Link>
					. לסינון לפי תחום, השתמשו ב{' '}
					<Link className={linkClass} href="/tags/israel-law/">
						תגית דין ישראלי
					</Link>{' '}
					ולעיון בכל המאמרים לפי נושא ב{' '}
					<Link className={linkClass} href="/categories/">
						עמוד הקטגוריות
					</Link>
					.
				</p>
			);
		case 'seo-when-to-call':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					אל תחכו למשבר: חתימה על חוזה, מחלוקת עם ספק או החלטה עם חשיפה כספית הם נקודות שבהן עצירה קצרה חוסכת זמן, כסף
					ולחץ מול בתי משפט או בוררות. המאמר{' '}
					<Link className={linkClass} href="/blog/guy-avni-meeting-preparation-checklist/">
						הכנה לפגישה משפטית
					</Link>{' '}
					מפרט מה להביא לשיחה; ב{' '}
					<Link className={linkClass} href="/blog/guy-avni-legal-planning-basics/">
						יסודות תכנון משפטי
					</Link>{' '}
					תמצאו סדר עדיפויות. כשמוכנים לדבר  - {' '}
					<Link className={linkClass} href="/contact/">
						תיאום ייעוץ ראשון
					</Link>{' '}
						, גם כשעדיין לא ברור אם נדרש ייצוג מלא.
				</p>
			);
		case 'seo-transparency':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					לקוח טוב הוא לקוח שמבין מה קורה עכשיו, מה הצעד הבא ומה לא כלול בליווי - כולל לוחות זמנים, עלויות צפויות
					ותוצרים בכל שלב. גישה זו מופיעה ב{' '}
					<Link className={linkClass} href="/about/">
						עמוד האודות של גיא אבני
					</Link>{' '}
					ובמאמר{' '}
					<Link className={linkClass} href="/blog/guy-avni-communication-strategy-for-clients/">
						אסטרטגיית תקשורת ללקוחות
					</Link>
					. לסטנדרטים שוטפים, ראו{' '}
					<Link className={linkClass} href="/blog/guy-avni-service-quality-standards/">
						סטנדרטי איכות שירות
					</Link>{' '}
					ובקטגוריית{' '}
					<Link className={linkClass} href="/categories/communication/">
						תקשורת
					</Link>{' '}
						: תחום שמזין כל הליך אזרחי או מסחרי מוצלח.
				</p>
			);
		case 'seo-real-estate':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					עסקאות נדל״ן דורשות בדיקת לוחות זמנים, אחריות מוכר ומסמכי זכויות לפני מחויבות - בין אם רוכשים דירה ראשונה
					או משקיעים בנכס מסחרי. המחקר{' '}
					<Link className={linkClass} href="/blog/guy-avni-israel-real-estate-delay-delivery-research/">
						עיכוב מסירה בנדל״ן
					</Link>{' '}
					מציג סיכונים נפוצים; לזכויות רוכשים עברו ל{' '}
					<Link className={linkClass} href="/tags/buyer-rights/">
						תגית זכויות רוכש
					</Link>
					. לכל נושאי הנדל״ן באתר:{' '}
					<Link className={linkClass} href="/categories/real-estate-law/">
						קטגוריית נדל״ן
					</Link>{' '}
						, לפני חתימה על כל התחייבות כספית משמעותית.
				</p>
			);
		case 'seo-choosing-lawyer':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					בחירת עורך דין היא לא רק מוניטין - אלא התאמה לסוג התיק, שפה ברורה ויכולת לבנות תוכנית שמכבדת את המגבלות
					שלכם. המדריך{' '}
					<Link className={linkClass} href="/blog/guy-avni-choosing-lawyer-israel-comprehensive-guide/">
						איך לבחור עורך דין בישראל
					</Link>{' '}
					מסייע בהשוואה; לסוגי התמחויות קראו{' '}
					<Link className={linkClass} href="/blog/guy-avni-lawyer-types-israel-specialties-full-guide/">
						סוגי עורכי דין והתמחויות
					</Link>
					. לעיון רחב במאמרים:{' '}
					<Link className={linkClass} href="/blog/">
						בלוג המשרד
					</Link>{' '}
					ולהשוואת גישות בין מומחים שונים בשוק.
				</p>
			);
		case 'seo-ethics':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					החלטה משפטית נכונה חייבת לעמוד גם בכללי האתיקה המקצועית וגם במטרות העסקיות שלכם, בלי קיצורי דרך שפוגעים
					באמון או בחוק. המאמר{' '}
					<Link className={linkClass} href="/blog/guy-avni-ethical-decision-making-guide/">
						קבלת החלטות אתיות
					</Link>{' '}
					מציע מסגרת מעשית; לתכנון אסטרטגי ארוך טווח עברו ל{' '}
					<Link className={linkClass} href="/blog/guy-avni-long-term-legal-strategy/">
						אסטרטגיה משפטית לטווח ארוך
					</Link>
					. נושאים דומים ב{' '}
					<Link className={linkClass} href="/categories/strategy/">
						קטגוריית אסטרטגיה
					</Link>{' '}
						: בסיס להחלטות עסקיות ואזרחיות כאחד.
				</p>
			);
		case 'seo-documents':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					תיק מסודר מקצר כל שלב: חוזים, התכתבויות, חשבוניות ופרוטוקולים שמספרים את הסיפור בבירור - גם בהליך אזרחי
					וגם בגישור או משא ומתן. המדריך{' '}
					<Link className={linkClass} href="/blog/guy-avni-document-readiness-guide/">
						מוכנות מסמכים
					</Link>{' '}
					ומסגרת{' '}
					<Link className={linkClass} href="/blog/guy-avni-positive-case-organization/">
						ארגון תיק חיובי
					</Link>{' '}
					עוזרים לפני פגישה. לניהול ראיות, ראו{' '}
					<Link className={linkClass} href="/blog/guy-avni-evidence-prioritization-framework/">
						תיעדוף ראיות
					</Link>{' '}
					וב{' '}
					<Link className={linkClass} href="/categories/documents/">
						קטגוריית מסמכים
					</Link>{' '}
						: הכנה שמונעת עיכובים יקרים בהמשך.
				</p>
			);
		case 'seo-counsel-vs-representation':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					ייעוץ משפטי מתמקד בהבנה, תכנון ובחירת מהלך; ייצוג מלא כולל ניהול הליך מול גורמים חיצוניים, בית משפט
					או רשות מוסמכת. ההבחנה מוסברת ב{' '}
					<Link className={linkClass} href="/blog/guy-avni-legal-counsel-israel-2026-guide/">
						מדריך הייעוץ המשפטי
					</Link>
					; לזרימת בדיקת חוזים עיינו ב{' '}
					<Link className={linkClass} href="/blog/guy-avni-contract-review-flow/">
						תהליך סקירת חוזים
					</Link>
					. לבחירת מסלול שירות:{' '}
					<Link className={linkClass} href="/services/">
						עמוד השירותים
					</Link>{' '}
					לפני שמתחייבים לנתיב ייצוג מלא.
				</p>
			);
		case 'seo-first-contact':
			return (
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					אחרי פנייה ראשונה מתבצעת שיחת מיקוד, מיפוי מטרות והמלצה על צעדים - בלי עומס מיותר ועם סיכום ברור
					להמשך. תהליך הקליטה מתואר ב{' '}
					<Link className={linkClass} href="/blog/guy-avni-client-onboarding-framework/">
						מסגרת קליטת לקוח
					</Link>
					; לבניית אמון לאורך זמן, קראו{' '}
					<Link className={linkClass} href="/blog/guy-avni-client-trust-roadmap/">
						מפת אמון לקוח
					</Link>
					. להתחלת מסלול:{' '}
					<Link className={linkClass} href="/contact/">
						יצירת קשר עם המשרד
					</Link>{' '}
					או עיון ב{' '}
					<Link className={linkClass} href="/tags/">
						תגיות האתר
					</Link>{' '}
					כדי למצוא במהירות מאמרים רלוונטיים לפני שיחת היכרות.
				</p>
			);
		default:
			console.error('[HomeSeoContentSections] unknown section id', { sectionId });
			return null;
	}
}

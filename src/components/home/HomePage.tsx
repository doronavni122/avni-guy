import Link from 'next/link';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { HomeSeoContentSections } from '@/components/home/HomeSeoContentSections';
import { FeaturedArticlesGrid } from '@/components/home/FeaturedArticlesGrid';
import { HomeMiniToc } from '@/components/home/HomeMiniToc';
import { LatestInsightsStrip } from '@/components/home/LatestInsightsStrip';
import { OptimizedImage } from '@/components/media/OptimizedImage';
import { buttonVariants } from '@/components/ui/button';
import { MainPageHero } from '@/components/seo/MainPageHero';
import type { HomeData } from '@/lib/home/loadHomeData';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { cn } from '@/lib/utils';

const homeHero = MAIN_PAGE_HEROES['/'];

const ctaPrimary = cn(buttonVariants({ size: 'lg' }), 'no-rule rounded-sm font-serif text-base');
const ctaOutline = cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'no-rule rounded-sm font-serif text-base');

/** Editorial section opener: ink top rule with a kicker and a folio numeral. */
function Dateline({ kicker, folio }: { kicker: string; folio: string }) {
	return (
		<div className="flex items-baseline justify-between gap-4 border-t-2 border-foreground pt-3">
			<p className="kicker">{kicker}</p>
			<span className="folio text-base" aria-hidden="true">
				{folio}
			</span>
		</div>
	);
}

function Figure({ src, alt, title, priority }: { src: string; alt: string; title: string; priority?: boolean }) {
	return (
		<figure className="border border-border">
			<OptimizedImage src={src} alt={alt} title={title} priority={priority} className="h-56 w-full object-cover sm:h-72" />
		</figure>
	);
}

export function HomePage({
	featuredPosts,
	latestPosts,
	popularCategories,
	popularTags,
	readingPaths,
	faqItems,
	homeImages,
	tocItems,
	processSteps,
}: HomeData) {
	return (
		<div className="relative flex flex-col gap-16 pb-24 md:pb-10 lg:gap-24">
			{/* Hero */}
			<div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
				<div className="flex flex-col gap-8">
					<MainPageHero hero={homeHero} />
					<div className="flex flex-wrap items-center gap-3">
						<Link className={ctaPrimary} href="/contact/">
							תיאום שיחה
						</Link>
						<Link className={ctaOutline} href="/blog/">
							למאמרים
						</Link>
					</div>
				</div>
				<Figure src={homeImages[0].src} alt={homeImages[0].alt} title={homeImages[0].title} priority />
			</div>

			<HomeMiniToc items={tocItems} />

			{/* Value props */}
			<section className="flex flex-col gap-8 text-right">
				<Dateline kicker="עקרונות העבודה" folio="01" />
				<div className="grid gap-x-10 gap-y-8 sm:grid-cols-3">
					{[
						{ title: 'בהירות מהירה', text: 'מסלולי עבודה מסודרים, שפה נקייה והתמקדות בתוצאה טובה לטווח ארוך.' },
						{ title: 'שירות פרימיום', text: 'ליווי מקצועי עם דגש על זמינות, אחריות ותיאום ציפיות מוקדם.' },
						{ title: 'תוכן מעשי', text: 'מאמרים וכלים שמחברים בין משפט ליישום יומיומי בצורה חיובית.' },
					].map((item, i) => (
						<div key={item.title} className="flex flex-col gap-3 border-t border-border pt-4">
							<span className="folio text-lg" aria-hidden="true">
								{String(i + 1).padStart(2, '0')}
							</span>
							<h3 className="font-serif text-2xl font-bold text-foreground">{item.title}</h3>
							<p className="text-pretty leading-relaxed text-muted-foreground">{item.text}</p>
						</div>
					))}
				</div>
			</section>

			<HomeSeoContentSections homeImages={homeImages} />

			{/* Process */}
			<section id="process" className="home-anchor-target flex flex-col gap-8 text-right" aria-labelledby="process-title">
				<Dateline kicker="שיטת העבודה" folio="03" />
				<h2 id="process-title" className="max-w-3xl font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
					כך עובד התהליך כשמדברים עם גיא אבני עורך דין
				</h2>
				<p className="drop-cap max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
					כדי להפוך תהליך משפטי למשהו ברור ומרגיע, חשוב לעבוד בסדר קבוע: מטרה, מיפוי, תוכנית וביצוע. כך מצמצמים אי־ודאות,
					מונעים טעויות יקרות ומתקדמים בקצב נכון לעסק או למשפחה.{' '}
					<Link className="link-underline" href="/services/">
						לעמוד השירותים המלא
					</Link>
					.
				</p>
				<ul className="max-w-2xl flex flex-col gap-3 border-y border-border py-5 text-muted-foreground">
					<li>
						<strong className="text-foreground">פחות אי־ודאות:</strong> כל שלב מוגדר מראש עם{' '}
						<Link className="link-underline" href="/services/">תוצר ברור</Link>.
					</li>
					<li>
						<strong className="text-foreground">יותר שליטה:</strong> תיעדוף נכון של משימות לפי{' '}
						<Link className="link-underline" href="/blog/risk-management-routine/">השפעה וסיכון</Link>.
					</li>
					<li>
						<strong className="text-foreground">קצב יציב:</strong> התקדמות עקבית בלי{' '}
						<Link className="link-underline" href="/blog/process-improvement-for-legal-teams/">עומס החלטות מיותר</Link>.
					</li>
				</ul>
				<ol className="grid gap-x-10 gap-y-6 md:grid-cols-2">
					{processSteps.map((step, index) => (
						<li key={step.title} className="flex gap-4 border-t border-border pt-4">
							<span className="folio text-xl" aria-hidden="true">
								{String(index + 1).padStart(2, '0')}
							</span>
							<div className="flex flex-col gap-1.5">
								<h3 className="font-serif text-xl font-bold text-foreground">{step.title}</h3>
								<p className="leading-relaxed text-muted-foreground">{step.text}</p>
							</div>
						</li>
					))}
				</ol>
				<Figure src={homeImages[2].src} alt={homeImages[2].alt} title={homeImages[2].title} />
			</section>

			<FeaturedArticlesGrid posts={featuredPosts} />

			{/* Reading paths */}
			<section id="reading-paths" className="home-anchor-target flex flex-col gap-8 text-right" aria-labelledby="reading-paths-title">
				<Dateline kicker="מסלולי קריאה" folio="05" />
				<h2 id="reading-paths-title" className="max-w-3xl font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
					מסלולי קריאה מומלצים מאתר גיא אבני
				</h2>
				<div className="grid gap-x-10 gap-y-8 lg:grid-cols-3">
					{readingPaths.map((path) => (
						<div key={path.title} className="flex flex-col gap-3 border-t border-border pt-4">
							<h3 className="font-serif text-xl font-bold text-foreground">{path.title}</h3>
							<p className="leading-relaxed text-muted-foreground">{path.summary}</p>
							<ul className="mt-1 flex flex-col gap-2.5">
								{path.posts.map((post) => (
									<li key={post.id} className="flex gap-2">
										<span className="text-primary" aria-hidden="true">—</span>
										<Link className="link-underline" href={`/blog/${post.id}/`}>
											{post.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<Figure src={homeImages[3].src} alt={homeImages[3].alt} title={homeImages[3].title} />
			</section>

			{/* Authority */}
			<section id="authority" className="home-anchor-target flex flex-col gap-8 text-right" aria-labelledby="authority-title">
				<Dateline kicker="למה גיא אבני" folio="06" />
				<h2 id="authority-title" className="font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
					למה לעבוד עם גיא אבני
				</h2>
				<div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
					{[
						{ title: 'בהירות לפני הכול', text: 'כל החלטה מתורגמת לשפה עסקית ברורה: מה עושים עכשיו, מה מרוויחים ומה נמנע.' },
						{ title: 'ליווי שמותאם לקצב שלכם', text: 'תהליך מודולרי, גמיש ומדויק ללקוחות פרטיים ולעסקים שצריכים תוצאה ולא עומס נוסף.' },
						{ title: 'גישה פרקטית למדידה ושיפור', text: 'לא רק פותרים בעיה נקודתית, אלא בונים שגרה משפטית שתמשיך לעבוד גם בהמשך.' },
					].map((item) => (
						<div key={item.title} className="flex flex-col gap-2 border-t border-border pt-4">
							<h3 className="font-serif text-xl font-bold text-foreground">{item.title}</h3>
							<p className="leading-relaxed text-muted-foreground">{item.text}</p>
						</div>
					))}
				</div>
				<Figure src={homeImages[4].src} alt={homeImages[4].alt} title={homeImages[4].title} />
				<p className="text-muted-foreground">
					רוצים להכיר את הרקע המקצועי והגישה המלאה?{' '}
					<Link className="link-underline" href="/about/">לעמוד אודות</Link>.
				</p>
			</section>

			{/* Audience */}
			<section id="audience" className="home-anchor-target flex flex-col gap-8 text-right" aria-labelledby="audience-title">
				<Dateline kicker="למי זה מתאים" folio="07" />
				<h2 id="audience-title" className="font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
					למי גיא אבני עו״ד מלווה בפועל?
				</h2>
				<div className="grid gap-x-10 gap-y-8 md:grid-cols-3">
					{[
						{ title: 'לקוחות פרטיים', text: 'כשצריך סדר, הסבר ברור ותוכנית מעשית לפני מהלך משמעותי.', href: '/services/', cta: 'פתרונות ללקוחות פרטיים' },
						{ title: 'מייסדים ויזמים', text: 'ליווי מהיר סביב חוזים, תקשורת עם צדדים שלישיים וניהול סיכון בשלבי צמיחה.', href: '/blog/', cta: 'מאמרים ליזמים' },
						{ title: 'עסקים קטנים ובינוניים', text: 'בניית שגרה משפטית יציבה: חוזים, נהלים ותגובות נכונות למצבי קצה.', href: '/contact/', cta: 'תיאום שיחת התאמה' },
					].map((item) => (
						<div key={item.title} className="flex flex-col gap-3 border-t border-border pt-4">
							<h3 className="font-serif text-xl font-bold text-foreground">{item.title}</h3>
							<p className="leading-relaxed text-muted-foreground">{item.text}</p>
							<Link className="link-underline mt-auto" href={item.href}>
								{item.cta}
							</Link>
						</div>
					))}
				</div>
			</section>

			{/* Comparison */}
			<section id="comparison" className="home-anchor-target flex flex-col gap-8 text-right" aria-labelledby="comparison-title">
				<Dateline kicker="לבד מול ליווי" folio="08" />
				<h2 id="comparison-title" className="font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
					לבד מול ליווי משפטי - הפרספקטיבה של גיא אבני עו״ד
				</h2>
				<div className="grid gap-10 md:grid-cols-2">
					<div className="flex flex-col gap-3 border-t border-border pt-5">
						<h3 className="font-serif text-2xl font-bold text-muted-foreground">טיפול עצמאי</h3>
						<div className="space-y-3 leading-relaxed text-muted-foreground">
							<p>
								חוסך בטווח המיידי, אך מגדיל סיכון ל־{' '}
								<Link className="link-underline" href="/blog/evidence-prioritization-framework/">טעויות</Link>{' '}
								שלא תמיד נראות בזמן אמת.
							</p>
							<p>
								דורש השקעת זמן גבוהה ב־{' '}
								<Link className="link-underline" href="/blog/document-readiness-guide/">בדיקת חומרים</Link>{' '}
								וקבלת החלטות תחת אי־ודאות.
							</p>
							<p>
								התוצאה תלויה בניסיון אישי וביכולת{' '}
								<Link className="link-underline" href="/blog/process-improvement-for-legal-teams/">לתעדף נכון</Link>{' '}
								בכל צומת.
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-3 border-e-2 border-primary bg-primary/[0.06] p-6 sm:p-8">
						<h3 className="font-serif text-2xl font-extrabold text-foreground">ליווי משפטי מקצועי</h3>
						<div className="space-y-3 leading-relaxed text-foreground/85">
							<p>מספק מסגרת החלטה ברורה ומקטין טעויות עם השלכות כספיות ותפעוליות.</p>
							<p>מקצר את הדרך לתוצאה עם סדר עבודה, תיעדוף והכוונה מותאמת למקרה.</p>
							<p>מייצר שקט תפעולי וביטחון גבוה יותר לאורך התהליך.</p>
							<p>
								<Link className="link-underline" href="/services/">בדקו את מסלולי השירות</Link>{' '}
								או{' '}
								<Link className="link-underline" href="/contact/">תאמו שיחה קצרה</Link>.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Long-form content */}
			<section
				id="long-form-content"
				className="home-anchor-target home-deferred-section flex flex-col gap-6 text-right"
				aria-labelledby="long-form-content-title"
			>
				<Dateline kicker="מדריכי עומק" folio="09" />
				<h2 id="long-form-content-title" className="max-w-3xl font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
					מדריכי עומק של גיא אבני לקבלת החלטות טובה יותר
				</h2>
				<p className="drop-cap max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
					לפני מהלך משמעותי, כדאי לעצור ולהגדיר מטרה, מגבלות וסיכון שאי אפשר לקבל. שלושת אלה מונעים החלטות תחת לחץ ומאפשרים
					תוכנית ברורה. להעמקה, קראו את{' '}
					<Link className="link-underline" href="/blog/long-term-legal-strategy/">אסטרטגיה משפטית לטווח ארוך</Link>,{' '}
					<Link className="link-underline" href="/blog/contract-review-flow/">בדיקת חוזים לפני חתימה</Link>,{' '}
					<Link className="link-underline" href="/blog/risk-management-routine/">שגרת ניהול סיכונים</Link>{' '}
					ו־{' '}
					<Link className="link-underline" href="/blog/client-trust-roadmap/">מפת אמון לקוח</Link>
					. ליישום מותאם, עברו ל־{' '}
					<Link className="link-underline" href="/services/">שירותים</Link>{' '}
					או{' '}
					<Link className="link-underline" href="/contact/">יצירת קשר</Link>.
				</p>
			</section>

			<LatestInsightsStrip posts={latestPosts} />

			{/* Taxonomy */}
			<section className="home-anchor-target flex flex-col gap-8 text-right" aria-labelledby="taxonomy-title" id="taxonomy-links">
				<Dateline kicker="ניווט לפי נושא" folio="11" />
				<h2 id="taxonomy-title" className="font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
					ניווט מהיר לפי נושאים סביב גיא אבני
				</h2>
				<div className="grid gap-10 lg:grid-cols-2">
					<div className="flex flex-col gap-4 border-t border-border pt-4">
						<h3 className="font-serif text-xl font-bold text-foreground">קטגוריות מובילות</h3>
						<p className="text-muted-foreground">תחומים עם נפח התוכן הגבוה ביותר באתר.</p>
						<ul className="flex flex-wrap gap-x-6 gap-y-2.5">
							{popularCategories.map((category) => (
								<li key={category.name}>
									<Link className="no-rule group inline-flex items-baseline gap-1.5 font-serif text-lg text-foreground no-underline transition-colors hover:text-primary" href={`/categories/${category.name}/`}>
										{category.name}
										<span className="folio text-xs">{category.count}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-4 border-t border-border pt-4">
						<h3 className="font-serif text-xl font-bold text-foreground">תגיות מובילות</h3>
						<p className="text-muted-foreground">נושאי עומק שחוזרים במאמרים ויכולים לקצר לכם את החיפוש.</p>
						<ul className="flex flex-wrap gap-x-6 gap-y-2.5">
							{popularTags.map((tag) => (
								<li key={tag.name}>
									<Link className="no-rule group inline-flex items-baseline gap-1.5 font-serif text-lg text-foreground no-underline transition-colors hover:text-primary" href={`/tags/${tag.name}/`}>
										{tag.name}
										<span className="folio text-xs">{tag.count}</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<FaqAccordion items={faqItems} />

			<Figure src={homeImages[6].src} alt={homeImages[6].alt} title={homeImages[6].title} />

			{/* Final CTA */}
			<div
				id="premium-cta"
				className="home-anchor-target flex flex-col gap-6 border-y-2 border-foreground py-12 text-right sm:flex-row sm:items-center sm:justify-between"
			>
				<div className="flex max-w-xl flex-col gap-3">
					<p className="kicker">מוכנים להתחיל</p>
					<p className="font-serif text-3xl font-extrabold leading-tight text-foreground text-balance sm:text-4xl">
						מוכנים לעבור משאלות לתוכנית עבודה ברורה?
					</p>
					<p className="text-pretty leading-relaxed text-muted-foreground">
						נמפה את המצב, נגדיר סדר עדיפויות, ונצא לדרך עם צעדים פרקטיים שמתאימים בדיוק למטרות שלכם.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Link className={ctaPrimary} href="/contact/">
						צור קשר עכשיו
					</Link>
					<Link className={ctaOutline} href="/services/">
						למסלולי השירות
					</Link>
				</div>
			</div>

			{/* Mobile sticky CTA */}
			<div className="glass-header mobile-bottom-cta fixed inset-x-0 bottom-0 z-40 border-t border-border px-4 py-3 md:hidden" dir="rtl">
				<div className="mx-auto flex w-full max-w-screen-xl gap-2 pb-[env(safe-area-inset-bottom)]">
					<Link className={cn(ctaPrimary, 'flex-1')} href="/contact/">
						צור קשר
					</Link>
					<Link className={cn(ctaOutline, 'flex-1')} href="/blog/">
						מאמרים
					</Link>
				</div>
			</div>
		</div>
	);
}

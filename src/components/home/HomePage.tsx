import Link from 'next/link';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { HomeSeoContentSections } from '@/components/home/HomeSeoContentSections';
import { FeaturedArticlesGrid } from '@/components/home/FeaturedArticlesGrid';
import { HomeMiniToc } from '@/components/home/HomeMiniToc';
import { LatestInsightsStrip } from '@/components/home/LatestInsightsStrip';
import { OptimizedImage } from '@/components/media/OptimizedImage';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MainPageHero } from '@/components/seo/MainPageHero';
import type { HomeData } from '@/lib/home/loadHomeData';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { cn } from '@/lib/utils';

const homeHero = MAIN_PAGE_HEROES['/'];

const labelClass = 'swiss-label';
const figureClass = 'overflow-hidden rounded-sm border border-border bg-card';
const inlineLink = 'font-semibold text-primary underline-offset-4 hover:underline';

/** Numbered, hairline-topped section header in the Swiss grid idiom. */
function HomeSectionHead({ id, index, title }: { id: string; index: string; title: string }) {
	return (
		<div className="flex items-start justify-between gap-6 border-t border-border pt-5">
			<h2
				id={id}
				className="max-w-3xl font-heading text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl"
			>
				{title}
			</h2>
			<span className="swiss-index shrink-0 text-sm text-muted-foreground" aria-hidden="true">
				{index}
			</span>
		</div>
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
	quickStartLinks,
	processSteps,
}: HomeData) {
	return (
		<section className="relative flex flex-col gap-14 pb-24 md:pb-6 lg:gap-20">
			{/* Hero */}
			<div className="flex flex-col gap-8">
				<MainPageHero hero={homeHero} />
				<div className="flex flex-wrap items-center gap-3">
					<Link className={cn(buttonVariants({ size: 'lg' }), 'rounded-sm')} href="/contact/">
						תיאום שיחה
					</Link>
					<Link
						className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-sm')}
						href="/blog/"
					>
						למאמרים
					</Link>
				</div>
				<figure className={cn(figureClass, 'mt-2')}>
					<OptimizedImage
						src={homeImages[0].src}
						alt={homeImages[0].alt}
						title={homeImages[0].title}
						priority
						className="h-64 w-full object-cover sm:h-80"
					/>
				</figure>
			</div>

			<HomeMiniToc items={tocItems} />

			{/* Quick start */}
			<section id="quick-start" className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="quick-start-title">
				<HomeSectionHead id="quick-start-title" index="01" title="מסלול התחלה מהיר בפורמט של גיא אבני משרד עורכי דין" />
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<span className={labelClass}>ניווט חכם</span>
					<span className={labelClass}>פעולות מומלצות</span>
				</div>
				<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
					רוצים להתמצא באתר בדקה? התחילו במסלול המומלץ: הכירו את{' '}
					<Link className={inlineLink} href="/about/">
						הגישה המקצועית
					</Link>
					, עברו לעמוד{' '}
					<Link className={inlineLink} href="/services/">
						השירותים
					</Link>
					, דפדפו ב־{' '}
					<Link className={inlineLink} href="/blog/">
						מאמרים
					</Link>
					, ואז העמיקו דרך{' '}
					<Link className={inlineLink} href="/categories/">
						קטגוריות
					</Link>{' '}
					ו־{' '}
					<Link className={inlineLink} href="/tags/">
						תגיות
					</Link>
					. אם תרצו יישום מיידי למצב שלכם, סיימו בעמוד{' '}
					<Link className={inlineLink} href="/contact/">
						יצירת קשר
					</Link>
					.
				</p>
				<ul className="max-w-3xl list-disc space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground">
					<li>
						<strong className="text-foreground">שלב 1:</strong> הכירו את{' '}
						<Link className={inlineLink} href="/about/">
							הרקע והגישה
						</Link>{' '}
						לפני כל החלטה.
					</li>
					<li>
						<strong className="text-foreground">שלב 2:</strong> מיינו נושא דרך{' '}
						<Link className={inlineLink} href="/blog/">
							מאמרים
						</Link>
						,{' '}
						<Link className={inlineLink} href="/categories/">
							קטגוריות
						</Link>{' '}
						ו־{' '}
						<Link className={inlineLink} href="/tags/">
							תגיות
						</Link>
						.
					</li>
					<li>
						<strong className="text-foreground">שלב 3:</strong> עברו ליישום מעשי עם{' '}
						<Link className={inlineLink} href="/contact/">
							פנייה ממוקדת
						</Link>
						.
					</li>
				</ul>
				<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
					{quickStartLinks.map((link) => (
						<Link
							key={link.href}
							className="bg-card px-4 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-primary"
							href={link.href}
						>
							{link.label}
						</Link>
					))}
				</div>
				<figure className={figureClass}>
					<OptimizedImage
						src={homeImages[1].src}
						alt={homeImages[1].alt}
						title={homeImages[1].title}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
			</section>

			{/* Value props */}
			<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-3">
				{[
					{ title: 'בהירות מהירה', text: 'מסלולי עבודה מסודרים, שפה נקייה והתמקדות בתוצאה טובה לטווח ארוך.' },
					{ title: 'שירות פרימיום', text: 'ליווי מקצועי עם דגש על זמינות, אחריות ותיאום ציפיות מוקדם.' },
					{ title: 'תוכן מעשי', text: 'מאמרים וכלים שמחברים בין משפט ליישום יומיומי בצורה חיובית.' },
				].map((item, i) => (
					<div key={item.title} className="flex flex-col gap-3 bg-card p-6 text-right sm:p-8">
						<span className="swiss-index text-xs text-muted-foreground" aria-hidden="true">
							{String(i + 1).padStart(2, '0')}
						</span>
						<h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
						<p className="text-pretty text-sm leading-relaxed text-muted-foreground">{item.text}</p>
					</div>
				))}
			</div>

			<HomeSeoContentSections homeImages={homeImages} />

			{/* Process */}
			<section id="process" className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="process-title">
				<HomeSectionHead id="process-title" index="02" title="כך עובד התהליך כשמדברים עם גיא אבני עורך דין" />
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<span className={labelClass}>שיטה מודולרית</span>
					<span className={labelClass}>מדידה ושיפור</span>
				</div>
				<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
					כדי להפוך תהליך משפטי למשהו ברור ומרגיע, חשוב לעבוד בסדר קבוע: מטרה, מיפוי, תוכנית וביצוע. כך מצמצמים אי־ודאות,
					מונעים טעויות יקרות ומתקדמים בקצב נכון לעסק או למשפחה.{' '}
					<Link className={inlineLink} href="/services/">
						לעמוד השירותים המלא
					</Link>
					.
				</p>
				<ul className="max-w-3xl list-disc space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground">
					<li>
						<strong className="text-foreground">פחות אי־ודאות:</strong> כל שלב מוגדר מראש עם{' '}
						<Link className={inlineLink} href="/services/">
							תוצר ברור
						</Link>
						.
					</li>
					<li>
						<strong className="text-foreground">יותר שליטה:</strong> תיעדוף נכון של משימות לפי{' '}
						<Link className={inlineLink} href="/blog/risk-management-routine/">
							השפעה וסיכון
						</Link>
						.
					</li>
					<li>
						<strong className="text-foreground">קצב יציב:</strong> התקדמות עקבית בלי{' '}
						<Link className={inlineLink} href="/blog/process-improvement-for-legal-teams/">
							עומס החלטות מיותר
						</Link>
						.
					</li>
				</ul>
				<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
					{processSteps.map((step, index) => (
						<div key={step.title} className="flex flex-col gap-2 bg-card p-6 text-right sm:p-7">
							<span className="swiss-index text-xs text-primary" aria-hidden="true">
								{String(index + 1).padStart(2, '0')}
							</span>
							<h3 className="font-heading text-lg font-semibold text-foreground">{step.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
						</div>
					))}
				</div>
				<figure className={figureClass}>
					<OptimizedImage
						src={homeImages[2].src}
						alt={homeImages[2].alt}
						title={homeImages[2].title}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
			</section>

			<FeaturedArticlesGrid posts={featuredPosts} />

			{/* Reading paths */}
			<section id="reading-paths" className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="reading-paths-title">
				<HomeSectionHead id="reading-paths-title" index="03" title="מסלולי קריאה מומלצים מאתר גיא אבני" />
				<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-3">
					{readingPaths.map((path) => (
						<div key={path.title} className="flex flex-col gap-3 bg-card p-6 text-right sm:p-7">
							<h3 className="font-heading text-lg font-semibold text-foreground">{path.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">{path.summary}</p>
							<ul className="mt-1 space-y-2 border-t border-border pt-3">
								{path.posts.map((post) => (
									<li key={post.id}>
										<Link className={cn(inlineLink, 'text-sm')} href={`/blog/${post.id}/`}>
											{post.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
				<figure className={figureClass}>
					<OptimizedImage
						src={homeImages[3].src}
						alt={homeImages[3].alt}
						title={homeImages[3].title}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
			</section>

			{/* Authority */}
			<section id="authority" className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="authority-title">
				<HomeSectionHead id="authority-title" index="04" title="למה לעבוד עם גיא אבני" />
				<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
					{[
						{ title: 'בהירות לפני הכול', text: 'כל החלטה מתורגמת לשפה עסקית ברורה: מה עושים עכשיו, מה מרוויחים ומה נמנע.' },
						{ title: 'ליווי שמותאם לקצב שלכם', text: 'תהליך מודולרי, גמיש ומדויק ללקוחות פרטיים ולעסקים שצריכים תוצאה ולא עומס נוסף.' },
						{ title: 'גישה פרקטית למדידה ושיפור', text: 'לא רק פותרים בעיה נקודתית, אלא בונים שגרה משפטית שתמשיך לעבוד גם בהמשך.' },
					].map((item) => (
						<div key={item.title} className="flex flex-col gap-2 bg-card p-6 text-right sm:p-7">
							<h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
						</div>
					))}
				</div>
				<figure className={figureClass}>
					<OptimizedImage
						src={homeImages[4].src}
						alt={homeImages[4].alt}
						title={homeImages[4].title}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
				<p className="text-sm text-muted-foreground">
					רוצים להכיר את הרקע המקצועי והגישה המלאה?{' '}
					<Link className={inlineLink} href="/about/">
						לעמוד אודות
					</Link>
					.
				</p>
			</section>

			{/* Audience */}
			<section id="audience" className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="audience-title">
				<HomeSectionHead id="audience-title" index="05" title="למי גיא אבני עו״ד מלווה בפועל?" />
				<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
					{[
						{ title: 'לקוחות פרטיים', text: 'כשצריך סדר, הסבר ברור ותוכנית מעשית לפני מהלך משמעותי.', href: '/services/', cta: 'פתרונות ללקוחות פרטיים' },
						{ title: 'מייסדים ויזמים', text: 'ליווי מהיר סביב חוזים, תקשורת עם צדדים שלישיים וניהול סיכון בשלבי צמיחה.', href: '/blog/', cta: 'מאמרים ליזמים' },
						{ title: 'עסקים קטנים ובינוניים', text: 'בניית שגרה משפטית יציבה: חוזים, נהלים ותגובות נכונות למצבי קצה.', href: '/contact/', cta: 'תיאום שיחת התאמה' },
					].map((item) => (
						<div key={item.title} className="flex flex-col gap-3 bg-card p-6 text-right sm:p-7">
							<h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
							<Link className={cn(inlineLink, 'mt-auto text-sm')} href={item.href}>
								{item.cta}
							</Link>
						</div>
					))}
				</div>
			</section>

			{/* Comparison */}
			<section id="comparison" className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="comparison-title">
				<HomeSectionHead id="comparison-title" index="06" title="לבד מול ליווי משפטי - הפרספקטיבה של גיא אבני עו״ד" />
				<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
					<div className="flex flex-col gap-3 bg-card p-6 text-right sm:p-8">
						<h3 className="font-heading text-lg font-semibold text-foreground">טיפול עצמאי</h3>
						<div className="space-y-2 text-sm text-muted-foreground">
							<p>
								חוסך בטווח המיידי, אך מגדיל סיכון ל־{' '}
								<Link className={inlineLink} href="/blog/evidence-prioritization-framework/">
									טעויות
								</Link>{' '}
								שלא תמיד נראות בזמן אמת.
							</p>
							<p>
								דורש השקעת זמן גבוהה ב־{' '}
								<Link className={inlineLink} href="/blog/document-readiness-guide/">
									בדיקת חומרים
								</Link>{' '}
								וקבלת החלטות תחת אי־ודאות.
							</p>
							<p>
								התוצאה תלויה בניסיון אישי וביכולת{' '}
								<Link className={inlineLink} href="/blog/process-improvement-for-legal-teams/">
									לתעדף נכון
								</Link>{' '}
								בכל צומת.
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-3 border-primary bg-primary/5 p-6 text-right sm:p-8">
						<h3 className="font-heading text-lg font-semibold text-foreground">ליווי משפטי מקצועי</h3>
						<div className="space-y-2 text-sm text-muted-foreground">
							<p>מספק מסגרת החלטה ברורה ומקטין טעויות עם השלכות כספיות ותפעוליות.</p>
							<p>מקצר את הדרך לתוצאה עם סדר עבודה, תיעדוף והכוונה מותאמת למקרה.</p>
							<p>מייצר שקט תפעולי וביטחון גבוה יותר לאורך התהליך.</p>
							<p>
								<Link className={inlineLink} href="/services/">
									בדקו את מסלולי השירות
								</Link>{' '}
								או{' '}
								<Link className={inlineLink} href="/contact/">
									תאמו שיחה קצרה
								</Link>
								.
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
				<HomeSectionHead id="long-form-content-title" index="07" title="מדריכי עומק של גיא אבני לקבלת החלטות טובה יותר" />
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					לפני מהלך משמעותי, כדאי לעצור ולהגדיר מטרה, מגבלות וסיכון שאי אפשר לקבל. שלושת אלה מונעים החלטות תחת לחץ ומאפשרים
					תוכנית ברורה. להעמקה, קראו את{' '}
					<Link className={inlineLink} href="/blog/long-term-legal-strategy/">
						אסטרטגיה משפטית לטווח ארוך
					</Link>
					,{' '}
					<Link className={inlineLink} href="/blog/contract-review-flow/">
						בדיקת חוזים לפני חתימה
					</Link>
					,{' '}
					<Link className={inlineLink} href="/blog/risk-management-routine/">
						שגרת ניהול סיכונים
					</Link>{' '}
					ו־{' '}
					<Link className={inlineLink} href="/blog/client-trust-roadmap/">
						מפת אמון לקוח
					</Link>
					. ליישום מותאם, עברו ל־{' '}
					<Link className={inlineLink} href="/services/">
						שירותים
					</Link>{' '}
					או{' '}
					<Link className={inlineLink} href="/contact/">
						יצירת קשר
					</Link>
					.
				</p>
			</section>

			<LatestInsightsStrip posts={latestPosts} />

			{/* Taxonomy */}
			<section className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="taxonomy-title" id="taxonomy-links">
				<HomeSectionHead id="taxonomy-title" index="08" title="ניווט מהיר לפי נושאים סביב גיא אבני" />
				<div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-2">
					<div className="flex flex-col gap-4 bg-card p-6 text-right sm:p-7">
						<div className="flex flex-col gap-1">
							<h3 className="font-heading text-lg font-semibold text-foreground">קטגוריות מובילות</h3>
							<p className="text-sm text-muted-foreground">תחומים עם נפח התוכן הגבוה ביותר באתר.</p>
						</div>
						<div className="flex flex-wrap gap-2">
							{popularCategories.map((category) => (
								<Link
									key={category.name}
									className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
									href={`/categories/${category.name}/`}
								>
									{category.name}
									<span className="swiss-index text-xs text-muted-foreground">({category.count})</span>
								</Link>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-4 bg-card p-6 text-right sm:p-7">
						<div className="flex flex-col gap-1">
							<h3 className="font-heading text-lg font-semibold text-foreground">תגיות מובילות</h3>
							<p className="text-sm text-muted-foreground">נושאי עומק שחוזרים במאמרים ויכולים לקצר לכם את החיפוש.</p>
						</div>
						<div className="flex flex-wrap gap-2">
							{popularTags.map((tag) => (
								<Link
									key={tag.name}
									className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
									href={`/tags/${tag.name}/`}
								>
									{tag.name}
									<span className="swiss-index text-xs text-muted-foreground">({tag.count})</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</section>

			<FaqAccordion items={faqItems} />

			<figure className={cn(figureClass, 'home-anchor-target')} id="home-image-final">
				<OptimizedImage
					src={homeImages[6].src}
					alt={homeImages[6].alt}
					title={homeImages[6].title}
					className="h-56 w-full object-cover sm:h-72"
				/>
			</figure>

			{/* Final CTA */}
			<div
				className="home-anchor-target flex flex-col gap-5 rounded-sm border border-primary bg-primary/5 p-8 text-right sm:flex-row sm:items-center sm:justify-between sm:p-10"
				id="premium-cta"
			>
				<div className="flex flex-col gap-2">
					<span className="swiss-label">מוכנים להתחיל / Start</span>
					<p className="font-heading text-xl font-bold text-foreground">מוכנים לעבור משאלות לתוכנית עבודה ברורה?</p>
					<p className="text-sm text-muted-foreground">
						נמפה את המצב, נגדיר סדר עדיפויות, ונצא לדרך עם צעדים פרקטיים שמתאימים בדיוק למטרות שלכם.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<Link className={cn(buttonVariants({ size: 'lg' }), 'rounded-sm')} href="/contact/">
						צור קשר עכשיו
					</Link>
					<Link
						className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'rounded-sm')}
						href="/services/"
					>
						למסלולי השירות
					</Link>
				</div>
			</div>

			{/* Mobile sticky CTA */}
			<div
				className="glass-header mobile-bottom-cta fixed inset-x-0 bottom-0 z-40 border-t border-border px-4 py-3 md:hidden"
				dir="rtl"
			>
				<div className="mx-auto flex w-full max-w-screen-xl gap-2 pb-[env(safe-area-inset-bottom)]">
					<Link className={cn(buttonVariants({ size: 'lg' }), 'flex-1 rounded-sm')} href="/contact/">
						צור קשר
					</Link>
					<Link
						className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'flex-1 rounded-sm')}
						href="/blog/"
					>
						מאמרים
					</Link>
				</div>
			</div>
		</section>
	);
}

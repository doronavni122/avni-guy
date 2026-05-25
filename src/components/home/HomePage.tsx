import Link from 'next/link';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { HomeSeoContentSections } from '@/components/home/HomeSeoContentSections';
import { FeaturedArticlesGrid } from '@/components/home/FeaturedArticlesGrid';
import { HomeMiniToc } from '@/components/home/HomeMiniToc';
import { LatestInsightsStrip } from '@/components/home/LatestInsightsStrip';
import { OptimizedImage } from '@/components/media/OptimizedImage';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MainPageHero } from '@/components/seo/MainPageHero';
import type { HomeData } from '@/lib/home/loadHomeData';
import { MAIN_PAGE_HEROES } from '@/lib/seo/main-page-heroes';
import { cn } from '@/lib/utils';

const homeHero = MAIN_PAGE_HEROES['/'];

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
		<section className="relative flex flex-col gap-10 pb-24 lg:gap-14 md:pb-6">
			<div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-8 shadow-sm ring-1 ring-primary/10 sm:p-10 lg:p-12">
				<div
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_0%_0%,oklch(0.45_0.08_165/0.12),transparent_55%)]"
					aria-hidden="true"
				/>
				<div className="relative flex flex-col gap-6 text-right">
					<MainPageHero hero={homeHero} />
					<div className="flex flex-wrap items-center justify-end gap-3">
						<Link className={cn(buttonVariants({ size: 'lg' }))} href="/contact/">
							תיאום שיחה
						</Link>
						<Link className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))} href="/blog/">
							למאמרים
						</Link>
					</div>
					<figure className="overflow-hidden rounded-xl border border-border/60 bg-background/80">
						<OptimizedImage
							src={homeImages[0].src}
							alt={homeImages[0].alt}
							title={homeImages[0].title}
							priority
							className="h-56 w-full object-cover sm:h-64"
						/>
					</figure>
				</div>
			</div>

			<HomeMiniToc items={tocItems} />

			<section id="quick-start" className="home-anchor-target flex flex-col gap-4 text-right" aria-labelledby="quick-start-title">
				<h2 id="quick-start-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					מסלול התחלה מהיר בפורמט של גיא אבני משרד עורכי דין
				</h2>
				<div className="flex flex-wrap justify-end gap-2">
					<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
						ניווט חכם
					</span>
					<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
						פעולות מומלצות
					</span>
				</div>
				<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
					רוצים להתמצא באתר בדקה? התחילו במסלול המומלץ: הכירו את{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about/">
						הגישה המקצועית
					</Link>
					, עברו לעמוד{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
						השירותים
					</Link>
					, דפדפו ב־{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/">
						מאמרים
					</Link>
					, ואז העמיקו דרך{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories/">
						קטגוריות
					</Link>{' '}
					ו־{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags/">
						תגיות
					</Link>
					. אם תרצו יישום מיידי למצב שלכם, סיימו בעמוד{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
						יצירת קשר
					</Link>
					.
				</p>
				<ul className="max-w-3xl list-disc space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground">
					<li>
						<strong className="text-foreground">שלב 1:</strong> הכירו את{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about/">
							הרקע והגישה
						</Link>{' '}
						לפני כל החלטה.
					</li>
					<li>
						<strong className="text-foreground">שלב 2:</strong> מיינו נושא דרך{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/">
							מאמרים
						</Link>
						,{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories/">
							קטגוריות
						</Link>{' '}
						ו־{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags/">
							תגיות
						</Link>
						.
					</li>
					<li>
						<strong className="text-foreground">שלב 3:</strong> עברו ליישום מעשי עם{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
							פנייה ממוקדת
						</Link>
						.
					</li>
				</ul>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{quickStartLinks.map((link) => (
						<Link
							key={link.href}
							className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
							href={link.href}
						>
							{link.label}
						</Link>
					))}
				</div>
				<figure className="overflow-hidden rounded-xl border border-border/60 bg-background/80">
					<OptimizedImage
						src={homeImages[1].src}
						alt={homeImages[1].alt}
						title={homeImages[1].title}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
			</section>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="border-border/60 bg-card/70 shadow-sm">
					<CardHeader className="text-right">
						<CardTitle className="font-heading text-lg">בהירות מהירה</CardTitle>
						<CardDescription className="text-pretty">
							מסלולי עבודה מסודרים, שפה נקייה והתמקדות בתוצאה טובה לטווח ארוך.
						</CardDescription>
					</CardHeader>
				</Card>
				<Card className="border-border/60 bg-card/70 shadow-sm">
					<CardHeader className="text-right">
						<CardTitle className="font-heading text-lg">שירות פרימיום</CardTitle>
						<CardDescription className="text-pretty">
							ליווי מקצועי עם דגש על זמינות, אחריות ותיאום ציפיות מוקדם.
						</CardDescription>
					</CardHeader>
				</Card>
				<Card className="border-border/60 bg-card/70 shadow-sm">
					<CardHeader className="text-right">
						<CardTitle className="font-heading text-lg">תוכן מעשי</CardTitle>
						<CardDescription className="text-pretty">
							מאמרים וכלים שמחברים בין משפט ליישום יומיומי בצורה חיובית.
						</CardDescription>
					</CardHeader>
				</Card>
			</div>

			<Separator className="bg-border/60" />

			<HomeSeoContentSections homeImages={homeImages} />

			<section id="process" className="home-anchor-target flex flex-col gap-6 text-right" aria-labelledby="process-title">
				<h2 id="process-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					כך עובד התהליך כשמדברים עם גיא אבני עורך דין
				</h2>
				<div className="flex flex-wrap justify-end gap-2">
					<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
						שיטה מודולרית
					</span>
					<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
						מדידה ושיפור
					</span>
				</div>
				<p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">
					כדי להפוך תהליך משפטי למשהו ברור ומרגיע, חשוב לעבוד בסדר קבוע: מטרה, מיפוי, תוכנית וביצוע. כך מצמצמים אי־ודאות,
					מונעים טעויות יקרות ומתקדמים בקצב נכון לעסק או למשפחה.{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
						לעמוד השירותים המלא
					</Link>
					.
				</p>
				<ul className="max-w-3xl list-disc space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground">
					<li>
						<strong className="text-foreground">פחות אי־ודאות:</strong> כל שלב מוגדר מראש עם{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
							תוצר ברור
						</Link>
						.
					</li>
					<li>
						<strong className="text-foreground">יותר שליטה:</strong> תיעדוף נכון של משימות לפי{' '}
						<Link
							className="font-medium text-primary underline-offset-2 hover:underline"
							href="/blog/guy-avni-risk-management-routine/"
						>
							השפעה וסיכון
						</Link>
						.
					</li>
					<li>
						<strong className="text-foreground">קצב יציב:</strong> התקדמות עקבית בלי{' '}
						<Link
							className="font-medium text-primary underline-offset-2 hover:underline"
							href="/blog/guy-avni-process-improvement-for-legal-teams/"
						>
							עומס החלטות מיותר
						</Link>
						.
					</li>
				</ul>
				<div className="grid gap-4 md:grid-cols-2">
					{processSteps.map((step, index) => (
						<Card key={step.title} className="border-border/60 bg-card/70 shadow-sm">
							<CardHeader className="text-right">
								<CardDescription className="text-xs font-semibold text-primary">שלב {index + 1}</CardDescription>
								<CardTitle className="font-heading text-lg">{step.title}</CardTitle>
							</CardHeader>
							<CardContent className="text-right">
								<p className="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
							</CardContent>
						</Card>
					))}
				</div>
				<figure className="overflow-hidden rounded-xl border border-border/60 bg-background/80">
					<OptimizedImage
						src={homeImages[2].src}
						alt={homeImages[2].alt}
						title={homeImages[2].title}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
			</section>

			<FeaturedArticlesGrid posts={featuredPosts} />

			<section id="reading-paths" className="home-anchor-target flex flex-col gap-5 text-right" aria-labelledby="reading-paths-title">
				<h2 id="reading-paths-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					מסלולי קריאה מומלצים מאתר גיא אבני
				</h2>
				<div className="grid gap-5 lg:grid-cols-3">
					{readingPaths.map((path) => (
						<Card key={path.title} className="border-border/60 bg-card/70 shadow-sm">
							<CardHeader className="text-right">
								<CardTitle className="font-heading text-lg">{path.title}</CardTitle>
								<CardDescription className="leading-relaxed">{path.summary}</CardDescription>
							</CardHeader>
							<CardContent className="text-right">
								<ul className="space-y-2">
									{path.posts.map((post) => (
										<li key={post.id}>
											<Link
												className="text-sm font-medium text-primary underline-offset-2 hover:underline"
												href={`/blog/${post.id}/`}
											>
												{post.title}
											</Link>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					))}
				</div>
				<figure className="overflow-hidden rounded-xl border border-border/60 bg-background/80">
					<OptimizedImage
						src={homeImages[3].src}
						alt={homeImages[3].alt}
						title={homeImages[3].title}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
			</section>

			<section id="authority" className="home-anchor-target flex flex-col gap-5 text-right" aria-labelledby="authority-title">
				<h2 id="authority-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					למה לעבוד עם גיא אבני
				</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">בהירות לפני הכול</CardTitle>
							<CardDescription>כל החלטה מתורגמת לשפה עסקית ברורה: מה עושים עכשיו, מה מרוויחים ומה נמנע.</CardDescription>
						</CardHeader>
					</Card>
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">ליווי שמותאם לקצב שלכם</CardTitle>
							<CardDescription>תהליך מודולרי, גמיש ומדויק ללקוחות פרטיים ולעסקים שצריכים תוצאה ולא עומס נוסף.</CardDescription>
						</CardHeader>
					</Card>
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">גישה פרקטית למדידה ושיפור</CardTitle>
							<CardDescription>לא רק פותרים בעיה נקודתית, אלא בונים שגרה משפטית שתמשיך לעבוד גם בהמשך.</CardDescription>
						</CardHeader>
					</Card>
				</div>
				<figure className="overflow-hidden rounded-xl border border-border/60 bg-background/80">
					<OptimizedImage
						src={homeImages[4].src}
						alt={homeImages[4].alt}
						title={homeImages[4].title}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
				<p className="text-sm text-muted-foreground">
					רוצים להכיר את הרקע המקצועי והגישה המלאה?{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about/">
						לעמוד אודות
					</Link>
					.
				</p>
			</section>

			<section id="audience" className="home-anchor-target flex flex-col gap-5 text-right" aria-labelledby="audience-title">
				<h2 id="audience-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					למי גיא אבני עו״ד מלווה בפועל?
				</h2>
				<div className="grid gap-4 md:grid-cols-3">
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">לקוחות פרטיים</CardTitle>
							<CardDescription>כשצריך סדר, הסבר ברור ותוכנית מעשית לפני מהלך משמעותי.</CardDescription>
						</CardHeader>
						<CardContent className="text-right">
							<Link className="text-sm font-medium text-primary underline-offset-2 hover:underline" href="/services/">
								פתרונות ללקוחות פרטיים
							</Link>
						</CardContent>
					</Card>
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">מייסדים ויזמים</CardTitle>
							<CardDescription>ליווי מהיר סביב חוזים, תקשורת עם צדדים שלישיים וניהול סיכון בשלבי צמיחה.</CardDescription>
						</CardHeader>
						<CardContent className="text-right">
							<Link className="text-sm font-medium text-primary underline-offset-2 hover:underline" href="/blog/">
								מאמרים ליזמים
							</Link>
						</CardContent>
					</Card>
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">עסקים קטנים ובינוניים</CardTitle>
							<CardDescription>בניית שגרה משפטית יציבה: חוזים, נהלים ותגובות נכונות למצבי קצה.</CardDescription>
						</CardHeader>
						<CardContent className="text-right">
							<Link className="text-sm font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
								תיאום שיחת התאמה
							</Link>
						</CardContent>
					</Card>
				</div>
			</section>

			<section id="comparison" className="home-anchor-target flex flex-col gap-5 text-right" aria-labelledby="comparison-title">
				<h2 id="comparison-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					לבד מול ליווי משפטי - הפרספקטיבה של גיא אבני עו״ד
				</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">טיפול עצמאי</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-right text-sm text-muted-foreground">
							<p>
								חוסך בטווח המיידי, אך מגדיל סיכון ל־{' '}
								<Link
									className="font-medium text-primary underline-offset-2 hover:underline"
									href="/blog/guy-avni-evidence-prioritization-framework/"
								>
									טעויות
								</Link>{' '}
								שלא תמיד נראות בזמן אמת.
							</p>
							<p>
								דורש השקעת זמן גבוהה ב־{' '}
								<Link
									className="font-medium text-primary underline-offset-2 hover:underline"
									href="/blog/guy-avni-document-readiness-guide/"
								>
									בדיקת חומרים
								</Link>{' '}
								וקבלת החלטות תחת אי־ודאות.
							</p>
							<p>
								התוצאה תלויה בניסיון אישי וביכולת{' '}
								<Link
									className="font-medium text-primary underline-offset-2 hover:underline"
									href="/blog/guy-avni-process-improvement-for-legal-teams/"
								>
									לתעדף נכון
								</Link>{' '}
								בכל צומת.
							</p>
						</CardContent>
					</Card>
					<Card className="border-primary/20 bg-primary/5 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">ליווי משפטי מקצועי</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-right text-sm text-muted-foreground">
							<p>מספק מסגרת החלטה ברורה ומקטין טעויות עם השלכות כספיות ותפעוליות.</p>
							<p>מקצר את הדרך לתוצאה עם סדר עבודה, תיעדוף והכוונה מותאמת למקרה.</p>
							<p>מייצר שקט תפעולי וביטחון גבוה יותר לאורך התהליך.</p>
							<p>
								<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
									בדקו את מסלולי השירות
								</Link>{' '}
								או{' '}
								<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
									תאמו שיחה קצרה
								</Link>
								.
							</p>
						</CardContent>
					</Card>
				</div>
			</section>


			<section
				id="long-form-content"
				className="home-anchor-target home-deferred-section flex flex-col gap-6 text-right"
				aria-labelledby="long-form-content-title"
			>
				<h2 id="long-form-content-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					מדריכי עומק של גיא אבני לקבלת החלטות טובה יותר
				</h2>
				<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
					לפני מהלך משמעותי, כדאי לעצור ולהגדיר מטרה, מגבלות וסיכון שאי אפשר לקבל. שלושת אלה מונעים החלטות תחת לחץ ומאפשרים
					תוכנית ברורה. להעמקה, קראו את{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/guy-avni-long-term-legal-strategy/">
						אסטרטגיה משפטית לטווח ארוך
					</Link>
					,{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/guy-avni-contract-review-flow/">
						בדיקת חוזים לפני חתימה
					</Link>
					,{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/guy-avni-risk-management-routine/">
						שגרת ניהול סיכונים
					</Link>{' '}
					ו־{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/guy-avni-client-trust-roadmap/">
						מפת אמון לקוח
					</Link>
					. ליישום מותאם, עברו ל־{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
						שירותים
					</Link>{' '}
					או{' '}
					<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
						יצירת קשר
					</Link>
					.
				</p>
			</section>

			<LatestInsightsStrip posts={latestPosts} />

			<section className="home-anchor-target flex flex-col gap-4 text-right" aria-labelledby="taxonomy-title" id="taxonomy-links">
				<h2 id="taxonomy-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					ניווט מהיר לפי נושאים סביב גיא אבני
				</h2>
				<div className="grid gap-5 lg:grid-cols-2">
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">קטגוריות מובילות</CardTitle>
							<CardDescription>תחומים עם נפח התוכן הגבוה ביותר באתר.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-2">
							{popularCategories.map((category) => (
								<Link
									key={category.name}
									className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
									href={`/categories/${category.name}/`}
								>
									{category.name}
									<span className="text-xs text-muted-foreground">({category.count})</span>
								</Link>
							))}
						</CardContent>
					</Card>
					<Card className="border-border/60 bg-card/70 shadow-sm">
						<CardHeader className="text-right">
							<CardTitle className="font-heading text-lg">תגיות מובילות</CardTitle>
							<CardDescription>נושאי עומק שחוזרים במאמרים ויכולים לקצר לכם את החיפוש.</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-wrap gap-2">
							{popularTags.map((tag) => (
								<Link
									key={tag.name}
									className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
									href={`/tags/${tag.name}/`}
								>
									{tag.name}
									<span className="text-xs text-muted-foreground">({tag.count})</span>
								</Link>
							))}
						</CardContent>
					</Card>
				</div>
			</section>

			<FaqAccordion items={faqItems} />

			<figure className="home-anchor-target overflow-hidden rounded-xl border border-border/60 bg-background/80" id="home-image-final">
				<OptimizedImage
					src={homeImages[6].src}
					alt={homeImages[6].alt}
					title={homeImages[6].title}
					className="h-56 w-full object-cover sm:h-64"
				/>
			</figure>

			<Card className="home-anchor-target border-primary/20 bg-primary/5 shadow-sm" id="premium-cta">
				<CardContent className="flex flex-col gap-4 p-8 text-right sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-2">
						<p className="font-heading text-lg font-semibold text-foreground">מוכנים לעבור משאלות לתוכנית עבודה ברורה?</p>
						<p className="text-sm text-muted-foreground">
							נמפה את המצב, נגדיר סדר עדיפויות, ונצא לדרך עם צעדים פרקטיים שמתאימים בדיוק למטרות שלכם.
						</p>
					</div>
					<div className="flex flex-wrap items-center justify-end gap-3">
						<Link className={cn(buttonVariants({ size: 'lg' }))} href="/contact/">
							צור קשר עכשיו
						</Link>
						<Link className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))} href="/services/">
							למסלולי השירות
						</Link>
					</div>
				</CardContent>
			</Card>

			<div
				className="mobile-bottom-cta fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-4 py-3 shadow-lg md:hidden"
				dir="rtl"
			>
				<div className="mx-auto flex w-full max-w-6xl gap-2 pb-[env(safe-area-inset-bottom)]">
					<Link className={cn(buttonVariants({ size: 'lg' }), 'flex-1')} href="/contact/">
						צור קשר
					</Link>
					<Link className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'flex-1')} href="/blog/">
						מאמרים
					</Link>
				</div>
			</div>
		</section>
	);
}

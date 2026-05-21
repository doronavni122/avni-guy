import Link from 'next/link';
import { FaqAccordion } from '@/components/home/FaqAccordion';
import { HomeSeoContentSections } from '@/components/home/HomeSeoContentSections';
import { FeaturedArticlesGrid } from '@/components/home/FeaturedArticlesGrid';
import { HomeMiniToc } from '@/components/home/HomeMiniToc';
import { LatestInsightsStrip } from '@/components/home/LatestInsightsStrip';
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
						<img
							src={homeImages[0].src}
							alt={homeImages[0].alt}
							title={homeImages[0].title}
							loading="eager"
							width={1400}
							height={900}
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
					<img
						src={homeImages[1].src}
						alt={homeImages[1].alt}
						title={homeImages[1].title}
						loading="lazy"
						width={1400}
						height={900}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
			</section>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="border-border/60 bg-card/70 shadow-sm backdrop-blur-sm">
					<CardHeader className="text-right">
						<CardTitle className="font-heading text-lg">בהירות מהירה</CardTitle>
						<CardDescription className="text-pretty">
							מסלולי עבודה מסודרים, שפה נקייה והתמקדות בתוצאה טובה לטווח ארוך.
						</CardDescription>
					</CardHeader>
				</Card>
				<Card className="border-border/60 bg-card/70 shadow-sm backdrop-blur-sm">
					<CardHeader className="text-right">
						<CardTitle className="font-heading text-lg">שירות פרימיום</CardTitle>
						<CardDescription className="text-pretty">
							ליווי מקצועי עם דגש על זמינות, אחריות ותיאום ציפיות מוקדם.
						</CardDescription>
					</CardHeader>
				</Card>
				<Card className="border-border/60 bg-card/70 shadow-sm backdrop-blur-sm">
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
					<img
						src={homeImages[2].src}
						alt={homeImages[2].alt}
						title={homeImages[2].title}
						loading="lazy"
						width={1400}
						height={900}
						className="h-52 w-full object-cover sm:h-60"
					/>
				</figure>
			</section>

			<FeaturedArticlesGrid posts={featuredPosts} />

			<section id="reading-paths" className="home-anchor-target flex flex-col gap-5 text-right" aria-labelledby="reading-paths-title">
				<h2 id="reading-paths-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					מסלולי קריאה מומלצים מאתר אבני גיא
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
					<img
						src={homeImages[3].src}
						alt={homeImages[3].alt}
						title={homeImages[3].title}
						loading="lazy"
						width={1400}
						height={900}
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
					<img
						src={homeImages[4].src}
						alt={homeImages[4].alt}
						title={homeImages[4].title}
						loading="lazy"
						width={1400}
						height={900}
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
					למי גיא אבני עוד מלווה בפועל?
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
					לבד מול ליווי משפטי — הפרספקטיבה של אבני גיא עוד
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

			<section id="long-form-content" className="home-anchor-target flex flex-col gap-8 text-right" aria-labelledby="long-form-content-title">
				<h2 id="long-form-content-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					מדריכי עומק של גיא אבני לקבלת החלטות טובה יותר
				</h2>

				<div className="space-y-4">
					<h3 className="font-heading text-xl font-semibold text-foreground">
						ייעוץ משפטי חכם: איך גיא אבני פותח כל מפגש בהגדרת מטרה ברורה
					</h3>
					<div className="flex flex-wrap justify-end gap-2">
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							אסטרטגיה
						</span>
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							יעד ומיקוד
						</span>
					</div>
					<h4 className="font-heading text-lg font-semibold text-foreground">שלוש שאלות פתיחה שגיא אבני עוד חוזר אליהן בכל תיק</h4>
					<ul className="max-w-4xl list-disc space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
						<li>
							<strong className="text-foreground">מה היעד המרכזי?</strong> איזו{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-long-term-legal-strategy/"
							>
								תוצאה מעשית
							</Link>{' '}
							נחשבת הצלחה.
						</li>
						<li>
							<strong className="text-foreground">מה המגבלות?</strong>{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-time-management-for-legal-work/"
							>
								זמן, תקציב ואילוצים תפעוליים
							</Link>{' '}
							שחייבים לכבד.
						</li>
						<li>
							<strong className="text-foreground">איזה סיכון לא מקבלים?</strong> הגבול שממנו לא ממשיכים בלי{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-dispute-prevention-method/"
							>
								התאמה
							</Link>
							.
						</li>
					</ul>
					<h5 className="font-heading text-base font-semibold text-foreground">צעדים מומלצים אחרי שיחה ראשונה עם גיא אבני</h5>
					<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
						אחת הטעויות השכיחות בתחילת תהליך משפטי היא להיכנס לפעולה לפני שמגדירים מה רוצים להשיג. אחרי שמבהירים את שלושת
						היסודות, ההחלטות נעשות פשוטות, מהירות ובטוחות יותר. בשלב הזה מומלץ לקרוא על הגישה המקצועית בעמוד{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about/">
							אודות
						</Link>
						, להבין את מסלולי העבודה בעמוד{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
							שירותים
						</Link>
						, ולבסוף לקבוע צעד ראשון מעשי דרך{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
							יצירת קשר
						</Link>
						. השילוב הזה יוצר מעבר מהיר מתיאוריה לביצוע, עם{' '}
						<strong className="text-foreground">פחות רעש ויותר ודאות</strong> לאורך הדרך.
					</p>
				</div>

				<div className="space-y-4">
					<h3 className="font-heading text-xl font-semibold text-foreground">לפני חתימה עם גיא אבני עורך דין — חמש בדיקות שחוסכות כסף</h3>
					<div className="flex flex-wrap justify-end gap-2">
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							חוזים
						</span>
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							בדיקת סיכון
						</span>
					</div>
					<h4 className="font-heading text-lg font-semibold text-foreground">צ&apos;קליסט חתימה קצר — ניסוח גיא אבני לבדיקה לפני עט</h4>
					<ol className="max-w-4xl list-decimal space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
						<li>
							<strong className="text-foreground">הגדרת שירות/מוצר:</strong> היקף ברור שמונע{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-contract-review-flow/"
							>
								פרשנות כפולה
							</Link>
							.
						</li>
						<li>
							<strong className="text-foreground">מנגנון תשלום:</strong> מועדים, תנאים וחריגים בצורה חד־משמעית לפי{' '}
							<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories/">
								קטגוריות
							</Link>
							.
						</li>
						<li>
							<strong className="text-foreground">אחריות וסייגים:</strong> מה כל צד מתחייב ומה מחוץ למסגרת לפי{' '}
							<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags/">
								תגיות
							</Link>
							.
						</li>
						<li>
							<strong className="text-foreground">תנאי יציאה:</strong> איך מסיימים התקשרות בלי{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-negotiation-clarity-principles/"
							>
								חיכוך מיותר
							</Link>
							.
						</li>
						<li>
							<strong className="text-foreground">פתרון מחלוקות:</strong>{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-dispute-prevention-method/"
							>
								מסלול מוסכם
							</Link>{' '}
							עוד לפני שיש מחלוקת.
						</li>
					</ol>
					<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
						כל סעיף נראה לעיתים טכני, אבל בפועל הוא זה שקובע אם התהליך יישאר בשליטה גם כשמשהו משתבש. בדיקה מוקדמת לא נועדה
						להאט עסקה אלא להפוך אותה ל־<strong className="text-foreground">בטוחה, הוגנת וברורה</strong> לשני הצדדים.
						כדי להעמיק, כדאי להתחיל ברשימת{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/blog/">
							המאמרים
						</Link>
						, למקד תחום עניין דרך{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/categories/">
							קטגוריות
						</Link>
						, ולחדד נושא ספציפי באמצעות{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/tags/">
							תגיות
						</Link>
						. כך אפשר להגיע לחתימה מתוך הבנה מלאה של ההשלכות ולא מתוך לחץ של הרגע האחרון.
					</p>
				</div>

				<div className="space-y-4">
					<h3 className="font-heading text-xl font-semibold text-foreground">שגרת סיכונים שגיא אבני משרד עורכי דין ממליץ לעגן ברבעון</h3>
					<div className="flex flex-wrap justify-end gap-2">
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							ניהול סיכונים
						</span>
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							שגרה חודשית
						</span>
					</div>
					<h4 className="font-heading text-lg font-semibold text-foreground">מוקדי בקרה שסביבם בונה אבני גיא שגרת ניהול סיכונים</h4>
					<ul className="max-w-4xl list-disc space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
						<li>
							<strong className="text-foreground">חוזים פעילים:</strong> זיהוי סעיפים שדורשים{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-contract-review-flow/"
							>
								עדכון או התראה מוקדמת
							</Link>
							.
						</li>
						<li>
							<strong className="text-foreground">תקשורת לקוחות:</strong>{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-communication-strategy-for-clients/"
							>
								תיעוד התחייבויות ותיאום ציפיות רציף
							</Link>
							.
						</li>
						<li>
							<strong className="text-foreground">ספקים קריטיים:</strong> בקרה על{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-collaboration-with-external-experts/"
							>
								תלות תפעולית ונקודות כשל אפשריות
							</Link>
							.
						</li>
					</ul>
					<figure className="overflow-hidden rounded-xl border border-border/60 bg-background/80">
						<img
							src={homeImages[5].src}
							alt={homeImages[5].alt}
							title={homeImages[5].title}
							loading="lazy"
							width={1400}
							height={900}
							className="h-52 w-full object-cover sm:h-60"
						/>
					</figure>
					<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
						ניהול סיכונים אפקטיבי הוא לא פעולה חד־פעמית אלא שגרה קבועה. עסקים שמתחזקים בדיקה חודשית, תיעוד החלטות ועדכון נהלים,
						מצליחים לזהות בעיות מוקדם ולמנוע מהן להפוך למשבר. התחלה טובה היא קריאה ממוקדת של{' '}
						<Link
							className="font-medium text-primary underline-offset-2 hover:underline"
							href="/blog/guy-avni-risk-management-routine/"
						>
							שגרת ניהול סיכונים
						</Link>
						, ואז חיבור היישום למסלולים הפרקטיים בעמוד{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/services/">
							שירותים
						</Link>
						. אם תרצו לבנות שגרה מותאמת לענף, לגודל החברה וליעדים שלכם, אפשר להתקדם מיד דרך{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
							יצירת קשר
						</Link>{' '}
						ולתכנן <strong className="text-foreground">תוכנית עבודה מדויקת</strong>.
					</p>
				</div>

				<div className="space-y-4">
					<h3 className="font-heading text-xl font-semibold text-foreground">איך בונים אמון לקוח — מתודולוגיה שמזינה את אבני גיא</h3>
					<div className="flex flex-wrap justify-end gap-2">
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							אמון לקוח
						</span>
						<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
							תקשורת ברורה
						</span>
					</div>
					<h4 className="font-heading text-lg font-semibold text-foreground">שלושה עקרונות אמון מהניסיון של גיא אבני משרד עורכי דין</h4>
					<ul className="max-w-4xl list-disc space-y-2 pr-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
						<li>
							<strong className="text-foreground">שקיפות:</strong>{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-client-onboarding-framework/"
							>
								להסביר מה קורה עכשיו ומה צפוי בהמשך
							</Link>
							.
						</li>
						<li>
							<strong className="text-foreground">עקביות:</strong>{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-service-quality-standards/"
							>
								לקיים שגרת עדכונים קצרה וקבועה
							</Link>
							.
						</li>
						<li>
							<strong className="text-foreground">סיכום בכתב:</strong>{' '}
							<Link
								className="font-medium text-primary underline-offset-2 hover:underline"
								href="/blog/guy-avni-document-readiness-guide/"
							>
								לתעד החלטות משמעותיות למעקב רציף
							</Link>
							.
						</li>
					</ul>
					<h5 className="font-heading text-base font-semibold text-foreground">להתחיל כבר השבוע עם אבני גיא עוד — בלי דחיינות</h5>
					<p className="max-w-4xl text-pretty leading-relaxed text-muted-foreground">
						לקוחות לא מחפשים רק תשובה משפטית נכונה; הם רוצים להבין מה קורה עכשיו, מה צפוי בהמשך, ואיך כל החלטה משרתת את
						המטרה שלהם. מי שמאמץ את הכללים האלה מייצר{' '}
						<strong className="text-foreground">פחות חיכוך ויותר שיתוף פעולה</strong>. כדי להתחיל, מומלץ לעבור על המאמר{' '}
						<Link
							className="font-medium text-primary underline-offset-2 hover:underline"
							href="/blog/guy-avni-client-trust-roadmap/"
						>
							מפת אמון לקוח
						</Link>
						, להכיר את התפיסה המקצועית הרחבה בעמוד{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/about/">
							אודות
						</Link>
						, ולבסוף לתאם שיחה ממוקדת דרך{' '}
						<Link className="font-medium text-primary underline-offset-2 hover:underline" href="/contact/">
							יצירת קשר
						</Link>{' '}
						כדי לתרגם את העקרונות לתוכנית מעשית עבור המקרה שלכם.
					</p>
				</div>
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
				<img
					src={homeImages[6].src}
					alt={homeImages[6].alt}
					title={homeImages[6].title}
					loading="lazy"
					width={1400}
					height={900}
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
				className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 px-4 py-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
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

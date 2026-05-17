import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/lib/home/loadHomeData';

type FaqAccordionProps = {
	items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
	return (
		<section id="faq" className="home-anchor-target flex flex-col gap-5 text-right" aria-labelledby="faq-title">
			<div className="flex flex-col gap-2">
				<h2 id="faq-title" className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					שאלות נפוצות לפני שמדברים עם גיא אבני משרד עורכי דין
				</h2>
				<div className="flex flex-wrap justify-end gap-2">
					<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
						שאלות נפוצות
					</span>
					<span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold text-foreground">
						התחלה מהירה
					</span>
				</div>
				<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					התשובות הבאות נועדו להסיר חסמים ראשוניים ולתת לכם ודאות לגבי הצעד הראשון.
				</p>
			</div>
			<div className="grid gap-3">
				{items.map((item) => (
					<details
						key={item.question}
						className="rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm open:border-primary/30 open:bg-primary/5"
					>
						<summary className="cursor-pointer list-none font-semibold text-foreground [&::-webkit-details-marker]:hidden">
							<span className="inline-flex items-center gap-2">
								<span className="text-primary">+</span>
								<strong>{item.question}</strong>
							</span>
						</summary>
						<p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
					</details>
				))}
			</div>
			<div>
				<Link className={cn(buttonVariants({ size: 'lg' }))} href="/contact/">
					רוצים תשובה מותאמת? צרו קשר
				</Link>
			</div>
		</section>
	);
}

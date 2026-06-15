import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
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
					<Badge variant="outline">שאלות נפוצות</Badge>
					<Badge variant="outline">התחלה מהירה</Badge>
				</div>
				<p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
					התשובות הבאות נועדו להסיר חסמים ראשוניים ולתת לכם ודאות לגבי הצעד הראשון.
				</p>
			</div>
			<Accordion className="flex flex-col gap-3">
				{items.map((item) => (
					<AccordionItem
						key={item.question}
						value={item.question}
						className="rounded-xl border border-border/60 bg-card/70 px-4 shadow-sm last:border-b"
					>
						<AccordionTrigger className="text-right font-semibold text-foreground hover:no-underline">
							<strong>{item.question}</strong>
						</AccordionTrigger>
						<AccordionContent className="text-right">
							<p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<div>
				<Link className={cn(buttonVariants({ size: 'lg' }))} href="/contact/">
					רוצים תשובה מותאמת? צרו קשר
				</Link>
			</div>
		</section>
	);
}

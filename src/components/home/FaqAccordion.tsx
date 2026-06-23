import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/lib/home/loadHomeData';

type FaqAccordionProps = {
	items: FaqItem[];
};

/** Editorial Q&A: a kicker + serif headline, then serif questions on hairline rules. */
export function FaqAccordion({ items }: FaqAccordionProps) {
	return (
		<PageSection id="faq">
			<div className="flex items-baseline justify-between gap-4 border-t-2 border-foreground pt-3">
				<p className="kicker">שאלות נפוצות</p>
				<span className="folio text-base" aria-hidden="true">08</span>
			</div>
			<h2
				id="faq-title"
				className="max-w-3xl font-serif text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl"
			>
				שאלות נפוצות לפני שמדברים עם גיא אבני משרד עורכי דין
			</h2>
			<p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
				התשובות הבאות נועדו להסיר חסמים ראשוניים ולתת לכם ודאות לגבי הצעד הראשון.
			</p>
			<Accordion className="mt-4 flex flex-col border-t-2 border-foreground">
				{items.map((item, index) => (
					<AccordionItem key={item.question} value={item.question} className="border-b border-border">
						<AccordionTrigger className="gap-4 py-5 text-right hover:no-underline">
							<span className="flex items-baseline gap-3">
								<span className="folio shrink-0 text-sm" aria-hidden="true">
									{String(index + 1).padStart(2, '0')}
								</span>
								<strong className="font-serif text-xl font-bold text-foreground">{item.question}</strong>
							</span>
						</AccordionTrigger>
						<AccordionContent className="text-right">
							<p className="ps-9 text-pretty leading-relaxed text-muted-foreground">{item.answer}</p>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<div className="mt-8">
				<Link className={cn(buttonVariants({ size: 'lg' }), 'no-rule rounded-sm font-serif text-base')} href="/contact/">
					רוצים תשובה מותאמת? צרו קשר
				</Link>
			</div>
		</PageSection>
	);
}

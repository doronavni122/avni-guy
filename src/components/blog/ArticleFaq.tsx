import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PremiumPanel } from '@/components/layout/PremiumPanel';
import type { BlogFaqItem } from '@/lib/content/schema';

type ArticleFaqProps = {
	items: BlogFaqItem[];
};

export function ArticleFaq({ items }: ArticleFaqProps) {
	if (items.length === 0) return null;

	return (
		<PremiumPanel className="mt-12 text-right">
			<section aria-labelledby="article-faq-heading">
				<div className="mb-6 flex items-center justify-end gap-3 border-b border-border pb-4">
					<h2 id="article-faq-heading" className="font-heading text-2xl font-semibold text-foreground">
						שאלות נפוצות
					</h2>
					<span className="swiss-label">FAQ</span>
				</div>
				<Accordion className="flex flex-col">
					{items.map((item) => (
						<AccordionItem key={item.question} value={item.question} className="border-b border-border">
							<AccordionTrigger className="py-4 text-right font-semibold text-foreground hover:no-underline">
								{item.question}
							</AccordionTrigger>
							<AccordionContent className="text-right text-sm leading-relaxed text-muted-foreground">
								{item.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>
		</PremiumPanel>
	);
}

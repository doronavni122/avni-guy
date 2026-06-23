import Link from 'next/link';
import { PageSection } from '@/components/layout/PageSection';
import { PremiumPanel } from '@/components/layout/PremiumPanel';
import { SectionHeader } from '@/components/layout/SectionHeader';
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
		<PageSection id="faq">
			<PremiumPanel>
				<SectionHeader
					id="faq-title"
					eyebrow="שאלות נפוצות / FAQ"
					index={11}
					title="שאלות נפוצות לפני שמדברים עם גיא אבני משרד עורכי דין"
					description="התשובות הבאות נועדו להסיר חסמים ראשוניים ולתת לכם ודאות לגבי הצעד הראשון."
					badges={
						<>
							<Badge variant="outline" className="rounded-sm">שאלות נפוצות</Badge>
							<Badge variant="outline" className="rounded-sm">התחלה מהירה</Badge>
						</>
					}
				/>
				<Accordion className="mt-6 flex flex-col border-t border-border">
					{items.map((item) => (
						<AccordionItem
							key={item.question}
							value={item.question}
							className="border-b border-border"
						>
							<AccordionTrigger className="py-4 text-right font-semibold text-foreground hover:no-underline">
								<strong>{item.question}</strong>
							</AccordionTrigger>
							<AccordionContent className="text-right">
								<p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
				<div className="mt-6">
					<Link className={cn(buttonVariants({ size: 'lg' }), 'rounded-sm')} href="/contact/">
						רוצים תשובה מותאמת? צרו קשר
					</Link>
				</div>
			</PremiumPanel>
		</PageSection>
	);
}

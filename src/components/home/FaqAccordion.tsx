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
					title="שאלות נפוצות לפני שמדברים עם גיא אבני משרד עורכי דין"
					description="התשובות הבאות נועדו להסיר חסמים ראשוניים ולתת לכם ודאות לגבי הצעד הראשון."
					badges={
						<>
							<Badge variant="outline">שאלות נפוצות</Badge>
							<Badge variant="outline">התחלה מהירה</Badge>
						</>
					}
				/>
				<Accordion className="mt-6 flex flex-col gap-3">
					{items.map((item) => (
						<AccordionItem
							key={item.question}
							value={item.question}
							className="rounded-xl border border-border/60 bg-background/60 px-4 shadow-sm last:border-b"
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
				<div className="mt-6">
					<Link className={cn(buttonVariants({ size: 'lg' }))} href="/contact/">
						רוצים תשובה מותאמת? צרו קשר
					</Link>
				</div>
			</PremiumPanel>
		</PageSection>
	);
}

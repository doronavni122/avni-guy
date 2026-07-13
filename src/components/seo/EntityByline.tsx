import Link from 'next/link';

type EntityBylineProps = {
	/** Visible freshness label, e.g. "יולי 2026" */
	lastUpdatedLabel?: string;
};

export function EntityByline({ lastUpdatedLabel }: EntityBylineProps) {
	return (
		<p className="max-w-3xl text-pretty text-right text-sm leading-relaxed text-muted-foreground">
			<Link className="link-underline font-medium text-foreground" href="/about/">
				גיא אבני, עו״ד
			</Link>
			{' · גיא אבני משרד עורכי דין · '}
			<Link className="link-underline" href="/about/#person">
				רקע מקצועי
			</Link>
			{lastUpdatedLabel ? (
				<>
					{' · '}
					<span>עודכן {lastUpdatedLabel}</span>
				</>
			) : null}
		</p>
	);
}

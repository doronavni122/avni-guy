'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type SearchHit = {
	title: string;
	url: string;
	snippet?: string;
};

export function SearchResults() {
	const searchParams = useSearchParams();
	const q = searchParams.get('q')?.trim() ?? '';
	const [hits, setHits] = useState<SearchHit[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!q || q.length < 2) {
			setHits([]);
			setError(null);
			return;
		}

		let cancelled = false;
		setLoading(true);
		setError(null);

		fetch(`/api/search/?q=${encodeURIComponent(q)}`)
			.then(async (res) => {
				if (!res.ok) {
					const body = (await res.json().catch(() => ({}))) as { error?: string };
					throw new Error(body.error ?? `HTTP ${res.status}`);
				}
				return res.json() as Promise<{ results?: SearchHit[] }>;
			})
			.then((data) => {
				if (!cancelled) {
					setHits(data.results ?? []);
				}
			})
			.catch((err: unknown) => {
				console.error('[SearchResults] fetch failed', { q, err });
				if (!cancelled) {
					setError('שגיאה בחיפוש. נסו שוב.');
					setHits([]);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [q]);

	if (!q) {
		return <p className="mt-8 text-muted-foreground">הקלידו מילת חיפוש בשדה הכתובת (?q=).</p>;
	}

	if (loading) {
		return <p className="mt-8 text-muted-foreground">מחפש…</p>;
	}

	if (error) {
		return <p className="mt-8 text-destructive">{error}</p>;
	}

	if (hits.length === 0) {
		return <p className="mt-8 text-muted-foreground">לא נמצאו תוצאות עבור &quot;{q}&quot;.</p>;
	}

	return (
		<ul className="mt-8 flex flex-col gap-4">
			{hits.map((hit) => (
				<li key={hit.url} className="border-b border-border pb-4">
					<Link className="link-underline font-semibold text-foreground" href={hit.url}>
						{hit.title}
					</Link>
					{hit.snippet ? <p className="mt-1 text-sm text-muted-foreground">{hit.snippet}</p> : null}
				</li>
			))}
		</ul>
	);
}

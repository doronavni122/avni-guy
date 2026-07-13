'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { TagCloudGroup } from '@/lib/seo/tag-cloud-groups';

type TagsCloudGroupedProps = {
	groups: TagCloudGroup[];
};

export function TagsCloudGrouped({ groups }: TagsCloudGroupedProps) {
	const [query, setQuery] = useState('');

	const filteredGroups = useMemo(() => {
		const q = query.trim();
		if (!q) {
			return groups;
		}
		return groups
			.map((group) => ({
				...group,
				tags: group.tags.filter(
					(tag) => tag.label.includes(q) || tag.slug.includes(q.toLowerCase()),
				),
			}))
			.filter((group) => group.tags.length > 0);
	}, [groups, query]);

	const totalVisible = filteredGroups.reduce((sum, g) => sum + g.tags.length, 0);

	return (
		<div className="flex flex-col gap-6">
			<label className="flex max-w-md flex-col gap-2 text-right">
				<span className="text-sm font-medium text-foreground">חיפוש תגית</span>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="לדוגמה: שכירות, מס רכישה, חוזה"
					className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground"
					dir="rtl"
					aria-controls="tags-cloud-groups"
				/>
			</label>

			{query.trim() ? (
				<p className="text-sm text-muted-foreground">
					{totalVisible > 0 ? `${totalVisible} תגיות תואמות` : 'לא נמצאו תגיות — נסו מונח אחר'}
				</p>
			) : null}

			<div id="tags-cloud-groups" className="flex flex-col gap-10">
				{filteredGroups.map((group) => (
					<section key={group.id} aria-labelledby={`tag-group-${group.id}`}>
						<h3
							id={`tag-group-${group.id}`}
							className="font-heading text-lg font-semibold text-foreground"
						>
							{group.label}{' '}
							<span className="text-sm font-normal text-muted-foreground">({group.tags.length})</span>
						</h3>
						<div className="mt-4 flex flex-wrap justify-end gap-px border border-border bg-border">
							{group.tags.map((tag) => (
								<Link
									key={tag.slug}
									className="bg-background px-5 py-3 font-heading text-sm font-semibold text-foreground no-underline transition-colors hover:bg-primary hover:text-primary-foreground"
									href={`/tags/${tag.slug}/`}
								>
									{tag.label} ({tag.count})
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}

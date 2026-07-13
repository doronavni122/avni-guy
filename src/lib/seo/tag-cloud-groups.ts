/** Tag cloud IA: topic clusters for /tags/ hub (TAG-011). */

import type { BlogPost } from '@/lib/content/schema';

export type TagCloudEntry = {
	slug: string;
	label: string;
	count: number;
};

export type TagCloudGroup = {
	id: string;
	label: string;
	tags: TagCloudEntry[];
};

/** Maps post category slug → display group id. */
const CATEGORY_TO_GROUP: Record<string, string> = {
	'real-estate': 'real-estate',
	'real-estate-law': 'real-estate',
	tax: 'real-estate',
	contracts: 'contracts',
	litigation: 'contracts',
	consumer: 'contracts',
	family: 'family',
	employment: 'family',
	benefits: 'family',
	business: 'business',
	operations: 'business',
	strategy: 'business',
	service: 'general',
	insurance: 'general',
	medical: 'general',
	documents: 'general',
	communication: 'general',
	criminal: 'general',
	traffic: 'general',
};

const GROUP_LABELS: Record<string, string> = {
	'real-estate': 'נדל״ן ומיסוי',
	contracts: 'חוזים וליטיגציה',
	family: 'משפחה, עבודה והטבות',
	business: 'עסקים ואסטרטגיה',
	general: 'שירות, ביטוח וכללי',
};

const GROUP_ORDER = ['real-estate', 'contracts', 'family', 'business', 'general'] as const;

function resolveTagGroup(categoryVotes: Map<string, number>): string {
	let bestCategory = '';
	let bestCount = 0;
	for (const [category, count] of categoryVotes) {
		if (count > bestCount) {
			bestCount = count;
			bestCategory = category;
		}
	}
	const groupId = CATEGORY_TO_GROUP[bestCategory];
	if (!groupId) {
		console.error('[tag-cloud-groups] unmapped category for tag group', { bestCategory });
		return 'general';
	}
	return groupId;
}

export function buildTagCloudGroups(
	tags: string[],
	posts: BlogPost[],
	countByTag: Map<string, number>,
	getLabel: (slug: string) => string,
): TagCloudGroup[] {
	const categoryVotesByTag = new Map<string, Map<string, number>>();

	for (const post of posts) {
		const category = post.data.category;
		for (const tag of post.data.tags) {
			const votes = categoryVotesByTag.get(tag) ?? new Map<string, number>();
			votes.set(category, (votes.get(category) ?? 0) + 1);
			categoryVotesByTag.set(tag, votes);
		}
	}

	const buckets = new Map<string, TagCloudEntry[]>();
	for (const groupId of GROUP_ORDER) {
		buckets.set(groupId, []);
	}

	for (const slug of tags) {
		const votes = categoryVotesByTag.get(slug) ?? new Map<string, number>();
		const groupId = resolveTagGroup(votes);
		const entry: TagCloudEntry = {
			slug,
			label: getLabel(slug),
			count: countByTag.get(slug) ?? 0,
		};
		buckets.get(groupId)?.push(entry);
	}

	return GROUP_ORDER.map((id) => ({
		id,
		label: GROUP_LABELS[id] ?? id,
		tags: (buckets.get(id) ?? []).sort((a, b) => a.label.localeCompare(b.label, 'he')),
	})).filter((group) => group.tags.length > 0);
}

/** Collapse duplicate Hebrew labels — keep slug with highest post count. */
export function dedupeTagCloudGroups(groups: TagCloudGroup[]): TagCloudGroup[] {
	return groups.map((group) => {
		const byLabel = new Map<string, TagCloudEntry>();
		for (const tag of group.tags) {
			const existing = byLabel.get(tag.label);
			if (!existing || tag.count > existing.count) {
				byLabel.set(tag.label, tag);
			}
		}
		return {
			...group,
			tags: [...byLabel.values()].sort((a, b) => a.label.localeCompare(b.label, 'he')),
		};
	});
}

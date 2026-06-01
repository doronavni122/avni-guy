import { config, fields, collection } from '@keystatic/core';
import { SITE_KEYWORDS } from '@/consts';

function parseGithubRepo(repo: string): { owner: string; name: string } {
	const [owner, name] = repo.split('/');
	if (!owner || !name) {
		console.error('[keystatic] ERROR invalid KEYSTATIC_GITHUB_REPO format', { repo });
		throw new Error('KEYSTATIC_GITHUB_REPO must be owner/repo');
	}
	return { owner, name };
}

function getStorage() {
	if (process.env.KEYSTATIC_STORAGE_KIND === 'github') {
		const repo = process.env.KEYSTATIC_GITHUB_REPO;
		if (!repo) {
			console.error('[keystatic] ERROR KEYSTATIC_GITHUB_REPO required for github storage');
			throw new Error('KEYSTATIC_GITHUB_REPO is required when KEYSTATIC_STORAGE_KIND=github');
		}
		return {
			kind: 'github' as const,
			repo: parseGithubRepo(repo),
			branchPrefix: 'keystatic/',
		};
	}
	return { kind: 'local' as const };
}

export default config({
	storage: getStorage(),
	collections: {
		blog: collection({
			label: 'Blog',
			slugField: 'slug',
			path: 'src/content/blog/*',
			format: { contentField: 'content' },
			schema: {
				slug: fields.slug({
					name: { label: 'Slug (URL)' },
				}),
				title: fields.text({ label: 'Title', validation: { isRequired: true } }),
				description: fields.text({ label: 'Description', validation: { isRequired: true } }),
				metaTitle: fields.text({ label: 'Meta title', validation: { isRequired: true } }),
				metaDescription: fields.text({
					label: 'Meta description',
					validation: { isRequired: true },
				}),
				mainKeyword: fields.select({
					label: 'Main keyword',
					options: SITE_KEYWORDS.map((keyword) => ({ label: keyword, value: keyword })),
					defaultValue: SITE_KEYWORDS[0],
				}),
				secondaryKeywords: fields.array(fields.text({ label: 'Secondary / LSI keyword' }), {
					label: 'Secondary keywords (4-6 recommended)',
					itemLabel: (props) => props.value || 'Keyword',
				}),
	contentType: fields.select({
					label: 'Content type',
					options: [
						{ label: 'Cluster', value: 'cluster' },
						{ label: 'Pillar', value: 'pillar' },
					],
					defaultValue: 'cluster',
				}),
				geoKeywords: fields.array(fields.text({ label: 'Geo keyword' }), {
					label: 'Geo keywords (optional)',
					itemLabel: (props) => props.value || 'Geo',
				}),
				faq: fields.array(
					fields.object({
						question: fields.text({ label: 'Question', validation: { isRequired: true } }),
						answer: fields.text({ label: 'Answer', multiline: true, validation: { isRequired: true } }),
					}),
					{
						label: 'FAQ (4-8 for schema)',
						itemLabel: (props) => props.fields.question.value || 'FAQ item',
					},
				),
				materialChange: fields.checkbox({ label: 'Material change (sets freshness signal)' }),
				pubDate: fields.date({ label: 'Published date', validation: { isRequired: true } }),
				updatedDate: fields.date({ label: 'Updated date' }),
				category: fields.text({ label: 'Category', validation: { isRequired: true } }),
				tags: fields.array(fields.text({ label: 'Tag' }), {
					label: 'Tags',
					itemLabel: (props) => props.value || 'Tag',
				}),
				internalLinks: fields.array(fields.text({ label: 'Internal link path' }), {
					label: 'Internal links',
					itemLabel: (props) => props.value || 'Link',
				}),
				images: fields.array(
					fields.object({
						src: fields.url({ label: 'Image URL', validation: { isRequired: true } }),
						alt: fields.text({ label: 'Alt text', validation: { isRequired: true } }),
						title: fields.text({ label: 'Title', validation: { isRequired: true } }),
						description: fields.text({
							label: 'Description',
							validation: { isRequired: true },
						}),
						source: fields.url({ label: 'Source URL', validation: { isRequired: true } }),
					}),
					{
						label: 'Images',
						itemLabel: (props) => props.fields.alt.value || 'Image',
					},
				),
				content: fields.mdx({
					label: 'Content',
					options: {
						bold: true,
						italic: true,
						strikethrough: true,
						code: true,
						heading: true,
						blockquote: true,
						orderedList: true,
						unorderedList: true,
						table: true,
						link: true,
						divider: true,
					},
				}),
			},
		}),
	},
});

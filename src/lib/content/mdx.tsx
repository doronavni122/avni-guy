import { compileMDX } from 'next-mdx-remote/rsc';
import type { ReactElement } from 'react';
import { ArticleFigure } from '@/components/blog/ArticleFigure';

const mdxComponents = {
	ArticleFigure,
};

export async function renderMdxContent(source: string): Promise<ReactElement> {
	try {
		const { content } = await compileMDX({
			source,
			options: { parseFrontmatter: false },
			components: mdxComponents,
		});
		return content;
	} catch (err) {
		console.error('[content:mdx] renderMdxContent failed', err);
		throw err;
	}
}

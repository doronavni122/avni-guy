import { compileMDX } from 'next-mdx-remote/rsc';
import type { ReactElement } from 'react';

export async function renderMdxContent(source: string): Promise<ReactElement> {
	try {
		const { content } = await compileMDX({
			source,
			options: { parseFrontmatter: false },
		});
		return content;
	} catch (err) {
		console.error('[content:mdx] renderMdxContent failed', err);
		throw err;
	}
}

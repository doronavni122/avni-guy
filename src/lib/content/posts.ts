import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { cache } from 'react';
import { normalizePostImages } from './images';
import { blogFrontmatterSchema, type BlogPost } from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

export type PostsIndex = {
	posts: BlogPost[];
	bySlug: Map<string, BlogPost>;
	categories: string[];
	tags: string[];
};

function slugFromFilePath(filePath: string): string {
	const base = path.basename(filePath).replace(/\.(md|mdx)$/, '');
	if (base === 'index') {
		return path.basename(path.dirname(filePath));
	}
	return base;
}

async function readPostFile(filePath: string): Promise<BlogPost> {
	const slug = slugFromFilePath(filePath);
	try {
		const raw = await fs.readFile(filePath, 'utf8');
		const { data: rawData, content } = matter(raw);
		const parsed = blogFrontmatterSchema.safeParse(rawData);
		if (!parsed.success) {
			console.error('[content:posts] frontmatter validation failed', { slug, issues: parsed.error.issues });
			throw new Error(`Invalid frontmatter for ${slug}`);
		}
		const data = { ...parsed.data, images: normalizePostImages(parsed.data.images) };
		return { slug, data, content };
	} catch (err) {
		console.error('[content:posts] readPostFile failed', { filePath, err });
		throw err;
	}
}

const loadPostsIndex = cache(async (): Promise<PostsIndex> => {
	try {
		const files = await fg('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
		const posts = await Promise.all(files.map((file) => readPostFile(file)));
		const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
		return {
			posts: sorted,
			bySlug: new Map(sorted.map((post) => [post.slug, post])),
			categories: [...new Set(sorted.map((post) => post.data.category))].sort(),
			tags: [...new Set(sorted.flatMap((post) => post.data.tags))].sort(),
		};
	} catch (err) {
		console.error('[content:posts] loadPostsIndex failed', err);
		throw err;
	}
});

export async function getPostsIndex(): Promise<PostsIndex> {
	return loadPostsIndex();
}

export async function getAllPosts(): Promise<BlogPost[]> {
	try {
		const { posts } = await loadPostsIndex();
		return posts;
	} catch (err) {
		console.error('[content:posts] getAllPosts failed', err);
		throw err;
	}
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
	try {
		const { bySlug } = await loadPostsIndex();
		return bySlug.get(slug);
	} catch (err) {
		console.error('[content:posts] getPostBySlug failed', { slug, err });
		throw err;
	}
}

export async function getSortedPosts(): Promise<BlogPost[]> {
	return getAllPosts();
}

export async function getCategories(): Promise<string[]> {
	try {
		const { categories } = await loadPostsIndex();
		return categories;
	} catch (err) {
		console.error('[content:posts] getCategories failed', err);
		throw err;
	}
}

export async function getTags(): Promise<string[]> {
	try {
		const { tags } = await loadPostsIndex();
		return tags;
	} catch (err) {
		console.error('[content:posts] getTags failed', err);
		throw err;
	}
}

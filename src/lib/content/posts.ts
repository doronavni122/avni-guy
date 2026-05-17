import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { blogFrontmatterSchema, type BlogPost } from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

async function readPostFile(filePath: string): Promise<BlogPost> {
	const slug = path.basename(filePath).replace(/\.(md|mdx)$/, '');
	try {
		const raw = await fs.readFile(filePath, 'utf8');
		const { data, content } = matter(raw);
		const parsed = blogFrontmatterSchema.safeParse(data);
		if (!parsed.success) {
			console.error('[content:posts] frontmatter validation failed', { slug, issues: parsed.error.issues });
			throw new Error(`Invalid frontmatter for ${slug}`);
		}
		return { slug, data: parsed.data, content };
	} catch (err) {
		console.error('[content:posts] readPostFile failed', { filePath, err });
		throw err;
	}
}

export async function getAllPosts(): Promise<BlogPost[]> {
	try {
		const files = await fg('**/*.{md,mdx}', { cwd: CONTENT_DIR, absolute: true });
		const posts = await Promise.all(files.map((file) => readPostFile(file)));
		return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
	} catch (err) {
		console.error('[content:posts] getAllPosts failed', err);
		throw err;
	}
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
	try {
		const posts = await getAllPosts();
		return posts.find((post) => post.slug === slug);
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
		const posts = await getAllPosts();
		return [...new Set(posts.map((post) => post.data.category))].sort();
	} catch (err) {
		console.error('[content:posts] getCategories failed', err);
		throw err;
	}
}

export async function getTags(): Promise<string[]> {
	try {
		const posts = await getAllPosts();
		return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
	} catch (err) {
		console.error('[content:posts] getTags failed', err);
		throw err;
	}
}

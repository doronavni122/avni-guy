import { getCollection } from 'astro:content';

export const getSortedPosts = async () => {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
};

export const getCategories = async () => {
	const posts = await getCollection('blog');
	return [...new Set(posts.map((post) => post.data.category))].sort();
};

export const getTags = async () => {
	const posts = await getCollection('blog');
	return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
};

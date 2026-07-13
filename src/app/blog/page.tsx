import { BlogArchiveView } from '@/components/blog/BlogArchiveView';

export const dynamic = 'force-static';

export default function BlogIndexPage() {
	return <BlogArchiveView page={1} />;
}

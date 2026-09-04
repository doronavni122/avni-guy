import { BlogArchiveView } from '@/components/blog/BlogArchiveView';
import { blogIndexMetadata } from '@/lib/blog/archive-metadata';

export const dynamic = 'force-static';

export const metadata = blogIndexMetadata;

export default function BlogIndexPage() {
	return <BlogArchiveView page={1} />;
}

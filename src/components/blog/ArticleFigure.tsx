import { OptimizedImage } from '@/components/media/OptimizedImage';

type ArticleFigureProps = {
	src: string;
	alt: string;
	title?: string;
	index?: number;
};

export function ArticleFigure({ src, alt, title, index = 0 }: ArticleFigureProps) {
	const isLead = index === 0;
	return (
		<figure
			className={`not-prose my-10 overflow-hidden border border-border ${isLead ? '' : 'max-w-3xl'}`}
		>
			<OptimizedImage
				src={src}
				alt={alt}
				title={title}
				priority={isLead}
				className={`h-auto w-full object-cover ${isLead ? 'aspect-[16/9]' : 'aspect-[3/2]'}`}
			/>
		</figure>
	);
}

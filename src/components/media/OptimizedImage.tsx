import Image from 'next/image';

type OptimizedImageProps = {
	src: string;
	alt: string;
	title?: string;
	width?: number;
	height?: number;
	priority?: boolean;
	className?: string;
	sizes?: string;
};

const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px';

function isOptimizableSrc(src: string): boolean {
	if (src.startsWith('/')) return true;
	try {
		const url = new URL(src);
		return url.hostname === 'avniguy.co.il';
	} catch {
		return false;
	}
}

export function OptimizedImage({
	src,
	alt,
	title,
	width = 1400,
	height = 900,
	priority = false,
	className,
	sizes = DEFAULT_SIZES,
}: OptimizedImageProps) {
	if (!isOptimizableSrc(src)) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={src}
				alt={alt}
				title={title}
				width={width}
				height={height}
				loading={priority ? 'eager' : 'lazy'}
				decoding="async"
				className={className}
			/>
		);
	}

	return (
		<Image
			src={src}
			alt={alt}
			title={title}
			width={width}
			height={height}
			priority={priority}
			loading={priority ? undefined : 'lazy'}
			fetchPriority={priority ? 'high' : 'low'}
			sizes={sizes}
			quality={75}
			className={className}
		/>
	);
}

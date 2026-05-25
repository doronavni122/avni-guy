import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	trailingSlash: true,
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 768, 1080, 1400],
		minimumCacheTTL: 31536000,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avniguy.co.il',
				pathname: '/**',
			},
		],
	},
	async headers() {
		return [
			{
				source: '/images/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
		];
	},
};

export default nextConfig;

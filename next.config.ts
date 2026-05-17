import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	trailingSlash: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avniguy.co.il',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;

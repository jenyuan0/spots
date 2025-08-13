const path = require('path');

/**
 * NOTE: Do not import or initialize SDKs (like @sanity/client) in next.config.js.
 * This file is executed at build-time by Next.js and must remain side‑effect free.
 * If you need dynamic redirects from Sanity, fetch them at runtime (e.g., in
 * middleware or a route handler) and keep next.config.js static.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: false,
	swcMinify: true,
	/**
	 * Optional: support JSON-provided redirects via env var `NEXT_PUBLIC_REDIRECTS`.
	 * Example value:
	 *   [
	 *     { "source": "/old", "destination": "/new", "permanent": true }
	 *   ]
	 */
	async redirects() {
		const siteOrigin = process.env.SITE_URL;
		const isExternalURL = (url) => {
			try {
				return (
					new URL(url, siteOrigin).origin !==
					new URL(siteOrigin || '', siteOrigin).origin
				);
			} catch (_e) {
				return false;
			}
		};

		let dynamicRedirects = [];

		if (process.env.NEXT_PUBLIC_REDIRECTS) {
			try {
				const redirects = JSON.parse(process.env.NEXT_PUBLIC_REDIRECTS);
				if (Array.isArray(redirects)) {
					dynamicRedirects = redirects.map((redirect) => ({
						source: redirect?.source,
						destination: redirect?.destination,
						permanent: Boolean(redirect?.permanent),
						...(isExternalURL(redirect?.destination) && { basePath: false }),
					}));
				}
			} catch (_e) {
				// invalid JSON; ignore and return empty list
			}
		}

		return dynamicRedirects;
	},
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.sanity.io',
				pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/**`,
			},
		],
	},
};

module.exports = nextConfig;

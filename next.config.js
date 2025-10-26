const { createClient } = require('@sanity/client');
const { i18n } = require('./languages');

const sanityOptions = {
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: 'production',
	apiVersion: '2023-08-01',
	useCdn: false,
	perspective: 'published',
};

const client = createClient(sanityOptions);
const path = require('path');

const nextConfig = {
	// reactStrictMode: false,
	swcMinify: true,
	async redirects() {
		let dynamicRedirects = [];

		const isExternalURL = (url) => {
			const siteOrigin = process.env.SITE_URL;
			const destinationOrigin = new URL(url, siteOrigin).origin;
			return destinationOrigin !== siteOrigin;
		};

		const redirects = await client.fetch(
			`*[_type == "settingsRedirect"]{
				"source": url.current,
				"destination": destination,
				"permanent": permanent
        }`
		);

		if (redirects && Array.isArray(redirects)) {
			dynamicRedirects = redirects.flatMap((redirect) =>
				i18n.languages.map((language) => ({
					source: `/${language.id}${redirect?.source}`,
					destination: `/${language.id}${redirect?.destination}`,
					permanent: redirect.permanent,
					...(isExternalURL(redirect?.destination) && { basePath: false }),
				}))
			);
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

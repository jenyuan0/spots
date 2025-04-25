import { getPagesPaths } from '@/sanity/lib/fetch';
import fs from 'fs';
import path from 'path';

// Constants
const PAGE_CONFIG = {
	STATIC: {
		changeFrequency: 'weekly',
		priority: 1.0,
	},
	DYNAMIC: {
		changeFrequency: 'monthly',
		priority: 1.0,
	},
};

const EXCLUDED_DIRS = ['_components', '[...not_found]', '[slug]'];

const DYNAMIC_PAGE_TYPES = [
	{ type: 'pGeneral', slug: '' },
	{ type: 'pTripReady', slug: '' },
	{ type: 'pHotelBooking', slug: '' },
	{ type: 'gGuides', slug: 'paris/guides' },
	{ type: 'gLocations', slug: 'paris/locations' },
	{ type: 'gItineraries', slug: 'paris/itineraries' },
	{ type: 'gCategories', slug: 'paris/guides/category' },
	{ type: 'gCategories', slug: 'paris/locations/category' },
];

export default async function generateSitemap() {
	const baseUrl = process.env.SITE_URL?.replace(/\/$/, '');
	const baseDir = 'src/app/(pages)';

	if (!baseUrl) {
		throw new Error('SITE_URL environment variable is required');
	}

	const getStaticRoutes = () => {
		const fullPath = path.join(process.cwd(), baseDir);

		return fs
			.readdirSync(fullPath, { withFileTypes: true })
			.filter(
				(entry) => entry.isDirectory() && !EXCLUDED_DIRS.includes(entry.name)
			)
			.map((entry) => ({
				url: `${baseUrl}/${entry.name}`,
				lastModified: new Date(),
				...PAGE_CONFIG.STATIC,
			}));
	};

	const getDynamicRoutes = async () => {
		const routes = await Promise.all(
			DYNAMIC_PAGE_TYPES.map(async ({ type, slug }) => {
				const slugs = await getPagesPaths({ pageType: type });
				const urlPrefix = slug ? `/${slug}` : '';

				return slugs.map((slug) => ({
					url: `${baseUrl}${urlPrefix}${slug.startsWith('/') ? slug : `/${slug}`}`,
					lastModified: new Date(),
					...PAGE_CONFIG.DYNAMIC,
				}));
			})
		);

		return routes.flat();
	};

	return [...(await getStaticRoutes()), ...(await getDynamicRoutes())];
}

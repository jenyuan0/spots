import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { getPagesPaths } from '@/sanity/lib/fetch';
import { formatUrl } from '@/lib/helpers';
import fs from 'fs';
import path from 'path';

const ROUTES = [
	{
		type: 'pGeneral',
		slug: '',
		changeFrequency: 'monthly',
		priority: 0.8,
	},
	{
		type: 'gGuides',
		slug: 'paris/guides',
		changeFrequency: 'monthly',
		priority: 0.8,
	},
	{
		type: 'gLocations',
		slug: 'locations',
		changeFrequency: 'weekly',
		priority: 0.8,
	},
	{
		type: 'gCases',
		slug: 'cases',
		changeFrequency: 'weekly',
		priority: 0.8,
	},
	{
		type: 'gItineraries',
		slug: 'paris/itinerary',
		changeFrequency: 'weekly',
		priority: 0.8,
		skipParentPath: true,
	},
	{
		type: 'gCategories',
		slug: 'paris/guides/category',
		changeFrequency: 'monthly',
		priority: 0.7,
		skipParentPath: true,
	},
	{
		type: 'gCategories',
		slug: 'locations/category',
		changeFrequency: 'monthly',
		priority: 0.7,
		skipParentPath: true,
	},
	{
		type: 'gSubcategories',
		slug: 'paris/guides/category',
		changeFrequency: 'monthly',
		priority: 0.7,
		skipParentPath: true,
	},
	{
		type: 'gSubcategories',
		slug: 'locations/category',
		changeFrequency: 'monthly',
		priority: 0.7,
		skipParentPath: true,
	},
];

const EXCLUDED_DIRS = [
	'_components',
	'itinerary',
	'[...not_found]',
	'[slug]',
	'api',
	'_tests',
];

async function getDocumentData(type, slug) {
	try {
		const query = groq`*[${type ? `_type == "${type}" &&` : ''} slug.current == "${slug}"][0] {
      _updatedAt,
      "disableIndex": sharing.disableIndex
    }`;
		const doc = await client.fetch(query);
		if (slug == 'gCases') {
			console.log('xxxx', doc);
		}
		return {
			lastModified: doc?._updatedAt || new Date().toISOString(),
			disableIndex: doc?.disableIndex || false,
		};
	} catch (error) {
		console.error(`Error fetching document data: ${error.message}`);
		return { lastModified: new Date().toISOString(), disableIndex: false };
	}
}

async function getStaticRoutes(baseUrl) {
	const fullPath = path.join(process.cwd(), 'src/app/(pages)');
	const routes = [];

	// Add homepage
	routes.push({
		url: formatUrl(baseUrl),
		lastModified: new Date().toISOString(),
		changeFrequency: 'weekly',
		priority: 1.0,
	});

	async function traverse(dir) {
		const entries = fs.readdirSync(dir, { withFileTypes: true });

		for (const entry of entries) {
			if (entry.isDirectory() && !EXCLUDED_DIRS.includes(entry.name)) {
				const fullEntryPath = path.join(dir, entry.name);
				const relativePath = path.relative(fullPath, fullEntryPath);
				const url = new URL(`${baseUrl}/${relativePath}`).toString();
				const lastPath = relativePath.split('/').pop();

				// Check if this path matches any routes with skipParentPath
				const matchingRoute = ROUTES.find((route) => {
					const routePath = route.slug.split('/').filter(Boolean);
					const currentPath = relativePath.split('/').filter(Boolean);
					return (
						routePath.length === currentPath.length &&
						routePath.every(
							(segment, index) => segment === currentPath[index]
						) &&
						route.skipParentPath
					);
				});

				// Skip if this is a parent path that should be skipped
				if (matchingRoute) {
					continue;
				}

				const { lastModified, disableIndex } = await getDocumentData(
					null,
					lastPath
				);

				if (!disableIndex) {
					routes.push({
						url: formatUrl(url),
						lastModified,
						changeFrequency: 'weekly',
						priority: 1.0,
					});
				}

				await traverse(fullEntryPath);
			}
		}
	}

	await traverse(fullPath);
	return routes;
}

async function getDynamicRoutes(baseUrl) {
	try {
		const routes = await Promise.all(
			ROUTES.map(
				async ({ type, slug, changeFrequency, priority, skipParentPath }) => {
					const slugs = await getPagesPaths({ pageType: type });
					const urlPrefix = slug ? `/${slug}` : '';

					const pageRoutes = await Promise.all(
						slugs.map(async (pageSlug) => {
							// Skip if this is a parent path and skipParentPath is true
							if (skipParentPath && !pageSlug) return null;

							const url = new URL(
								`${baseUrl}${urlPrefix}${pageSlug.startsWith('/') ? pageSlug : `/${pageSlug}`}`
							).toString();

							const { lastModified, disableIndex } = await getDocumentData(
								type,
								pageSlug
							);

							if (disableIndex) return null;

							return {
								url: formatUrl(url),
								lastModified,
								changeFrequency,
								priority,
							};
						})
					);

					return pageRoutes.filter(Boolean);
				}
			)
		);

		return routes.flat();
	} catch (error) {
		console.error('Error generating dynamic routes:', error);
		return [];
	}
}

export default async function generateSitemap() {
	const baseUrl = process.env.SITE_URL?.replace(/\/$/, '');
	if (!baseUrl) throw new Error('SITE_URL environment variable is required');

	const [staticRoutes, dynamicRoutes] = await Promise.all([
		getStaticRoutes(baseUrl),
		getDynamicRoutes(baseUrl),
	]);

	return [...staticRoutes, ...dynamicRoutes];
}

import { groq } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { getPagesPaths } from '@/sanity/lib/fetch';
import { formatUrl } from '@/lib/helpers';
import fs from 'fs';
import path from 'path';
import { i18n } from '../../languages.js';

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
		slug: 'travel-design',
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

const CHINESE_LOCALES = ['zh_TW', 'zh_CN'];

function getPathSegment(language) {
	return CHINESE_LOCALES.includes(language.id) ? language.country : language.id;
}

async function getDocumentData(type, slug) {
	try {
		const query = groq`*[${type ? `_type == "${type}" &&` : ''} slug.current == "${slug}"][0] {
      _updatedAt,
      "disableIndex": sharing.disableIndex
    }`;
		const doc = await client.fetch(query);

		return {
			lastModified: doc?._updatedAt || new Date().toISOString(),
			disableIndex: doc?.disableIndex || false,
		};
	} catch (error) {
		console.error(`Error fetching document data: ${error.message}`);
		return { lastModified: new Date().toISOString(), disableIndex: false };
	}
}

function buildAlternates(url, lang) {
	const alternates = {
		languages: {},
	};

	i18n.languages.forEach((language) => {
		const langSegment = getPathSegment(language);
		const alternateUrl = url.replace(
			`/${getPathSegment({ id: lang })}/`,
			`/${langSegment}/`
		);
		alternates.languages[language.id] = alternateUrl;
	});

	return alternates;
}

async function getStaticRoutes(baseUrl) {
	const fullPath = path.join(process.cwd(), 'src/app/[lang]/(pages)');
	const routes = [];

	// Add homepage for each language
	i18n.languages.forEach((language) => {
		const pathSegment = getPathSegment(language);
		routes.push({
			url: formatUrl(`${baseUrl}/${pathSegment}`),
			lastModified: new Date().toISOString(),
			changeFrequency: 'weekly',
			priority: 1.0,
			alternates: buildAlternates(`${baseUrl}/${pathSegment}`, language.id),
		});
	});

	async function traverse(dir) {
		const entries = fs.readdirSync(dir, { withFileTypes: true });

		for (const entry of entries) {
			if (entry.isDirectory() && !EXCLUDED_DIRS.includes(entry.name)) {
				const fullEntryPath = path.join(dir, entry.name);
				const relativePath = path.relative(fullPath, fullEntryPath);
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
					// Create routes for each language
					i18n.languages.forEach((language) => {
						const pathSegment = getPathSegment(language);
						const url = `${baseUrl}/${pathSegment}/${relativePath}`;
						routes.push({
							url: formatUrl(url),
							lastModified,
							changeFrequency: 'weekly',
							priority: 0.8,
							alternates: buildAlternates(url, language.id),
						});
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

							const { lastModified, disableIndex } = await getDocumentData(
								type,
								pageSlug
							);

							if (disableIndex) return null;

							// Create routes for each language
							return i18n.languages.map((language) => {
								const pathSegment = getPathSegment(language);
								const url = `${baseUrl}/${pathSegment}${urlPrefix}${pageSlug.startsWith('/') ? pageSlug : `/${pageSlug}`}`;

								return {
									url: formatUrl(url),
									lastModified,
									changeFrequency,
									priority,
									alternates: buildAlternates(url, language.id),
								};
							});
						})
					);

					return pageRoutes.flat().filter(Boolean);
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

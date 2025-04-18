import 'server-only';
import { client } from '@/sanity/lib/client';
import * as queries from '@/sanity/lib/queries';
import { token } from '../env';
import { groq } from 'next-sanity';

export async function sanityFetch({ query, params = {}, tags, isPreviewMode }) {
	if (isPreviewMode && !token) {
		throw new Error(
			'The `SANITY_API_READ_TOKEN` environment variable is required.'
		);
	}

	return client.fetch(query, params, {
		...(isPreviewMode && {
			token: token,
			perspective: 'previewDrafts',
		}),
		next: {
			revalidate: isPreviewMode ? 0 : false,
			tags,
		},
	});
}

export async function getSiteData({ isPreviewMode }) {
	const data = sanityFetch({
		query: `{${queries.site}}`,
		tags: [
			'gAnnouncement',
			'gHeader',
			'gFooter',
			'settingsMenu',
			'settingsGeneral',
			'settingsIntegration',
			'settingsBrandColors',
		],
		isPreviewMode,
	});

	return data;
}

const getPageDataStructure = ({ query }) => {
	const data = `{
		"page": ${query},
		${queries.site}
	}`;

	return data;
};

export async function getPageHomeData({ isPreviewMode }) {
	const query = getPageDataStructure({ query: queries.pageHomeQuery });

	return sanityFetch({
		query,
		tags: ['pHome', 'gLocations', 'gItineraries'],
		isPreviewMode,
	});
}

export async function get404PageData() {
	const query = getPageDataStructure({ query: queries.page404Query });

	return sanityFetch({
		query,
		tags: ['p404'],
	});
}

export function getPagesPaths({ pageType }) {
	const getQuery = (pageType) => {
		switch (pageType) {
			case 'pGeneral':
				return groq`*[_type == "pGeneral"].slug.current`;
			case 'gLocations':
				return groq`*[_type == "gLocations"].slug.current`;
			case 'gItineraries':
				return groq`*[_type == "gItineraries"].slug.current`;
			case 'gGuides':
				return groq`*[_type == "gGuides"].slug.current`;
			case 'gCategories':
				return groq`*[_type == "gCategories"].slug.current`;
			case 'gSubcategories':
				return groq`*[_type == "gSubcategories"].slug.current`;
			case 'gFAQ':
				return groq`*[_type == "gFAQ" ].slug.current`;
			default:
				console.warn('Invalid Page Type:', pageType);
				return groq`*[_type == "pGeneral" ].slug.current`;
		}
	};

	const query = getQuery(pageType);
	return client.fetch(query, {}, { token, perspective: 'published' });
}

export function getPageBySlug({ queryParams }) {
	const query = getPageDataStructure({ query: queries.pagesBySlugQuery });

	return sanityFetch({
		query,
		params: queryParams,
		tags: [`pGeneral:${queryParams.slug}`],
	});
}

export function getContactPage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({ query: queries.pageContactQuery });

	return sanityFetch({
		query,
		params: queryParams,
		tags: ['pContact'],
		isPreviewMode,
	});
}

export function getTripReadyPage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({ query: queries.pageTripReadyQuery });

	return sanityFetch({
		query,
		params: queryParams,
		tags: ['pTripReady', 'gItineraries'],
		isPreviewMode,
	});
}

// new pages below...
// export function getAboutPage({ queryParams, isPreviewMode }) {
// 	const query = getPageDataStructure({ query: queries.pageAboutQuery });

// 	return sanityFetch({
// 		query,
// 		params: queryParams,
// 		tags: ['pAbout'],
// 		isPreviewMode,
// 	});
// }

// PARIS PAGE
export function getParisPage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({ query: queries.pageParisQuery });

	return sanityFetch({
		query,
		params: queryParams,
		tags: ['pParis', 'gLocations', 'gItineraries', 'gGuides'],
		isPreviewMode,
	});
}

// GUIDES
export function getGuidesPaginationMethodData() {
	return sanityFetch({
		query: queries.pageGuidesPaginationMethodQuery,
		tags: ['pGuides', 'gGuides'],
	});
}

export function getGuidesIndexPage({ isPreviewMode, isArticleDataSSG }) {
	const query = getPageDataStructure({
		query: isArticleDataSSG
			? queries.pageGuidesIndexWithArticleDataSSGQuery
			: queries.pageGuidesIndex,
	});

	return sanityFetch({
		query,
		tags: ['pGuides', 'gGuides'],
		isPreviewMode,
	});
}

export function getGuidesCategoryPage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({
		query: queries.pageGuidesCategoryQuery,
	});

	return sanityFetch({
		query,
		params: queryParams,
		tags: ['gGuides'],
		isPreviewMode,
	});
}

export function getGuidesSinglePage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({ query: queries.pageGuidesSingleQuery });

	return sanityFetch({
		query,
		params: queryParams,
		tags: [`gGuides:${queryParams.slug}`],
		isPreviewMode,
	});
}

// LOCATIONS
export function getLocationsPaginationMethodData() {
	return sanityFetch({
		query: queries.pageLocationsPaginationMethodQuery,
		tags: ['pLocations', 'gLocations'],
	});
}

export function getLocationsIndexPage({ isPreviewMode, isArticleDataSSG }) {
	const query = getPageDataStructure({
		query: isArticleDataSSG
			? queries.pageLocationsIndexWithArticleDataSSGQuery
			: queries.pageLocationsIndex,
	});

	return sanityFetch({
		query,
		tags: ['pLocations', 'gLocations'],
		isPreviewMode,
	});
}

export function getLocationsCategoryPage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({
		query: queries.pageLocationsCategoryQuery,
	});

	return sanityFetch({
		query,
		params: queryParams,
		tags: ['gLocations'],
		isPreviewMode,
	});
}

export function getLocationsSinglePage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({
		query: queries.pageLocationsSingleQuery,
	});

	return sanityFetch({
		query,
		params: queryParams,
		tags: [`gLocations:${queryParams.slug}`],
		isPreviewMode,
	});
}

// ITINERARY
export function getItinerariesSinglePage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({
		query: queries.pageItinerariesSingleQuery,
	});

	return sanityFetch({
		query,
		params: queryParams,
		tags: [`gItineraries:${queryParams.slug}`],
		isPreviewMode,
	});
}

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

export async function getSiteData({ params, isPreviewMode }) {
	const modifiedParam = {
		language: params.lang?.replace('-', '_'),
	};
	const data = sanityFetch({
		query: `{${queries.site}}`,
		params: modifiedParam,
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

const getPageDataStructure = ({ query, includeSite = true }) => {
	const data = `{
		"page": ${query}${includeSite ? `, ${queries.site}` : ''}
	}`;

	return data;
};

export async function getPageHomeData({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({ query: queries.pageHomeQuery });

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['pHome', 'gLocations', 'gItineraries'],
		isPreviewMode,
	});
}

export async function getPageHotelBooking({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({ query: queries.pageHotelBookingQuery });

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['pHotelBooking', 'gLocations'],
		isPreviewMode,
	});
}

export async function getPageTravelDesign({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({ query: queries.pageTravelDesignQuery });

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['pTravelDesign', 'gLocations', 'gItineraries'],
		isPreviewMode,
	});
}

export async function get404PageData({ params }) {
	const modifiedParam = {
		...params,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({
		query: queries.page404Query,
		includeSite: false,
	});

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['p404'],
	});
}

export function getPagesPaths({ pageType }) {
	const getQuery = (pageType) => {
		switch (pageType) {
			case 'pGeneral':
				return groq`*[_type == "pGeneral" && language == "en"].slug.current`;
			case 'gLocations':
				return groq`*[_type == "gLocations" && language == "en"].slug.current`;
			case 'gCases':
				return groq`*[_type == "gCases" && language == "en"].slug.current`;
			case 'gItineraries':
				return groq`*[_type == "gItineraries" && language == "en"].slug.current`;
			case 'gGuides':
				return groq`*[_type == "gGuides" && language == "en"].slug.current`;
			case 'gCategories':
				return groq`*[_type == "gCategories" && language == "en"].slug.current`;
			case 'gSubcategories':
				return groq`*[_type == "gSubcategories" && language == "en"].slug.current`;
			default:
				console.warn('Invalid Page Type:', pageType);
				return groq`*[_type == "pGeneral" && language == "en"].slug.current`;
		}
	};

	const query = getQuery(pageType);
	return client.fetch(query, {}, { token, perspective: 'published' });
}

export function getPageBySlug({ params }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({ query: queries.pagesBySlugQuery });

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: [`pGeneral:${modifiedParam.slug}`],
	});
}

export function getContactPage({ params, isPreviewMode }) {
	const modifiedParam = {
		...params,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({ query: queries.pageContactQuery });

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['pContact'],
		isPreviewMode,
	});
}

export function getTripReadyPage({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({ query: queries.pageTripReadyQuery });

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['pTripReady', 'gItineraries'],
		isPreviewMode,
	});
}

// new pages below...
// export function getAboutPage({ params, isPreviewMode }) {
// const modifiedParam = {
// 	slug: params.slug,
// 	language: params.lang?.replace('-', '_') || params.lang,
// };
// 	const query = getPageDataStructure({ query: queries.pageAboutQuery });

// 	return sanityFetch({
// 		query,
// 		params: modifiedParam,
// 		tags: ['pAbout'],
// 		isPreviewMode,
// 	});
// }

// PARIS PAGE
export function getParisPage({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({ query: queries.pageParisQuery });

	return sanityFetch({
		query,
		params: modifiedParam,
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

export function getGuidesIndexPage({
	params,
	isPreviewMode,
	isArticleDataSSG,
}) {
	const modifiedParam = {
		...params,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({
		query: isArticleDataSSG
			? queries.pageGuidesIndexWithArticleDataSSGQuery
			: queries.pageGuidesIndex,
	});

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['pGuides', 'gGuides'],
		isPreviewMode,
	});
}

export function getGuidesCategoryPage({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({
		query: queries.pageGuidesCategoryQuery,
	});

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['gGuides', 'gCategories', 'gSubcategories'],
		isPreviewMode,
	});
}

export function getGuidesSinglePage({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({ query: queries.pageGuidesSingleQuery });

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: [`gGuides:${modifiedParam.slug}`, 'gGuides', 'gLocations'],
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

export function getLocationsIndexPage({
	params,
	isPreviewMode,
	isArticleDataSSG,
}) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({
		query: isArticleDataSSG
			? queries.pageLocationsIndexWithArticleDataSSGQuery
			: queries.pageLocationsIndex,
	});

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['pLocations', 'gLocations'],
		isPreviewMode,
	});
}

export function getLocationsCategoryPage({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};

	const query = getPageDataStructure({
		query: queries.pageLocationsCategoryQuery,
	});

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: ['gLocations', 'gCategories', 'gSubcategories'],
		isPreviewMode,
	});
}

export function getLocationsSinglePage({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({
		query: queries.pageLocationsSingleQuery,
	});

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: [`gLocations:${modifiedParam.slug}`, 'gGuides', 'gLocations'],
		isPreviewMode,
	});
}

export function getCasesSinglePage({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({
		query: queries.pageCasesSingleQuery,
	});

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: [`gCases:${modifiedParam.slug}`, 'gLocations', 'pTravelDesign'],
		isPreviewMode,
	});
}

// ITINERARY
export function getItinerariesSinglePage({ params, isPreviewMode }) {
	const modifiedParam = {
		slug: params.slug,
		language: params.lang?.replace('-', '_') || params.lang,
	};
	const query = getPageDataStructure({
		query: queries.pageItinerariesSingleQuery,
	});

	return sanityFetch({
		query,
		params: modifiedParam,
		tags: [`gItineraries:${modifiedParam.slug}`, 'gItinerariesDay'],
		isPreviewMode,
	});
}

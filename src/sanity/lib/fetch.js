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
			'settingsSharing',
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
		tags: ['pHome'],
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
				return groq`*[_type == "pGeneral" ].slug.current`;
			case 'pBlog':
				return groq`*[_type == "pBlog" ].slug.current`;
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

// BLOG
export function getBlogPaginationMethodData() {
	return sanityFetch({
		query: queries.pageBlogPaginationMethodQuery,
		tags: ['pBlogIndex', 'pBlog'],
	});
}

export function getBlogIndexPage({ isPreviewMode, isArticleDataSSG }) {
	const query = getPageDataStructure({
		query: isArticleDataSSG
			? queries.pageBlogIndexWithArticleDataSSGQuery
			: queries.pageBlogIndex,
	});

	return sanityFetch({
		query,
		tags: ['pBlogIndex'],
		isPreviewMode,
	});
}

export function getBlogSinglePage({ queryParams, isPreviewMode }) {
	const query = getPageDataStructure({ query: queries.pageBlogSingleQuery });

	return sanityFetch({
		query,
		params: queryParams,
		tags: [`pBlog:${queryParams.slug}`],
		isPreviewMode,
	});
}

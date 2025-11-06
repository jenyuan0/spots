import PageLocationsIndex from '../../_components/PageLocationsIndex';
import PreviewPageLocationsIndex from '../../_components/PreviewPageLocationsIndex';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageLocationsCategoryQuery } from '@/sanity/lib/queries';
import { getLocationsCategoryPage, getPagesPaths } from '@/sanity/lib/fetch';
import { i18n } from '../../../../../../../languages.js';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'gCategories' });

	return i18n.languages.flatMap((language) =>
		slugs.map((slug) => ({
			lang: language.id,
			slug,
		}))
	);
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getLocationsCategoryPage({
		params,
		isPreviewMode,
	});
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getLocationsCategoryPage({
		params,
		isPreviewMode,
	});
	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageLocationsCategoryQuery}
			initialData={page}
			params={{ slug: params.slug }}
			as={PreviewPageLocationsIndex}
		>
			<PageLocationsIndex data={page} />
		</LiveQuery>
	);
}

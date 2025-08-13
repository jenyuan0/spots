import PageLocationsIndex from '../../_components/PageLocationsIndex';
import PreviewPageLocationsIndex from '../../_components/PreviewPageLocationsIndex';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageLocationsCategoryQuery } from '@/sanity/lib/queries';
import { getLocationsCategoryPage, getPagesPaths } from '@/sanity/lib/fetch';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'gCategories' });
	const params = slugs.map((slug) => ({ slug }));

	return params;
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getLocationsCategoryPage({
		queryParams: params,
		isPreviewMode,
	});
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getLocationsCategoryPage({
		queryParams: params,
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

import PageLocationsIndex from './_components/PageLocationsIndex';
import PreviewPageLocationsIndex from './_components/PreviewPageLocationsIndex';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getLocationsIndexPage } from '@/sanity/lib/fetch';
import { pageGuidesIndexWithArticleDataSSGQuery } from '@/sanity/lib/queries';

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getLocationsIndexPage({ params, isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getLocationsIndexPage({
		params,
		isPreviewMode,
		isArticleDataSSG: true,
	});
	const { page, site } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageGuidesIndexWithArticleDataSSGQuery}
			initialData={page}
			as={PreviewPageLocationsIndex}
		>
			<PageLocationsIndex data={page} siteData={site} />
		</LiveQuery>
	);
}

import PageParis from './_components/PageParis';
import PreviewPageParis from './_components/PreviewPageParis';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getLocationsIndexPage } from '@/sanity/lib/fetch';
import { pageLocationsIndexWithArticleDataSSGQuery } from '@/sanity/lib/queries';

export async function generateMetadata() {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getLocationsIndexPage({ isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page() {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getLocationsIndexPage({
		isPreviewMode,
		isArticleDataSSG: true,
	});
	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageLocationsIndexWithArticleDataSSGQuery}
			initialData={page}
			as={PreviewPageParis}
		>
			<PageParis data={page} />
		</LiveQuery>
	);
}

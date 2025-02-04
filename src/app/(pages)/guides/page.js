import PageGuidesIndex from './_components/PageGuidesIndex';
import PreviewPageGuidesIndex from './_components/PreviewPageGuidesIndex';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getGuidesIndexPage } from '@/sanity/lib/fetch';
import { pageGuidesIndexWithArticleDataSSGQuery } from '@/sanity/lib/queries';

export async function generateMetadata() {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getGuidesIndexPage({ isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page() {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getGuidesIndexPage({
		isPreviewMode,
		isArticleDataSSG: true,
	});
	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageGuidesIndexWithArticleDataSSGQuery}
			initialData={page}
			as={PreviewPageGuidesIndex}
		>
			<PageGuidesIndex data={page} />
		</LiveQuery>
	);
}

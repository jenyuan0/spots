import PageParis from './_components/PageParis';
import PreviewPageParis from './_components/PreviewPageParis';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getParisPage } from '@/sanity/lib/fetch';
import { pageParisQuery } from '@/sanity/lib/queries';

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getParisPage({ params, isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getParisPage({ params, isPreviewMode });
	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageParisQuery}
			initialData={page}
			as={PreviewPageParis}
		>
			<PageParis data={page} />
		</LiveQuery>
	);
}

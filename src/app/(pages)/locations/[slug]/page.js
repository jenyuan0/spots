import PageLocationsSingle from '../_components/PageLocationsSingle';
import PreviewPageLocationsSingle from '../_components/PreviewPageLocationsSingle';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageLocationSingleQuery } from '@/sanity/lib/queries';
import { getLocationsSinglePage, getPagesPaths } from '@/sanity/lib/fetch';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'gGuides' });
	const params = slugs.map((slug) => ({ slug }));
	return params;
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getLocationsSinglePage({
		queryParams: params,
		isPreviewMode,
	});
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getLocationsSinglePage({
		queryParams: params,
		isPreviewMode,
	});
	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageLocationSingleQuery}
			initialData={page}
			params={{ slug: params.slug }}
			as={PreviewPageLocationsSingle}
		>
			<PageLocationsSingle data={page} />
		</LiveQuery>
	);
}

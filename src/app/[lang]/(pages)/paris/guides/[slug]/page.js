import PageGuidesSingle from '../_components/PageGuidesSingle';
import PreviewPageGuidesSingle from '../_components/PreviewPageGuidesSingle';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageGuidesSingleQuery } from '@/sanity/lib/queries';
import {
	getGuidesSinglePage,
	getPagesPaths,
	getSiteData,
} from '@/sanity/lib/fetch';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'gGuides' });
	const params = slugs.map((slug) => ({ slug }));
	return params;
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getGuidesSinglePage({
		queryParams: params,
		isPreviewMode,
	});
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getGuidesSinglePage({
		queryParams: params,
		isPreviewMode,
	});
	const { page } = pageData || {};
	const site = await getSiteData({
		queryParams: { language: params.lang?.replace('-', '_') },
		isPreviewMode,
	});
	const metadata = defineMetadata({ data: { site, page } });

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageGuidesSingleQuery}
			initialData={page}
			params={{ slug: params.slug }}
			as={PreviewPageGuidesSingle}
		>
			{metadata?.jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(metadata.jsonLd),
					}}
				/>
			)}
			<PageGuidesSingle data={page} />
		</LiveQuery>
	);
}

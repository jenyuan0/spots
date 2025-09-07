import PageItinerarySingle from '../_components/PageItinerarySingle';
import PreviewPageItinerarySingle from '../_components/PreviewPageItinerarySingle';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageItinerariesSingleQuery } from '@/sanity/lib/queries';
import {
	getItinerariesSinglePage,
	getPagesPaths,
	getSiteData,
} from '@/sanity/lib/fetch';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'gItineraries' });
	const params = slugs.map((slug) => ({ slug }));
	return params;
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getItinerariesSinglePage({
		queryParams: params,
		isPreviewMode,
	});
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getItinerariesSinglePage({
		queryParams: params,
		isPreviewMode,
	});
	const { page } = pageData || {};
	const site = await getSiteData({ isPreviewMode });
	const metadata = defineMetadata({ data: { site, page } });

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageItinerariesSingleQuery}
			initialData={page}
			params={{ slug: params.slug }}
			as={PreviewPageItinerarySingle}
		>
			{metadata?.jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(metadata.jsonLd),
					}}
				/>
			)}
			<PageItinerarySingle data={page} />
		</LiveQuery>
	);
}

import { draftMode } from 'next/headers';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getPageTravelDesign } from '@/sanity/lib/fetch';
import { pageTravelDesignQuery } from '@/sanity/lib/queries';
import PageTravelDesign from './_components/PageTravelDesign';
import PreviewPageTravelDesign from './_components/PreviewPageTravelDesign';

export async function generateMetadata({ params }) {
	const queryParams = { language: params.lang?.replace('-', '_') };
	const isPreviewMode = draftMode().isEnabled;
	const data = await getPageTravelDesign({ queryParams, isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	console.log('🚀 ~ Page ~ params:', params);
	const queryParams = { language: params.lang?.replace('-', '_') };
	console.log('🚀🚀🚀🚀 ~ Page ~ queryParams:', queryParams);
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getPageTravelDesign({ queryParams, isPreviewMode });
	const { page } = pageData || {};

	const { _translations } = page || {};
	console.log('🚀 ~ Page ~ page:', page);
	console.log('🚀 ~ Page ~ _translations:', _translations);

	if (page) {
		return (
			<LiveQuery
				enabled={isPreviewMode}
				query={pageTravelDesignQuery}
				initialData={page}
				as={PreviewPageTravelDesign}
			>
				<PageTravelDesign data={page} />
			</LiveQuery>
		);
	}
}

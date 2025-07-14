import { draftMode } from 'next/headers';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getPageTravelDesign } from '@/sanity/lib/fetch';
import { pageTravelDesignQuery } from '@/sanity/lib/queries';
import PageTravelDesign from './_components/PageTravelDesign';
import PreviewPageTravelDesign from './_components/PreviewPageTravelDesign';

export async function generateMetadata() {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getPageTravelDesign({ isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page() {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getPageTravelDesign({ isPreviewMode });
	const { page } = pageData || {};

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

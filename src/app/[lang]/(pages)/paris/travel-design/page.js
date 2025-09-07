import { draftMode } from 'next/headers';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getPageHomeData } from '@/sanity/lib/fetch';
import { pageHomeQuery } from '@/sanity/lib/queries';
import PageHome from './_components/PageHome';
import PreviewPageHome from './_components/PreviewPageHome';

export async function generateMetadata() {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getPageHomeData({ isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page() {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getPageHomeData({ isPreviewMode });
	const { page } = pageData || {};

	if (page) {
		return (
			<LiveQuery
				enabled={isPreviewMode}
				query={pageHomeQuery}
				initialData={page}
				as={PreviewPageHome}
			>
				<PageHome data={page} />
			</LiveQuery>
		);
	}
}

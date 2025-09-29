import { draftMode } from 'next/headers';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getPageHotelBooking } from '@/sanity/lib/fetch';
import { pageHotelBookingQuery } from '@/sanity/lib/queries';
import PageHotelBooking from '@/app/[lang]/(pages)/_components/PageHotelBooking';
import PreviewPageHotelBooking from '@/app/[lang]/(pages)/_components/PreviewPageHotelBooking';

export async function generateMetadata({ params }) {
	const queryParams = { language: params.lang?.replace('-', '_') };
	const isPreviewMode = draftMode().isEnabled;
	const data = await getPageHotelBooking({ queryParams, isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const queryParams = { language: params.lang?.replace('-', '_') };
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getPageHotelBooking({ queryParams, isPreviewMode });
	const { page } = pageData || {};

	if (page) {
		return (
			<LiveQuery
				enabled={isPreviewMode}
				query={pageHotelBookingQuery}
				initialData={page}
				as={PreviewPageHotelBooking}
			>
				<PageHotelBooking data={page} />
			</LiveQuery>
		);
	}
}

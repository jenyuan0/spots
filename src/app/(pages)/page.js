import { draftMode } from 'next/headers';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getPageHotelBooking } from '@/sanity/lib/fetch';
import { pageHotelBookingQuery } from '@/sanity/lib/queries';
import PageHotelBooking from './_components/PageHotelBooking';
import PreviewPageHotelBooking from './_components/PreviewPageHotelBooking';

export async function generateMetadata() {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getPageHotelBooking({ isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page() {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getPageHotelBooking({ isPreviewMode });
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

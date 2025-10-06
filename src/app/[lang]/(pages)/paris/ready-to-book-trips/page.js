import PageTripReady from './_components/PageTripReady';
import PreviewPageReadyTrip from './_components/PreviewPageReadyTrip';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getTripReadyPage } from '@/sanity/lib/fetch';
import { pageContactQuery } from '@/sanity/lib/queries';

export async function generateMetadata() {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getTripReadyPage({ isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page() {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getTripReadyPage({
		isPreviewMode,
	});

	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageContactQuery}
			initialData={page}
			as={PreviewPageReadyTrip}
		>
			<PageTripReady data={page} />
		</LiveQuery>
	);
}

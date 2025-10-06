import PageContact from './_components/PageContact';
import PreviewPageContact from './_components/PreviewPageContact';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getContactPage } from '@/sanity/lib/fetch';
import { pageContactQuery } from '@/sanity/lib/queries';

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getContactPage({ params, isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getContactPage({ params, isPreviewMode });
	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageContactQuery}
			initialData={page}
			as={PreviewPageContact}
		>
			<PageContact data={page} />
		</LiveQuery>
	);
}

import PageBlogIndex from './_components/PageBlogIndex';
import PreviewPageBlogIndex from './_components/PreviewPageBlogIndex';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getBlogIndexPage } from '@/sanity/lib/fetch';
import { pageBlogIndexWithArticleDataSSGQuery } from '@/sanity/lib/queries';

export async function generateMetadata() {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getBlogIndexPage({ isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page() {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getBlogIndexPage({
		isPreviewMode,
		isArticleDataSSG: true,
	});
	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageBlogIndexWithArticleDataSSGQuery}
			initialData={page}
			as={PreviewPageBlogIndex}
		>
			<PageBlogIndex data={page} />
		</LiveQuery>
	);
}

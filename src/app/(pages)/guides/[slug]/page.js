import PageBlogSingle from '../_components/PageBlogSingle';
import PreviewPageBlogSingle from '../_components/PreviewPageBlogSingle';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageBlogSingleQuery } from '@/sanity/lib/queries';
import { getBlogSinglePage, getPagesPaths } from '@/sanity/lib/fetch';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'pBlog' });
	const params = slugs.map((slug) => ({ slug }));
	return params;
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getBlogSinglePage({ queryParams: params, isPreviewMode });
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getBlogSinglePage({
		queryParams: params,
		isPreviewMode,
	});
	const { page } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageBlogSingleQuery}
			initialData={page}
			params={{ slug: params.slug }}
			as={PreviewPageBlogSingle}
		>
			<PageBlogSingle data={page} />
		</LiveQuery>
	);
}

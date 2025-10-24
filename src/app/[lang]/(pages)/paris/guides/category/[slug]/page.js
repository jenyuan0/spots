import PageGuidesIndex from '../../_components/PageGuidesIndex';
import PreviewPageGuidesIndex from '../../_components/PreviewPageGuidesIndex';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageGuidesCategoryQuery } from '@/sanity/lib/queries';
import { getGuidesCategoryPage, getPagesPaths } from '@/sanity/lib/fetch';
import { i18n } from '../../../../../../../../languages';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'gCategories' });

	return i18n.languages.flatMap((language) =>
		slugs.map((slug) => ({
			lang: language.id,
			slug,
		}))
	);
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getGuidesCategoryPage({
		params,
		isPreviewMode,
	});
	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getGuidesCategoryPage({
		params,
		isPreviewMode,
	});
	const { page, site } = pageData || {};

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageGuidesCategoryQuery}
			initialData={page}
			params={{ slug: params.slug }}
			as={PreviewPageGuidesIndex}
		>
			<PageGuidesIndex data={page} siteData={site} />
		</LiveQuery>
	);
}

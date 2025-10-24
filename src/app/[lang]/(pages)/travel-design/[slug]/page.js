import PageCasesSingle from '../_components/PageCasesSingle';
import PreviewPageCasesSingle from '../_components/PreviewPageCasesSingle';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageCasesSingleQuery } from '@/sanity/lib/queries';
import { getCasesSinglePage, getPagesPaths } from '@/sanity/lib/fetch';
import { i18n } from '../../../../../../languages';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'gCases' });

	return i18n.languages.flatMap((language) =>
		slugs.map((slug) => ({
			lang: language.id,
			slug,
		}))
	);
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getCasesSinglePage({
		params,
		isPreviewMode,
	});

	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getCasesSinglePage({
		params,
		isPreviewMode,
	});

	const { page, site } = pageData || {};
	const metadata = defineMetadata({ data: { site, page } });

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageCasesSingleQuery}
			initialData={page}
			params={{ slug: params.slug }}
			as={PreviewPageCasesSingle}
		>
			{metadata?.jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(metadata.jsonLd),
					}}
				/>
			)}
			<PageCasesSingle data={page} siteData={site} />
		</LiveQuery>
	);
}

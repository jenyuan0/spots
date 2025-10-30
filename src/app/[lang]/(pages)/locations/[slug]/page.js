import PageLocationsSingle from '../_components/PageLocationsSingle';
import PreviewPageLocationsSingle from '../_components/PreviewPageLocationsSingle';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { pageLocationsSingleQuery } from '@/sanity/lib/queries';
import { getLocationsSinglePage, getPagesPaths } from '@/sanity/lib/fetch';
import { i18n } from '../../../../../../languages.js';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'gLocations' });

	return i18n.languages.flatMap((language) =>
		slugs.map((slug) => ({
			lang: language.id,
			slug,
		}))
	);
}

export async function generateMetadata({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const data = await getLocationsSinglePage({
		params,
		isPreviewMode,
	});

	return defineMetadata({ data });
}

export default async function Page({ params }) {
	const isPreviewMode = draftMode().isEnabled;
	const pageData = await getLocationsSinglePage({
		params,
		isPreviewMode,
	});
	const modifiedParam = {
		...params,
		language: params.lang?.replace('-', '_'),
	};

	const { page, site } = pageData || {};
	const metadata = defineMetadata({ data: { site, page } });

	if (!page) return notFound();

	return (
		<LiveQuery
			enabled={isPreviewMode}
			query={pageLocationsSingleQuery}
			initialData={page}
			params={modifiedParam}
			as={PreviewPageLocationsSingle}
		>
			{metadata?.jsonLd && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(metadata.jsonLd),
					}}
				/>
			)}
			<PageLocationsSingle data={page} siteData={site} />
		</LiveQuery>
	);
}

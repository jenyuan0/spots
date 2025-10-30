import { draftMode } from 'next/headers';
import { LiveQuery } from 'next-sanity/preview/live-query';
import defineMetadata from '@/lib/defineMetadata';
import { getPageBySlug, getPagesPaths } from '@/sanity/lib/fetch';
import { pagesBySlugQuery } from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import PageGeneral from '../../(pages)/_components/PageGeneral';
import PreviewPageGeneral from '../../(pages)/_components/PreviewPageGeneral';
import { i18n } from '../../../../../languages.js';

export async function generateStaticParams() {
	const slugs = await getPagesPaths({ pageType: 'pGeneral' });

	return i18n.languages.flatMap((language) =>
		slugs.map((slug) => ({
			lang: language.id,
			slug,
		}))
	);
}

const getPageData = async ({ params }) => {
	return await getPageBySlug({ params });
};

export async function generateMetadata({ params, searchParams }, parent) {
	const data = await getPageData({ params });
	return defineMetadata({ data });
}

export default async function PageSlugRoute({ params }) {
	const data = await getPageData({ params });
	const { page } = data;

	if (!page) {
		return notFound();
	}

	return (
		<LiveQuery
			enabled={draftMode().isEnabled}
			query={pagesBySlugQuery}
			initialData={page}
			params={{ slug: params.slug }}
			as={PreviewPageGeneral}
		>
			<PageGeneral data={page} />
		</LiveQuery>
	);
}

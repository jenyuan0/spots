import { imageBuilder } from '@/sanity/lib/image';
import { getRoute } from '@/lib/routes';
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields

const removeDoubleSlashes = (str) => {
	return str.replace(/\/\//g, '');
};

export default function defineMetadata({ data }) {
	const { site, page } = data || {};
	const { _type, slug } = page || {};

	const siteTitle = site?.title || '';
	const metaDesc = page?.sharing?.metaDesc || '';
	const metaTitle = page?.isHomepage
		? page?.sharing?.metaTitle || siteTitle
		: `${page?.sharing?.metaTitle || page?.title || 'Page not found'} | ${siteTitle}`;

	const siteFavicon = site?.sharing?.favicon || false;
	const siteFaviconUrl = siteFavicon
		? imageBuilder.image(siteFavicon).width(256).height(256).url()
		: '/favicon.ico';
	const siteFaviconLight = site?.sharing?.faviconLight || false;
	const siteFaviconLightUrl = siteFaviconLight
		? imageBuilder.image(siteFaviconLight).width(256).height(256).url()
		: siteFaviconUrl;

	const shareGraphic =
		page?.sharing?.shareGraphic?.asset ||
		site?.sharing?.shareGraphic?.asset ||
		'';
	const shareGraphicUrl = shareGraphic
		? imageBuilder.image(shareGraphic).width(1200).url()
		: false;

	const disableIndex = page?.sharing?.disableIndex;
	const pageRoute = getRoute({
		documentType: _type,
		slug: slug,
	});

	return {
		title: metaTitle,
		description: metaDesc,
		creator: siteTitle,
		publisher: siteTitle,
		applicationName: siteTitle,
		openGraph: {
			title: metaTitle,
			description: metaDesc,
			images: [shareGraphicUrl],
			url: process.env.SITE_URL,
			siteName: siteTitle,
			locale: 'en_US',
			type: 'website',
		},
		icons: {
			icon: [
				{
					url: siteFaviconUrl,
					media: '(prefers-color-scheme: light)',
				},
				{
					url: siteFaviconLightUrl,
					media: '(prefers-color-scheme: dark)',
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: metaTitle,
			description: metaDesc,
			creator: siteTitle,
			images: [shareGraphicUrl],
		},
		metadataBase: new URL(process.env.SITE_URL),
		alternates: {
			...(pageRoute && {
				canonical: removeDoubleSlashes(`${process.env.SITE_URL}${pageRoute}`),
			}),
			// TODO: enable when site is multilingual
			// languages: {
			// 	'en-US': '/en-US',
			// },
		},
		robots: {
			index: disableIndex ? false : true,
			follow: disableIndex ? false : true,
			nocache: true,
		},
	};
}

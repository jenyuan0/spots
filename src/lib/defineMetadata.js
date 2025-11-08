import { imageBuilder } from '@/sanity/lib/image';
import { getRoute } from '@/lib/routes';
import { formatUrl } from '@/lib/helpers';
import { toPlainText } from '@portabletext/react';
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields

export default function defineMetadata({ data }) {
	const { site, page } = data || {};
	const { _type, slug, language } = page || {};
	const siteTitle = site?.title || '';
	// Compose metaDesc: prefer sharing.metaDesc, then locationsParagraph (as plain text, truncated), or fallback to ''
	let rawParagraph = '';

	if (page?.sharing?.metaDesc) {
		rawParagraph = page.sharing.metaDesc;
	} else if (page?._type === 'gItineraries') {
		rawParagraph = page?.introduction || '';
	} else if (page?._type === 'gLocations') {
		rawParagraph = page?.content ? toPlainText(page.content) : '';
	} else if (page?._type === 'pLocations') {
		rawParagraph = page?.paragraph ? toPlainText(page.paragraph) : '';
	} else if (page?._type === 'pLocationsCategory') {
		rawParagraph = page?.locationsParagraph
			? toPlainText(page.locationsParagraph)
			: '';
	} else if (page?._type === 'gGuides') {
		rawParagraph =
			page?.excerpt || (page?.content ? toPlainText(page.content) : '');
	} else if (page?._type === 'pGuides') {
		rawParagraph = page?.paragraph ? toPlainText(page.paragraph) : '';
	} else if (page?._type === 'pGuidesCategory') {
		rawParagraph = page?.guidesParagraph
			? toPlainText(page.guidesParagraph)
			: '';
	} else if (page?.locationsParagraph) {
		rawParagraph = toPlainText(page.locationsParagraph);
	} else if (page?.paragraph) {
		rawParagraph = toPlainText(page.paragraph);
	}

	const truncatedParagraph =
		rawParagraph.length > 155
			? rawParagraph.slice(0, 152).trim() + '...'
			: rawParagraph;
	const metaDesc = truncatedParagraph || '';
	const metaTitle = page?.sharing?.metaTitle
		? page.sharing.metaTitle
		: page?.isHomepage
			? siteTitle
			: page?._type === 'pLocationsCategory'
				? `The Best ${page?.title} in Paris | Updated ${new Date().toLocaleDateString(
						'en-US',
						{
							month: 'long',
							year: 'numeric',
						}
					)}`
				: page?.title
					? `${page.title}${page.title?.length < 48 ? ` | ${siteTitle}` : ''}`
					: `Page not found | ${siteTitle}`;

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

	// Map category/subcategory titles to Schema.org @type
	const schemaTypeMap = {
		Accommodations: 'Hotel',
		'Food & Drinks': 'FoodEstablishment',
		'Sights & Attractions': 'LocalBusiness',
		'Things to do': 'LocalBusiness',
		'Health & Beauty': 'HealthAndBeautyBusiness',
		Nightlife: 'BarOrNightClub',
		'Shopping & Gifts': 'Store',
		Tips: 'LocalBusiness',
		// Optional refinements based on common subcategories
		Museums: 'Museum',
		Restaurants: 'Restaurant',
		Cafés: 'CafeOrCoffeeShop',
		Bistros: 'Restaurant',
		Bars: 'BarOrPub',
		Clubs: 'NightClub',
		Spas: 'Spa',
		Bookstores: 'BookStore',
		'Gift Shops': 'Store',
		'Flea Markets': 'FleaMarket',
		Galleries: 'ArtGallery',
		'Furniture Shop': 'FurnitureStore',
		'Pastry Shops': 'Bakery',
		'Wine bars': 'BarOrPub',
		'Department Stores': 'DepartmentStore',
		'Cultural Centers': 'CivicStructure',
	};

	const allTitles = [
		...(page?.categories || []).map((cat) => cat?.title),
		...(page?.subcategories || []).map((sub) => sub?.title),
	];

	const matchedTitle = allTitles.find((title) => schemaTypeMap[title]);
	const schemaType = schemaTypeMap[matchedTitle] || 'Place';

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
				canonical: formatUrl(
					`${process.env.SITE_URL}/${language}${pageRoute == '/' ? '' : pageRoute}`
				),
			}),
			// TODO: enable when site is multilingual
			// languages: {
			// 	'en-US': '/en-US',
			// },
		},
		robots: {
			index: !disableIndex,
			follow: !disableIndex,
			nocache: true,
		},
		// Schema.org structured data
		...(page?._type === 'gLocations' && {
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': schemaType,
				name: page?.title || 'Untitled',
				description: metaDesc,
				url: formatUrl(`${process.env.SITE_URL}${pageRoute}`),
				address: {
					'@type': 'PostalAddress',
					streetAddress: page?.address?.street || '',
					addressLocality: page?.address?.city || '',
					postalCode: page?.address?.zip || '',
					addressCountry: 'FR',
				},
				geo: {
					'@type': 'GeoCoordinates',
					latitude: page?.geo?.lat || '',
					longitude: page?.geo?.lng || '',
				},
				image: page?.images?.length
					? page.images
							.map((img) =>
								img?.asset?._ref
									? imageBuilder.image(img).width(1200).url()
									: null
							)
							.filter(Boolean)
					: [],
				// openingHours: page?.openingHours || [],
			},
		}),
		...(page?._type === 'gGuides' && {
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				headline: page?.title || 'Untitled',
				name: page?.title || 'Untitled',
				description: metaDesc,
				url: formatUrl(`${process.env.SITE_URL}${pageRoute}`),
				datePublished: page?.publishDate
					? new Date(page.publishDate).toISOString()
					: '',
				image: page?.thumb?.asset
					? imageBuilder.image(page.thumb).width(1200).url()
					: shareGraphicUrl || '',
				author: {
					'@type': 'Organization',
					name: siteTitle,
				},
				inLanguage: 'en',
			},
		}),
		...(page?._type === 'gItineraries' && {
			jsonLd: {
				'@context': 'https://schema.org',
				'@type': 'Trip',
				name: page?.title || 'Untitled',
				description: metaDesc,
				url: formatUrl(`${process.env.SITE_URL}${pageRoute}`),
				image: shareGraphicUrl || '',
				itinerary: (page?.plan || []).map((day, index) => ({
					'@type': 'ItemList',
					name: day?.title || `Day ${index + 1}`,
					itemListElement: (day?.content || []).map((block, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						name: toPlainText([block]),
					})),
				})),
			},
		}),
	};
}

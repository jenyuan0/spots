import {
	PinIcon,
	HighlightIcon,
	CalendarIcon,
	BookIcon,
	CommentIcon,
	TagsIcon,
	UserIcon,
	BlockContentIcon,
} from '@sanity/icons';
import { apiVersion } from '@/sanity/env';

export const globalLocations = (S) => {
	return S.listItem()
		.title('Locations')
		.schemaType('gLocations')
		.icon(PinIcon)
		.child(
			S.documentTypeList('gLocations')
				.title('Locations')
				.filter(`_type == "gLocations"`)
				.apiVersion(apiVersion)
				.child((documentId) =>
					S.document().documentId(documentId).schemaType('gLocations')
				)
				.canHandleIntent(
					(intent, { type }) =>
						['create', 'edit'].includes(intent) && type === 'gLocations'
				)
		);
};

export const globalItinerariesDay = (S) => {
	return S.listItem()
		.title('Itineraries (day)')
		.schemaType('gItinerariesDay')
		.icon(CalendarIcon)
		.child(
			S.documentTypeList('gItinerariesDay')
				.title('Itineraries (day)')
				.filter(`_type == "gItinerariesDay"`)
				.apiVersion(apiVersion)
				.child((documentId) =>
					S.document().documentId(documentId).schemaType('gItinerariesDay')
				)
				.canHandleIntent(
					(intent, { type }) =>
						['create', 'edit'].includes(intent) && type === 'gItinerariesDay'
				)
		);
};

export const globalItineraries = (S) => {
	return S.listItem()
		.title('Itineraries')
		.schemaType('gItineraries')
		.icon(HighlightIcon)
		.child(
			S.documentTypeList('gItineraries')
				.title('Itineraries')
				.filter(`_type == "gItineraries"`)
				.apiVersion(apiVersion)
				.child((documentId) =>
					S.document().documentId(documentId).schemaType('gItineraries')
				)
				.canHandleIntent(
					(intent, { type }) =>
						['create', 'edit'].includes(intent) && type === 'gItineraries'
				)
		);
};

export const globalGuides = (S) => {
	return S.listItem()
		.title('Guides')
		.child(S.documentTypeList('gGuides').title('Guides'))
		.icon(BookIcon);
};

export const globalAds = (S) => {
	return S.listItem()
		.title('Ads')
		.schemaType('gAds')
		.icon(BlockContentIcon)
		.child(
			S.documentTypeList('gAds')
				.title('Ads')
				.filter(`_type == "gAds"`)
				.apiVersion(apiVersion)
				.child((documentId) =>
					S.document().documentId(documentId).schemaType('gAds')
				)
				.canHandleIntent(
					(intent, { type }) =>
						['create', 'edit'].includes(intent) && type === 'gAds'
				)
		);
};

export const globalCategories = (S) => {
	return S.listItem()
		.title('Categories')
		.child(S.documentTypeList('gCategories').title('Categories'))
		.icon(TagsIcon);
};

export const globalSubcategories = (S) => {
	return S.listItem()
		.title('Subcategories')
		.child(S.documentTypeList('gSubcategories').title('Subcategories'))
		.icon(TagsIcon);
};

export const globalAuthors = (S) => {
	return S.listItem()
		.title('Authors')
		.child(S.documentTypeList('gAuthors').title('Authors'))
		.icon(UserIcon);
};

export const pageGuidesFilters = (S) => {
	return S.listItem()
		.title('Filters')
		.child(
			S.list()
				.title('Filters')
				.items([
					S.listItem()
						.title('By Category')
						.child(
							S.documentTypeList('gCategories')
								.title('Guides by Category')
								.child((categoryId) => {
									return S.documentList()
										.title('Articles')
										.apiVersion(apiVersion)
										.filter(
											'_type == "gGuides" && $categoryId in category[]._ref'
										)
										.params({ categoryId });
								})
						),
					S.listItem()
						.title('By Author')
						.child(
							S.documentTypeList('gAuthor')
								.title('Guides by Author')
								.child((authorId) =>
									S.documentList()
										.title('Guides')
										.apiVersion(apiVersion)
										.filter('_type == "gGuides" && $authorId == author._ref')
										.params({ authorId })
								)
						),
				])
		);
};

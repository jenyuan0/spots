import {
	PinIcon,
	HighlightIcon,
	BookIcon,
	CommentIcon,
	TagsIcon,
	UserIcon,
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
				.apiVersion('v2023-08-01')
				.child((documentId) =>
					S.document().documentId(documentId).schemaType('gLocations')
				)
				.canHandleIntent(
					(intent, { type }) =>
						['create', 'edit'].includes(intent) && type === 'gLocations'
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
				.title('Locations')
				.filter(`_type == "gItineraries"`)
				.apiVersion('v2023-08-01')
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

export const globalFAQ = (S) => {
	return S.listItem()
		.title('FAQ')
		.schemaType('gFAQ')
		.icon(CommentIcon)
		.child(
			S.documentTypeList('gFAQ')
				.title('FAQ')
				.filter(`_type == "gFAQ"`)
				.apiVersion('v2023-08-01')
				.child((documentId) =>
					S.document().documentId(documentId).schemaType('gFAQ')
				)
				.canHandleIntent(
					(intent, { type }) =>
						['create', 'edit'].includes(intent) && type === 'gFAQ'
				)
		);
};

export const globalCategories = (S) => {
	return S.listItem()
		.title('Categories')
		.child(S.documentTypeList('gCategories').title('Categories'))
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

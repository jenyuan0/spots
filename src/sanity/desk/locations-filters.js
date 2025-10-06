import { apiVersion } from '@/sanity/env';

export const locationsFilterEmptyContent = (S) => {
	return S.listItem()
		.title('Locations - Empty Content')
		.child(
			S.documentList()
				.title('Locations with Empty Content')
				.apiVersion(apiVersion)
				.filter(
					'_type == "gLocations" && language == "en" && (!defined(content) || count(content) == 0)'
				)
		);
};

export const locationsFilterHideFromIndex = (S) => {
	return S.listItem()
		.title('Locations - Hide from Index')
		.child(
			S.documentList()
				.title('Locations - Hidden from Index')
				.apiVersion(apiVersion)
				.filter(
					'_type == "gLocations" && language == "en" && hideFromIndex == true'
				)
		);
};

export const locationsFilterByCategory = (S) => {
	return S.listItem()
		.title('Locations - By Category')
		.child(
			S.documentTypeList('gCategories')
				.title('Locations by Category')
				.child((categoryId) => {
					return S.documentList()
						.title('Locations')
						.apiVersion(apiVersion)
						.filter(
							'_type == "gLocations" && language == "en" && references($categoryId)'
						)
						.params({ categoryId });
				})
		);
};

export const locationsFilterBySubcategory = (S) => {
	return S.listItem()
		.title('Locations - By Subcategory')
		.child(
			S.documentTypeList('gSubcategories')
				.title('Locations by Subcategory')
				.child((categoryId) => {
					return S.documentList()
						.title('Locations')
						.apiVersion(apiVersion)
						.filter(
							'_type == "gLocations" && language == "en" && references($categoryId)'
						)
						.params({ categoryId });
				})
		);
};

export const locationsFilterByHighlight = (S) => {
	return S.listItem()
		.title('Locations - By Highlight')
		.child(
			S.list()
				.title('Locations by Highlight')
				.items([
					S.listItem()
						.title('Iconic')
						.child(
							S.documentList()
								.title('Iconic Locations')
								.filter(
									'_type == "gLocations" && language == "en" && "iconic" in highlights'
								)
						),
					S.listItem()
						.title('Trending')
						.child(
							S.documentList()
								.title('Trending Locations')
								.filter(
									'_type == "gLocations" && language == "en" && "trending" in highlights'
								)
						),
					S.listItem()
						.title('Editor’s Pick')
						.child(
							S.documentList()
								.title('Editor’s Pick Locations')
								.filter(
									'_type == "gLocations" && language == "en" && "editors-pick" in highlights'
								)
						),
					S.listItem()
						.title('On Our Radar')
						.child(
							S.documentList()
								.title('On Our Radar Locations')
								.filter(
									'_type == "gLocations"  && language == "en"&& "on-our-radar" in highlights'
								)
						),
				])
		);
};

import { apiVersion } from '@/sanity/env';

export const guidesFilterByCategory = (S) => {
	return S.listItem()
		.title('Guides - By Category')
		.child(
			S.documentTypeList('gCategories')
				.title('Guides by Category')
				.child((categoryId) => {
					return S.documentList()
						.title('Blogs')
						.apiVersion(apiVersion)
						.filter(
							'_type == "gGuides" && language == "en" && references($categoryId)'
						)
						.params({ categoryId });
				})
		);
};

export const guidesFilterBySubcategory = (S) => {
	return S.listItem()
		.title('Guides - By Subcategory')
		.child(
			S.documentTypeList('gSubcategories')
				.title('Guides by Subcategory')
				.child((categoryId) => {
					return S.documentList()
						.title('Blogs')
						.apiVersion(apiVersion)
						.filter(
							'_type == "gGuides" && language == "en" && references($categoryId)'
						)
						.params({ categoryId });
				})
		);
};

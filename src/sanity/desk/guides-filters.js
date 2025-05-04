import { apiVersion } from '@/sanity/env';

export const GuidesFilterByCategory = (S) => {
	return S.listItem()
		.title('Guides - By Category')
		.child(
			S.documentTypeList('gCategories')
				.title('Guides by Category')
				.child((categoryId) => {
					return S.documentList()
						.title('Blogs')
						.apiVersion(apiVersion)
						.filter('_type == "gGuides" && references($categoryId)')
						.params({ categoryId });
				})
		);
};

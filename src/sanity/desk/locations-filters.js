import { apiVersion } from '@/sanity/env';

export const locationsFilterByCategory = (S) => {
	return S.listItem()
		.title('Locations - By Category')
		.child(
			S.documentTypeList('gCategories')
				.title('Blogs by Category')
				.child((categoryId) => {
					return S.documentList()
						.title('Blogs')
						.apiVersion(apiVersion)
						.filter('_type == "gLocations" && references($categoryId)')
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
						.title('Must-See')
						.child(
							S.documentList()
								.title('Must-See Locations')
								.filter('_type == "gLocations" && "must-see" in highlights')
						),
					S.listItem()
						.title('Trending')
						.child(
							S.documentList()
								.title('Trending Locations')
								.filter('_type == "gLocations" && "trending" in highlights')
						),
					S.listItem()
						.title('Editor’s Pick')
						.child(
							S.documentList()
								.title('Editor’s Pick Locations')
								.filter('_type == "gLocations" && "editors-pick" in highlights')
						),
					S.listItem()
						.title('On Our Radar')
						.child(
							S.documentList()
								.title('On Our Radar Locations')
								.filter('_type == "gLocations" && "on-our-radar" in highlights')
						),
				])
		);
};

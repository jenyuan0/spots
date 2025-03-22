import title from '@/sanity/schemas/objects/title';
import { getPortableTextPreview } from '@/sanity/lib/helpers';

export default function contentList() {
	return {
		name: 'contentList',
		type: 'object',
		fields: [
			title({
				required: false,
			}),
			{
				name: 'subtitle',
				type: 'string',
			},
			{
				name: 'content',
				type: 'portableTextSimple',
			},
			{
				name: 'items',
				type: 'array',
				of: [
					{
						title: 'Guides / Categories',
						name: 'categoryGuides',
						type: 'reference',
						to: [{ type: 'gCategories' }],
					},
					{
						title: 'Guides / Subategories',
						name: 'subcategoryGuides',
						type: 'reference',
						to: [{ type: 'gSubcategories' }],
					},
					{
						name: 'guide',
						type: 'reference',
						to: [{ type: 'gGuides' }],
					},
					{
						title: 'Location / Categories',
						name: 'categoryLocations',
						type: 'reference',
						to: [{ type: 'gCategories' }],
					},
					{
						title: 'Location / Subategories',
						name: 'subcategoryLocations',
						type: 'reference',
						to: [{ type: 'gSubcategories' }],
					},
					{
						name: 'location',
						type: 'reference',
						to: [{ type: 'gLocations' }],
					},
					{
						name: 'itinerary',
						type: 'reference',
						to: [{ type: 'gItineraries' }],
					},
				],
			},
		],
		preview: {
			select: {
				title: 'title',
				content: 'content',
			},
			prepare({ title, content }) {
				return {
					title: title || 'Untitled',
					subtitle: content ? getPortableTextPreview(content) : '',
				};
			},
		},
	};
}

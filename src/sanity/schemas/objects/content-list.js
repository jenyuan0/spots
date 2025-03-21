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
						name: 'category',
						type: 'reference',
						to: [{ type: 'gCategories' }],
					},
					{
						name: 'subcategory',
						type: 'reference',
						to: [{ type: 'gSubcategories' }],
					},
					{
						name: 'guide',
						type: 'reference',
						to: [{ type: 'gGuides' }],
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

import title from '@/sanity/schemas/objects/title';
import { getPortableTextPreview } from '@/sanity/lib/helpers';

export default function guideList() {
	return {
		name: 'guideList',
		type: 'object',
		fields: [
			title(),
			{
				name: 'content',
				type: 'portableTextSimple',
			},
			{
				name: 'color',
				type: 'colorSelect',
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
				color: 'color',
			},
			prepare({ title, content, color }) {
				return {
					title: title || 'Untitled',
					subtitle: content ? getPortableTextPreview(content) : '',
					media: (
						<span
							style={{ position: 'absolute', inset: 0, background: color }}
						></span>
					),
				};
			},
		},
	};
}

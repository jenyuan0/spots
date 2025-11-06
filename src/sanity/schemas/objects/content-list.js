import title from '@/sanity/schemas/objects/title';
import { getPortableTextPreview } from '@/sanity/lib/helpers';
import { LinkInput } from '@/sanity/component/LinkInput';

export default function contentList() {
	return {
		name: 'contentList',
		type: 'object',
		fields: [
			title({
				required: false,
			}),
			{
				type: 'string',
				name: 'titleUrl',
				components: {
					input: LinkInput,
				},
			},
			{
				name: 'subtitle',
				type: 'string',
			},
			{
				name: 'excerpt',
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
						options: {
							filter: '_type == "gCategories" && language == "en"',
						},
					},
					{
						title: 'Guides / Subategories',
						name: 'subcategoryGuides',
						type: 'reference',
						to: [{ type: 'gSubcategories' }],
						options: {
							filter: '_type == "gSubcategories" && language == "en"',
						},
					},
					{
						name: 'guide',
						type: 'reference',
						to: [{ type: 'gGuides' }],
						options: {
							filter: '_type == "gGuides" && language == "en"',
						},
					},
					{
						title: 'Location / Categories',
						name: 'categoryLocations',
						type: 'reference',
						to: [{ type: 'gCategories' }],
						options: {
							filter: '_type == "gCategories" && language == "en"',
						},
					},
					{
						title: 'Location / Subategories',
						name: 'subcategoryLocations',
						type: 'reference',
						to: [{ type: 'gSubcategories' }],
						options: {
							filter: '_type == "gSubcategories" && language == "en"',
						},
					},
					{
						name: 'location',
						type: 'reference',
						to: [{ type: 'gLocations' }],
						options: {
							filter: '_type == "gLocations" && language == "en"',
						},
					},
				],
			},
		],
		preview: {
			select: {
				title: 'title',
				excerpt: 'excerpt',
			},
			prepare({ title, excerpt }) {
				return {
					title: title || 'Untitled',
					subtitle: excerpt ? getPortableTextPreview(excerpt) : '',
				};
			},
		},
	};
}

import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';

export default defineType({
	title: 'Locations',
	name: 'gLocations',
	type: 'document',
	fields: [
		title(),
		slug(),
		{
			name: 'geo',
			type: 'geopoint',
			validation: (Rule) => [Rule.required()],
		},
		{
			name: 'address',
			title: 'Address',
			type: 'object',
			fields: [
				{ name: 'street', type: 'string' },
				{ name: 'city', type: 'string', initialValue: 'Paris' },
				{ name: 'zip', type: 'string' },
			],
			options: {
				columns: 2,
			},
		},
		{
			name: 'price',
			type: 'priceSelect',
		},
		{
			name: 'categories',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gCategories' }],
				},
			],
			validation: (Rule) => [Rule.required()],
		},
		{
			name: 'subcategories',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gSubcategories' }],
					options: {
						// filter: `_type == "gSubcategories" && references(*[_type == "gCategories" && _id in ^.^.categories[]._ref]._id)`,
					},
				},
			],
			hidden: ({ parent }) => !parent?.categories,
		},
		{
			name: 'images',
			type: 'array',
			of: [customImage({ hasCropOptions: true })],
			options: {
				layout: 'grid',
			},
		},
		{
			name: 'content',
			type: 'portableTextSimple',
		},
		{
			title: 'Content (Itinerary Only)',
			name: 'contentItinerary',
			type: 'portableTextSimple',
		},
		{
			name: 'urls',
			type: 'array',
			of: [
				{
					name: 'url',
					type: 'url',
				},
			],
		},
		{
			name: 'fees',
			type: 'array',
			of: [
				{
					name: 'fee',
					type: 'string',
				},
			],
		},
		{
			name: 'relatedLocations',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
				},
			],
		},
		{
			name: 'relatedGuides',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gGuides' }],
				},
			],
		},
		sharing(),
	],
	preview: {
		select: {
			title: 'title',
			geo: 'geo',
			price: 'price',
			categories0: 'categories.0.title',
			categories1: 'categories.1.title',
			categories2: 'categories.2.title',
			subcategories0: 'subcategories.0.title',
			subcategories1: 'subcategories.1.title',
			subcategories2: 'subcategories.2.title',
			images: 'images',
		},
		prepare({
			title = 'Untitled',
			geo,
			price,
			categories0,
			categories1,
			categories2,
			subcategories0,
			subcategories1,
			subcategories2,
			images,
		}) {
			const categories = [categories0, categories1, categories2];
			const subcategories = [subcategories0, subcategories1, subcategories2];

			if (!geo || !categories.some(Boolean)) {
				return {
					title,
					subtitle: !geo ? '[Missing Geo]' : '[Missing Category]',
					media: <span>⚠️</span>,
				};
			}

			return {
				title,
				subtitle:
					`[${price ? price : '-'}] ${categories.filter(Boolean).join(' • ')}${subcategories.some(Boolean) ? ` / ${subcategories.filter(Boolean).join(' • ')}` : ''}`.trim(),
				media: images?.[0],
			};
		},
	},
});

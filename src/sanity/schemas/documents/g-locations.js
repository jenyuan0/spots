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
					options: {
						filter: '_type == "gCategories" && language == "en"',
					},
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
						filter: '_type == "gSubcategories" && language == "en"',
					},
				},
			],
			hidden: ({ parent }) => !parent?.categories,
		},
		{
			name: 'highlights',
			title: 'Highlights',
			type: 'array',
			of: [{ type: 'string' }],
			options: {
				list: [
					{ title: 'Iconic', value: 'iconic' },
					{ title: 'Trending', value: 'trending' },
					{ title: 'Editor’s Pick', value: 'editors-pick' },
					{ title: 'On Our Radar', value: 'on-our-radar' },
				],
			},
		},
		{
			name: 'hideFromIndex',
			type: 'boolean',
		},
		{
			name: 'images',
			type: 'array',
			of: [customImage({ hasCaptionOptions: true, hasCropOptions: true })],
			options: {
				layout: 'grid',
			},
		},
		{
			name: 'content',
			type: 'portableText',
		},
		{
			title: 'Content (Itinerary Only)',
			name: 'contentItinerary',
			type: 'portableText',
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
					options: {
						filter: '_type == "gLocations" && language == "en"',
					},
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
					options: {
						filter: '_type == "gGuides" && language == "en"',
					},
				},
			],
		},
		sharing(),
		{
			// should match 'languageField' plugin configuration setting, if customized
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		},
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

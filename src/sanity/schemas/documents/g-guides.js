import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import freeform from '@/sanity/schemas/objects/freeform';
import carousel from '@/sanity/schemas/objects/carousel';
import locationList from '@/sanity/schemas/objects/location-list';
import locationSingle from '@/sanity/schemas/objects/location-single';

export default defineType({
	title: 'Guides',
	name: 'gGuides',
	type: 'document',
	fields: [
		title(),
		slug(),
		customImage({ name: 'thumb' }),
		{
			name: 'publishDate',
			type: 'date',
			options: {
				dateFormat: 'MM/DD/YY',
				calendarTodayLabel: 'Today',
			},
			validation: (Rule) => Rule.required(),
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
			name: 'excerpt',
			type: 'text',
			rows: 4,
		},
		{
			name: 'showMap',
			type: 'boolean',
			initialValue: false,
		},
		customImage({ name: 'heroImage' }),
		{
			name: 'content',
			type: 'portableText',
		},
		{
			name: 'related',
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
			thumb: 'thumb',
			categories0: 'categories.0.title',
			categories1: 'categories.1.title',
			categories2: 'categories.2.title',
			subcategories0: 'subcategories.0.title',
			subcategories1: 'subcategories.1.title',
			subcategories2: 'subcategories.2.title',
		},
		prepare({
			title = 'Untitled',
			categories0,
			categories1,
			categories2,
			subcategories0,
			subcategories1,
			subcategories2,
			thumb,
		}) {
			const categories = [categories0, categories1, categories2];
			const subcategories = [subcategories0, subcategories1, subcategories2];

			return {
				title,
				subtitle:
					`${categories.filter(Boolean).join(' • ')}${subcategories.some(Boolean) ? ` / ${subcategories.filter(Boolean).join(' • ')}` : ''}`.trim(),
				media: thumb,
			};
		},
	},
});

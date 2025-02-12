import { defineType } from 'sanity';
import { BlockContentIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import freeform from '@/sanity/schemas/objects/freeform';
import carousel from '@/sanity/schemas/objects/carousel';
import locationList from '@/sanity/schemas/objects/location-list';

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
		},
		{
			name: 'excerpt',
			type: 'text',
			rows: 2,
		},
		{
			name: 'showContentTable',
			type: 'boolean',
			initialValue: false,
		},
		{
			name: 'showMap',
			type: 'boolean',
			initialValue: false,
		},
		{
			name: 'pageModules',
			type: 'array',
			of: [
				freeform(),
				carousel(),
				locationList(),
				{
					title: 'Ad',
					type: 'object',
					icon: BlockContentIcon,
					fields: [
						{
							name: 'ads',
							type: 'reference',
							to: [{ type: 'gAds' }],
						},
					],
				},
			],
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
		},
		prepare({
			title = 'Untitled',
			categories0,
			categories1,
			categories2,
			thumb,
		}) {
			const categories = [categories0, categories1, categories2];

			return {
				title,
				subtitle: categories.some(Boolean)
					? categories.filter(Boolean).join(', ')
					: '[Missing Category]',
				media: thumb,
			};
		},
	},
});

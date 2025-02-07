import { defineType } from 'sanity';
import title from '@/sanity/lib/title';
import slug from '@/sanity/lib/slug';
import sharing from '@/sanity/lib/sharing';
import customImage from '@/sanity/lib/custom-image';

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
			categories0: 'categories.0.title',
			categories1: 'categories.1.title',
			categories2: 'categories.2.title',
			images: 'images',
		},
		prepare({
			title = 'Untitled',
			geo,
			categories0,
			categories1,
			categories2,
			images,
		}) {
			const categories = [categories0, categories1, categories2];

			if (!geo || !categories.some(Boolean)) {
				return {
					title,
					subtitle: !geo ? '[Missing Geo]' : '[Missing Category]',
					media: <span>⚠️</span>,
				};
			}

			return {
				title: title,
				subtitle: categories.filter(Boolean).join(', '),
				media: images?.[0] || false,
			};
		},
	},
});

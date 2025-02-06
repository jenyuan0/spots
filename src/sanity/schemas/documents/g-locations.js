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
			name: 'related',
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
			categories0: 'categories.0.title',
			categories1: 'categories.1.title',
			categories2: 'categories.2.title',
			images: 'images',
		},
		prepare({
			title = 'Untitled',
			categories0,
			categories1,
			categories2,
			images,
		}) {
			const categories = [categories0, categories1, categories2].filter(
				Boolean
			);
			const subtitle =
				categories.length > 0 ? `${categories.join(', ')}` : 'Missing category';

			return {
				title: title,
				subtitle: subtitle,
				media: images[0],
			};
		},
	},
});

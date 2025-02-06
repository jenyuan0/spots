import { defineType } from 'sanity';
import { BlockContentIcon } from '@sanity/icons';
import title from '@/sanity/lib/title';
import slug from '@/sanity/lib/slug';
import sharing from '@/sanity/lib/sharing';
import customImage from '@/sanity/lib/custom-image';

export default defineType({
	title: 'Guides',
	name: 'gGuides',
	type: 'document',
	fields: [
		title(),
		slug(),
		{
			name: 'publishDate',
			type: 'date',
			options: {
				dateFormat: 'MM/DD/YY',
				calendarTodayLabel: 'Today',
			},
			validation: (Rule) => Rule.required(),
		},
		customImage({ name: 'thumb' }),
		{
			name: 'showContentTable',
			type: 'boolean',
		},
		{
			name: 'showMap',
			type: 'boolean',
		},
		{
			name: 'pageModules',
			type: 'array',
			of: [
				{ type: 'freeform' },
				{ type: 'carousel' },
				{ type: 'locationList' },
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
			slug: 'slug',
		},
		prepare({ title = 'Untitled', slug = {} }) {
			return {
				title,
				subtitle: slug.current ? `/${slug.current}` : 'Missing page slug',
			};
		},
	},
});

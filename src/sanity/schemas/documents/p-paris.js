import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import contentList from '@/sanity/schemas/objects/content-list';
import customImage from '@/sanity/schemas/objects/custom-image';
// import locationList from '@/sanity/schemas/objects/location-list';

export default defineType({
	title: 'Locations',
	name: 'pParis',
	type: 'document',
	fields: [
		title({ readOnly: true }),
		slug({ readOnly: true }),
		{
			title: 'Eyebrow',
			name: 'eyebrow',
			type: 'string',
		},
		{
			title: 'Title',
			name: 'titleHeader',
			type: 'string',
		},
		{
			title: 'CTA Label',
			name: 'ctaLabel',
			type: 'string',
		},
		{
			name: 'locationCategories',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gCategories' }],
				},
			],
		},
		{
			name: 'itinerariesTitle',
			type: 'string',
		},
		{
			name: 'itinerariesExcerpt',
			type: 'portableTextSimple',
		},
		{
			name: 'itinerariesItems',
			type: 'array',
			of: [
				{
					name: 'itinerary',
					type: 'reference',
					to: [{ type: 'gItineraries' }],
				},
			],
		},
		{
			name: 'contentList',
			type: 'array',
			of: [contentList()],
		},

		{
			name: 'seasonsTitle',
			type: 'string',
		},
		{
			name: 'seasons',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'name',
							type: 'string',
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'description',
							type: 'text',
							rows: 2,
						},
						{
							type: 'reference',
							name: 'guide',
							to: [{ type: 'gGuides' }],
						},
						{
							name: 'months',
							type: 'array',
							of: [
								{
									type: 'object',
									fields: [
										{
											name: 'name',
											type: 'string',
											validation: (Rule) => Rule.required(),
										},
										{
											type: 'reference',
											name: 'guide',
											to: [{ type: 'gGuides' }],
										},
									],
								},
							],
						},
					],
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

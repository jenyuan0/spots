import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import callToAction from '@/sanity/schemas/objects/call-to-action';

export default defineType({
	title: 'Home',
	name: 'pHome',
	type: 'document',
	fields: [
		title({ initialValue: 'Homepage', readOnly: true }),
		slug({ initialValue: { _type: 'slug', current: '/' }, readOnly: true }),
		customImage({ name: 'heroImage' }),
		{
			name: 'heroHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'heroSpots',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
				},
			],
		},
		{
			name: 'introTitle',
			type: 'string',
		},
		{
			name: 'introHeading',
			type: 'portableTextSimple',
		},
		callToAction({ name: 'introCta' }),
		{
			name: 'clockHeading',
			type: 'string',
		},
		{
			name: 'clockParagraph',
			type: 'text',
			rows: 4,
		},
		callToAction({ name: 'clockCta' }),
		{
			name: 'clockText',
			type: 'array',
			of: [
				{
					name: 'item',
					type: 'object',
					fields: [
						{
							name: 'text',
							type: 'string',
						},
						customImage(),
					],
				},
			],
		},
		{
			name: 'masksHeading',
			type: 'string',
		},
		{
			name: 'masksParagraph',
			type: 'text',
			rows: 4,
		},
		{
			name: 'masksImages',
			type: 'array',
			of: [customImage()],
			options: {
				layout: 'grid',
			},
		},
		callToAction({ name: 'masksCta' }),
		{
			name: 'toggleHeading',
			type: 'string',
		},
		{
			name: 'toggleParagraph',
			type: 'text',
			rows: 4,
		},
		callToAction({ name: 'toggleCta' }),

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

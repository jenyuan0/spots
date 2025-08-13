import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import callToAction from '@/sanity/schemas/objects/call-to-action';

export default defineType({
	title: 'Travel Design',
	name: 'pTravelDesign',
	type: 'document',
	fields: [
		title(),
		slug(),
		{
			name: 'heroHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'heroSubheading',
			type: 'string',
		},
		customImage({ name: 'heroImage' }),
		{
			name: 'heroVideo',
			title: 'Hero Video',
			type: 'file',
			options: { accept: 'video/*' },
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
			name: 'caseHeading',
			type: 'string',
		},
		{
			name: 'caseItems',
			type: 'array',
			of: [
				{
					name: 'itinerary',
					type: 'reference',
					to: [{ type: 'gCases' }],
				},
			],
		},
		{
			name: 'whyHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'whyParagraph',
			type: 'text',
			row: 4,
		},
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
			name: 'faqHeading',
			type: 'string',
		},
		{
			name: 'faqSubheading',
			type: 'string',
		},
		{
			name: 'faq',
			type: 'array',
			of: [
				{
					name: 'item',
					type: 'object',
					fields: [
						{
							name: 'title',
							type: 'string',
						},
						{
							title: 'Answer',
							name: 'answer',
							type: 'portableTextSimple',
						},
					],
				},
			],
		},
		{
			name: 'contactHeading',
			type: 'string',
		},
		{
			name: 'contactSubheading',
			type: 'string',
		},
		{
			name: 'contactPlaceholder',
			type: 'string',
		},
		{
			name: 'contactSubject',
			type: 'string',
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

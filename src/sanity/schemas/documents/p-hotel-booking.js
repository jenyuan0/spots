import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import customImage from '@/sanity/schemas/objects/custom-image';
import sharing from '@/sanity/schemas/objects/sharing';
import { getPortableTextPreview } from '@/sanity/lib/helpers';

export default defineType({
	title: 'Hotel Booking',
	name: 'pHotelBooking',
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
		{
			name: 'heroSpots',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
					options: {
						filter:
							'references(*[_type == "gCategories" && slug.current == $slug]._id)',
						filterParams: { slug: 'hotels' },
					},
				},
			],
		},
		{
			name: 'whyListHeading',
			type: 'string',
		},
		{
			name: 'whyList',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							type: 'string',
						},
						{
							name: 'paragraph',
							type: 'text',
						},
						{
							name: 'img',
							type: 'image',
						},
					],
				},
			],
		},
		{
			name: 'examplesHeading',
			type: 'string',
		},
		{
			name: 'examplesList',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							name: 'title',
							type: 'string',
						},
						{
							name: 'excerpt',
							type: 'string',
						},
						{
							name: 'color',
							type: 'reference',
							to: [{ type: 'settingsBrandColors' }],
						},
						{
							name: 'ctaLabel',
							type: 'string',
						},
						{
							name: 'messages',
							type: 'array',
							of: [
								{
									type: 'object',
									fields: [
										{
											name: 'sender',
											type: 'string',
											options: {
												list: ['Client', 'SPOTS'],
												layout: 'radio',
											},
											initialValue: 'Client',
										},
										// TODO: add image gallery ability
										{
											name: 'text',
											type: 'portableTextSimple',
										},
									],
									preview: {
										select: {
											text: 'text',
											subtitle: 'sender',
										},
										prepare({ text, subtitle }) {
											return {
												title: getPortableTextPreview(text),
												subtitle,
											};
										},
									},
								},
							],
						},
					],
				},
			],
		},
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
		customImage({ name: 'contactAuthorImg' }),
		{
			name: 'contactAuthorText',
			type: 'portableTextSimple',
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

import { defineType } from 'sanity';
import { BlockContentIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';

export default defineType({
	title: 'Travel Design',
	name: 'pTravelDesign',
	type: 'document',
	fields: [
		title(),
		slug(),
		{
			name: 'heroHeading',
			type: 'text',
			rows: 2,
		},
		{
			name: 'heroSubheading',
			type: 'text',
			rows: 2,
		},
		{
			name: 'heroGallery',
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
			name: 'heroCtaLabel',
			type: 'string',
		},
		{
			name: 'heroCta',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gCases' }],
					options: {
						filter: '_type == "gCases" && language == "en"',
					},
				},
			],
		},
		{
			name: 'heroCtaPlanLabel',
			type: 'string',
		},
		{
			name: 'introHeading',
			type: 'string',
		},
		{
			name: 'introParagraph',
			type: 'portableTextSimple',
		},
		{
			name: 'caseHeading',
			type: 'string',
		},
		{
			name: 'caseParagraph',
			type: 'text',
			rows: 3,
		},
		{
			name: 'caseItems',
			type: 'array',
			of: [
				{
					name: 'itinerary',
					type: 'reference',
					to: [{ type: 'gCases' }],
					options: {
						filter: '_type == "gCases" && language == "en"',
					},
				},
			],
		},
		{
			name: 'heroSpots',
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
				{
					name: 'sectionTitle',
					type: 'object',
					fields: [
						{
							name: 'title',
							type: 'string',
						},
					],
					preview: {
						select: {
							title: 'title',
						},
						prepare({ title }) {
							return {
								title: title,
								media: BlockContentIcon,
							};
						},
					},
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

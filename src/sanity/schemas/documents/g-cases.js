import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import { getSwatch } from '@/sanity/lib/helpers';
import { PriceInput } from '@/sanity/component/PriceInput';

export default defineType({
	title: 'Cases',
	name: 'gCases',
	type: 'document',
	fields: [
		title(),
		{
			name: 'subtitle',
			type: 'string',
		},
		slug(),
		{
			name: 'color',
			type: 'reference',
			to: [{ type: 'settingsBrandColors' }],
		},
		{
			name: 'thumbs',
			type: 'array',
			of: [customImage({ hasCropOptions: true })],
			options: {
				layout: 'grid',
			},
		},
		customImage({ name: 'heroImage' }),
		{
			name: 'heroSubtitle',
			type: 'string',
		},
		{
			name: 'highlights',
			type: 'portableTextSimple',
		},
		{
			title: 'Budget (USD) / per person',
			name: 'budget',
			type: 'object',
			options: {
				columns: 2,
			},
			fields: [
				{
					title: 'Low',
					name: 'budgetLow',
					type: 'number',
					components: {
						field: PriceInput,
					},
				},
				{
					title: 'High',
					name: 'budgetHigh',
					type: 'number',
					components: {
						field: PriceInput,
					},
				},
			],
		},
		{
			name: 'offers',
			type: 'array',
			of: [
				{
					name: 'offer',
					type: 'string',
				},
			],
		},
		{
			name: 'exclusions',
			type: 'string',
		},
		{
			name: 'accomodations',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
					options: {
						filter: `_type == "gLocations" && language == "en" && references(*[_type == "gCategories" && slug.current == "hotels"]._id)`,
					},
				},
			],
		},
		{
			name: 'content',
			type: 'portableText',
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
			subtitle: 'subtitle',
			color: 'color.colorD',
		},
		prepare({ title = 'Untitled', subtitle, color }) {
			return {
				title,
				subtitle,
				media: color?.hex ? getSwatch(color.hex.toUpperCase()) : null,
			};
		},
	},
});

import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import { getSwatch } from '@/sanity/lib/helpers';

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
		sharing(),
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

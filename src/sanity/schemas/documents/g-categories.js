import { defineType } from 'sanity';
import { TagsIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import { getSwatch } from '@/sanity/lib/helpers';

// TODO
// Potentially setup a separate category list for locations / vs guides, as they will need their own stand alone meta title and description... Or... just two separate "sharing" modules

export default defineType({
	title: 'Categories',
	name: 'gCategories',
	type: 'document',
	icon: TagsIcon,
	fields: [
		title(),
		slug(),
		{
			name: 'color',
			type: 'reference',
			to: [{ type: 'settingsBrandColors' }],
		},
		{
			name: 'locationsHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'locationsParagraph',
			type: 'portableTextSimple',
		},
		{
			name: 'guidesHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'guidesParagraph',
			type: 'portableTextSimple',
		},
		sharing(),
	],
	preview: {
		select: {
			title: 'title',
			color: 'color.colorD',
		},
		prepare({ title, color }) {
			return {
				title: title,
				media: color?.hex ? getSwatch(color.hex.toUpperCase()) : TagsIcon,
			};
		},
	},
});

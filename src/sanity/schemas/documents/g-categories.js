import { defineType } from 'sanity';
import { TagsIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';

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
		sharing(),
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				title: title,
				medi: TagsIcon,
			};
		},
	},
});

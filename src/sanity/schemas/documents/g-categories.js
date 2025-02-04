import { defineType } from 'sanity';
import { TagsIcon } from '@sanity/icons';

export default defineType({
	title: 'Categories',
	name: 'gCategories',
	type: 'document',
	icon: TagsIcon,
	fields: [
		{ name: 'title', type: 'string' },
		{
			title: 'URL Slug',
			name: 'slug',
			type: 'slug',
			description: '(required)',
			options: {
				source: 'title',
				maxLength: 200,
				slugify: (input) =>
					input
						.toLowerCase()
						.replace(/[\s\W-]+/g, '-')
						.replace(/^-+|-+$/g, '')
						.slice(0, 200),
			},
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'color',
			type: 'reference',
			to: [{ type: 'settingsBrandColors' }],
		},
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare: ({ title }) => ({
			title,
		}),
	},
});

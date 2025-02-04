import { defineType } from 'sanity';
import { SlugField } from '@/sanity/component/SlugField';

export default defineType({
	title: 'Page',
	name: 'gLocations',
	type: 'document',
	fields: [
		{
			title: 'Title',
			name: 'title',
			type: 'string',
			validation: (Rule) => [Rule.required()],
		},
		{
			title: 'Page Slug (URL)',
			name: 'slug',
			type: 'slug',
			components: {
				field: SlugField,
			},
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
			validation: (Rule) => [Rule.required()],
		},
		{
			title: 'Page Modules',
			name: 'pageModules',
			type: 'array',
			of: [{ type: 'freeform' }, { type: 'carousel' }, { type: 'marquee' }],
		},
		{
			title: 'SEO + Share Settings',
			name: 'sharing',
			type: 'sharing',
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

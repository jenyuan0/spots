import { defineType } from 'sanity';
import { SlugField } from '@/sanity/component/SlugField';

export default defineType({
	title: 'Page',
	name: 'pHome',
	type: 'document',
	fields: [
		{
			title: 'Page Slug (URL)',
			name: 'slug',
			type: 'slug',
			components: {
				field: SlugField,
			},
			validation: (Rule) => [Rule.required()],
			initialValue: { _type: 'slug', current: 'homepage' },
			readOnly: true,
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
		},
		prepare({ title = 'Untitled' }) {
			return {
				title,
			};
		},
	},
});

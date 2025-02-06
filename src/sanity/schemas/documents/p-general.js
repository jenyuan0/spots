import { defineType } from 'sanity';
import title from '@/sanity/lib/title';
import slug from '@/sanity/lib/slug';
import sharing from '@/sanity/lib/sharing';
import customImage from '@/sanity/lib/custom-image';

export default defineType({
	title: 'Page',
	name: 'pGeneral',
	type: 'document',
	fields: [
		title(),
		slug(),
		{
			title: 'Page Modules',
			name: 'pageModules',
			type: 'array',
			of: [{ type: 'freeform' }, { type: 'carousel' }, { type: 'marquee' }],
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

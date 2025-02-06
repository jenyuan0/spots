import { defineType } from 'sanity';
import title from '@/sanity/lib/title';
import slug from '@/sanity/lib/slug';
import sharing from '@/sanity/lib/sharing';

export default defineType({
	title: 'Home',
	name: 'pHome',
	type: 'document',
	fields: [
		title({ initialValue: 'Homepage', readOnly: true }),
		slug({ initialValue: { _type: 'slug', current: '/' }, readOnly: true }),
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

import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import guideList from '@/sanity/schemas/objects/guide-list';
// import locationList from '@/sanity/schemas/objects/location-list';

export default defineType({
	title: 'Locations',
	name: 'pParis',
	type: 'document',
	fields: [
		title({ readOnly: true }),
		slug({ readOnly: true }),
		{
			name: 'heading',
			type: 'portableTextSimple',
		},
		{
			name: 'guideList',
			type: 'array',
			of: [guideList()],
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

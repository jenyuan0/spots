import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import contentList from '@/sanity/schemas/objects/content-list';
import customImage from '@/sanity/schemas/objects/custom-image';
// import locationList from '@/sanity/schemas/objects/location-list';

export default defineType({
	title: 'Locations',
	name: 'pParis',
	type: 'document',
	fields: [
		title({ readOnly: true }),
		slug({ readOnly: true }),
		{
			name: 'heroHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'heroImages',
			type: 'array',
			of: [customImage({ hasCropOptions: true })],
			options: {
				layout: 'grid',
			},
		},
		{
			name: 'locationCategories',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gCategories' }],
				},
			],
		},
		{
			name: 'contentList',
			type: 'array',
			of: [contentList()],
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

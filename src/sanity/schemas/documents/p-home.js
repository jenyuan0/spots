import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import callToAction from '@/sanity/schemas/objects/call-to-action';

export default defineType({
	title: 'Home',
	name: 'pHome',
	type: 'document',
	fields: [
		title({ initialValue: 'Homepage', readOnly: true }),
		slug({ initialValue: { _type: 'slug', current: '/' }, readOnly: true }),
		customImage({ name: 'heroImage' }),
		{
			name: 'heroHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'heroSpots',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
				},
			],
		},
		{
			name: 'introTitle',
			type: 'string',
		},
		{
			name: 'introHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'highlights',
			type: 'array',
			of: [customImage({ hasCropOptions: true })],
			options: {
				layout: 'grid',
			},
		},
		callToAction({ name: 'introCta' }),
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

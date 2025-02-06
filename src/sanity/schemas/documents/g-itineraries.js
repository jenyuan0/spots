import { defineType } from 'sanity';
import title from '@/sanity/lib/title';
import slug from '@/sanity/lib/slug';
import sharing from '@/sanity/lib/sharing';
import customImage from '@/sanity/lib/custom-image';

export default defineType({
	title: 'Itineraries',
	name: 'gItineraries',
	type: 'document',
	fields: [
		title(),
		slug(),
		{
			name: 'images',
			type: 'array',
			of: [customImage({ hasCropOptions: true })],
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

import { defineType } from 'sanity';
import { BlockContentIcon } from '@sanity/icons';
import title from '@/sanity/lib/title';
import customImage from '@/sanity/lib/custom-image';

export default defineType({
	title: 'Ads',
	name: 'gAds',
	type: 'document',
	icon: BlockContentIcon,
	fields: [
		title(),
		{
			name: 'content',
			type: 'portableTextSimple',
		},
		customImage({ hasCropOptions: true }),
		{ name: 'newsletterID', type: 'string' },
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title }) {
			return {
				title: title,
				media: BlockContentIcon,
			};
		},
	},
});

import { defineType } from 'sanity';
import { BlockContentIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';
import customImage from '@/sanity/schemas/objects/custom-image';
import callToAction from '@/sanity/schemas/objects/call-to-action';

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
		callToAction(),
		{
			// should match 'languageField' plugin configuration setting, if customized
			name: 'language',
			type: 'string',
			// readOnly: true,
			// hidden: true,
		},
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

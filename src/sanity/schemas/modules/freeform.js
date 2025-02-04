import { EditIcon } from '@sanity/icons';
import { defineType } from 'sanity';

import { getPortableTextPreview } from '@/sanity/lib/helpers';

export default defineType({
	name: 'freeform',
	type: 'object',
	icon: EditIcon,
	fields: [
		{
			name: 'content',
			type: 'portableText',
		},
		{
			name: 'sectionAppearance',
			type: 'sectionAppearance',
		},
	],
	preview: {
		select: {
			content: 'content',
		},
		prepare({ content }) {
			return {
				title: getPortableTextPreview(content),
				subtitle: 'Freeform',
				media: EditIcon,
			};
		},
	},
});

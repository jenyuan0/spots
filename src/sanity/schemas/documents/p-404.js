import { defineType } from 'sanity';
import { UnknownIcon } from '@sanity/icons';
import callToAction from '@/sanity/schemas/objects/call-to-action';

export default defineType({
	title: 'Page 404',
	name: 'p404',
	type: 'document',
	icon: UnknownIcon,
	fields: [
		{
			title: 'Heading',
			name: 'heading',
			type: 'string',
		},
		{
			title: 'Paragraph',
			name: 'paragraph',
			type: 'portableTextSimple',
		},
		callToAction(),
	],
});

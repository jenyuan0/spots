import { defineType, defineField } from 'sanity';
import { UnknownIcon } from '@sanity/icons';
import callToAction from '@/sanity/schemas/objects/call-to-action';

export default defineType({
	title: 'Page 404',
	name: 'p404',
	type: 'document',
	icon: UnknownIcon,
	fields: [
		defineField({
			title: 'Heading',
			name: 'heading',
			type: 'string',
		}),
		defineField({
			title: 'Paragraph',
			name: 'paragraph',
			type: 'portableTextSimple',
		}),
		callToAction(),
		defineField({
			// should match 'languageField' plugin configuration setting
			name: 'language',
			type: 'string',
			// readOnly: true,
			// hidden: true,
		}),
	],
});

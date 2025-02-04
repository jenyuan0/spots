import { defineType, defineField } from 'sanity';
import { LinkIcon } from '@sanity/icons';
import { LinkInput } from '@/sanity/component/LinkInput';

export default defineType({
	name: 'link',
	icon: LinkIcon,
	type: 'object',
	fields: [
		defineField({
			type: 'string',
			title: 'URL',
			name: 'route',
			components: {
				input: LinkInput,
			},
		}),
		defineField({
			title: 'Open in new tab',
			name: 'isNewTab',
			type: 'boolean',
			initialValue: false,
		}),
	],
});

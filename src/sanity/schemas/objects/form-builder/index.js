import { defineType, defineField } from 'sanity';
import { ThListIcon } from '@sanity/icons';

export default defineType({
	name: 'formBuilder',
	title: 'Form Builder',
	icon: ThListIcon,
	type: 'object',
	fields: [
		defineField({
			name: 'formFields',
			title: 'Form Fields',
			type: 'array',
			of: [{ type: 'formFields' }],
		}),
	],
	preview: {
		prepare() {
			return {
				title: `Custom form setup`,
				subtitle: `Form Builder`,
				media: FaAlignLeft,
			};
		},
	},
});

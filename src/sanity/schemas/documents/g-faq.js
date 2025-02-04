import { defineType } from 'sanity';

export default defineType({
	title: 'Page',
	name: 'gFAQ',
	type: 'document',
	fields: [
		{
			title: 'Title',
			name: 'title',
			type: 'string',
			validation: (Rule) => [Rule.required()],
		},
		{
			name: 'content',
			type: 'portableTextSimple',
		},
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title = 'Untitled' }) {
			return {
				title,
			};
		},
	},
});

import { defineType } from 'sanity';

export default defineType({
	title: 'Newsletter',
	name: 'gNewsletter',
	type: 'document',
	fields: [
		{
			name: 'heading',
			type: 'string',
		},
		{
			name: 'paragraph',
			type: 'text',
			rows: 2,
		},
		{
			name: 'successMessage',
			type: 'portableTextSimple',
		},
		{
			name: 'errorMessage',
			type: 'portableTextSimple',
		},
		{
			// should match 'languageField' plugin configuration setting, if customized
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		},
	],
	preview: {
		prepare() {
			return {
				title: 'Newsletter',
			};
		},
	},
});

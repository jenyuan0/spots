import { defineType } from 'sanity';

export default defineType({
	title: 'Header Settings',
	name: 'gHeader',
	type: 'document',
	fields: [
		{
			title: 'Menus',
			name: 'menu',
			type: 'array',
			of: [{ type: 'settingsMenu' }],
		},
	],
	preview: {
		prepare() {
			return {
				title: 'Header Settings',
			};
		},
	},
});

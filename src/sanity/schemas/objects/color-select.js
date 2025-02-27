import { defineType } from 'sanity';

export default defineType({
	name: 'colorSelect',
	type: 'string',
	options: {
		list: ['green', 'blue', 'red', 'orange', 'purple'],
		layout: 'radio',
		direction: 'horizontal',
	},
	initialValue: 'green',
});

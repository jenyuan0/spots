import { defineType } from 'sanity';

export default defineType({
	name: 'priceSelect',
	type: 'string',
	options: {
		list: ['$', '$$', '$$$', '$$$$'],
		layout: 'radio',
		direction: 'horizontal',
	},
});

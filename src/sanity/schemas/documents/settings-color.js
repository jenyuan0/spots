import { ControlsIcon } from '@sanity/icons';
import { defineType } from 'sanity';
import { getSwatch } from '@/sanity/lib/helpers';

export default defineType({
	title: 'Color',
	name: 'settingsBrandColors',
	type: 'document',
	icon: ControlsIcon,
	fields: [
		{
			title: 'Title',
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'colorD',
			type: 'color',
			options: {
				disableAlpha: true,
			},
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'colorL',
			type: 'color',
			options: {
				disableAlpha: true,
			},
		},
	],
	preview: {
		select: {
			title: 'title',
			color: 'colorD',
		},
		prepare({ title, color }) {
			return {
				title: title,
				subtitle: color?.hex ? color.hex.toUpperCase() : '',
				media: color?.hex ? getSwatch(color.hex.toUpperCase()) : null,
			};
		},
	},
});

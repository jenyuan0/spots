import { defineType } from 'sanity';
import { PinIcon } from '@sanity/icons';

export default defineType({
	name: 'locationList',
	type: 'object',
	icon: PinIcon,
	fields: [
		{
			name: 'locations',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
				},
			],
		},
		{
			title: 'Fallback (Rain)',
			name: 'fallbackRains',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
				},
			],
		},
		{
			title: 'Fallback (Long Wait)',
			name: 'fallbackLongWait',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gLocations' }],
				},
			],
		},
	],
	preview: {
		select: {
			location0: 'locations.0.title',
			location1: 'locations.1.title',
			location2: 'locations.2.title',
			location3: 'locations.3.title',
			location4: 'locations.4.title',
			images: 'locations.0.images',
		},
		prepare({ location0, location1, location2, location3, location4, images }) {
			const locationTitles = [
				location0,
				location1,
				location2,
				location3,
				location4,
			].filter(Boolean);
			const title =
				locationTitles.length > 0
					? `${locationTitles.join(', ')}`
					: 'No locations';

			return {
				title: title,
				media: images?.[0] || PinIcon,
			};
		},
	},
});

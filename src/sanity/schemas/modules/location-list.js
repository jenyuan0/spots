import { defineType } from 'sanity';
import { PinIcon } from '@sanity/icons';

export default defineType({
	name: 'locationList',
	type: 'object',
	icon: PinIcon,
	fields: [
		{
			name: 'locationList',
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
			location0: 'locationList.0.title',
			location1: 'locationList.1.title',
			location2: 'locationList.2.title',
			location3: 'locationList.3.title',
			location4: 'locationList.4.title',
			images: 'locationList.0.images',
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
				media: images[0] || PinIcon,
			};
		},
	},
});

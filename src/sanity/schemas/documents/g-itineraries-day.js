import { defineType } from 'sanity';
import title from '@/sanity/lib/title';
import sharing from '@/sanity/lib/sharing';
import customImage from '@/sanity/lib/custom-image';
import { getActivitiesPreview } from '@/sanity/lib/helpers';
import locationList from '@/sanity/lib/location-list';

export default defineType({
	title: 'Itineraries (days)',
	name: 'gItinerariesDay',
	type: 'document',
	fields: [
		title(),
		{
			title: 'Content (Highlight)',
			name: 'content',
			type: 'portableTextSimple',
		},
		{
			name: 'images',
			type: 'array',
			of: [customImage({ hasCropOptions: true })],
			options: {
				layout: 'grid',
			},
		},
		{
			name: 'activities',
			type: 'array',
			of: [
				locationList({
					showStartTime: true,
					showFallbackRains: true,
					showFallbackWait: true,
				}),
				{ type: 'freeform' },
			],
		},
		{
			name: 'relatedGuides',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: [{ type: 'gGuides' }],
				},
			],
		},
		sharing({ disableIndex: true }),
	],
	preview: {
		select: {
			title: 'title',
			activities: 'activities',
			images: 'images',
		},
		prepare({ title, activities, images }) {
			return {
				title: title || 'Untitled',
				subtitle: getActivitiesPreview(activities),
				media: images?.[0] || false,
			};
		},
	},
});

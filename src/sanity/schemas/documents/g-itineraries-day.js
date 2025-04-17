import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import sharing from '@/sanity/schemas/objects/sharing';
import customImage from '@/sanity/schemas/objects/custom-image';
import { getActivitiesPreview } from '@/sanity/lib/helpers';
import locationList from '@/sanity/schemas/objects/location-list';

export default defineType({
	title: 'Itineraries (days)',
	name: 'gItinerariesDay',
	type: 'document',
	fields: [
		title({ title: 'Title (for admins only)' }),
		{
			title: 'Content (Highlight)',
			name: 'content',
			type: 'portableTextSimple',
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
		},
		prepare({ title, activities }) {
			return {
				title: title || 'Untitled',
				subtitle: getActivitiesPreview(activities),
			};
		},
	},
});

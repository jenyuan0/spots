import { defineType } from 'sanity';
import title from '@/sanity/lib/title';
import sharing from '@/sanity/lib/sharing';
import customImage from '@/sanity/lib/custom-image';
import { getActivitiesPreview } from '@/sanity/lib/helpers';

export default defineType({
	title: 'Itineraries (days)',
	name: 'gItinerariesDay',
	type: 'document',
	fields: [
		title(),
		{
			title: 'Title (Admin only)',
			name: 'titleAdmin',
			type: 'string',
		},
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
			of: [{ type: 'locationList' }, { type: 'freeform' }],
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
			titleAdmin: 'titleAdmin',
			activities: 'activities',
			images: 'images',
		},
		prepare({ title, titleAdmin, activities, images }) {
			return {
				title: titleAdmin || title || 'Untitled',
				subtitle: getActivitiesPreview(activities),
				media: images?.[0] || PinIcon,
			};
		},
	},
});

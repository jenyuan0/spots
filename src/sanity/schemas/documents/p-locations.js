import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import guideList from '@/sanity/schemas/objects/guide-list';
// import locationList from '@/sanity/schemas/objects/location-list';

export default defineType({
	title: 'Locations',
	name: 'pLocations',
	type: 'document',
	fields: [
		title({ readOnly: true }),
		slug({ readOnly: true }),
		{
			name: 'heading',
			type: 'portableTextSimple',
		},
		{
			name: 'itemsPerPage',
			type: 'number',
			validation: (rule) => rule.min(1).required(),
			initialValue: 4,
		},
		{
			name: 'paginationMethod',
			type: 'string',
			options: {
				list: [
					{ title: 'Page numbers', value: 'page-numbers' },
					{ title: 'Load more', value: 'load-more' },
					{
						title: 'Infinite scroll without load more button',
						value: 'infinite-scroll',
					},
				],
				layout: 'radio',
			},
			initialValue: 'page-numbers',
		},
		{
			name: 'loadMoreButtonLabel',
			title: 'Load more label',
			type: 'string',
			hidden: ({ parent }) => {
				const { paginationMethod } = parent;
				if (paginationMethod !== 'load-more') {
					return true;
				}
			},
		},
		{
			name: 'infiniteScrollCompleteLabel',
			title: 'No more items to load message',
			type: 'string',
			hidden: ({ parent }) => {
				const { paginationMethod } = parent;
				if (paginationMethod === 'page-numbers') {
					return true;
				}
			},
		},
		sharing(),
	],
	preview: {
		select: {
			title: 'title',
			slug: 'slug',
		},
		prepare({ title = 'Untitled', slug = {} }) {
			return {
				title,
				subtitle: slug.current ? `/${slug.current}` : 'Missing page slug',
			};
		},
	},
});

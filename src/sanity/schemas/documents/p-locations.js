import { defineType } from 'sanity';
import title from '@/sanity/lib/title';
import slug from '@/sanity/lib/slug';
import sharing from '@/sanity/lib/sharing';

export default defineType({
	title: 'Locations',
	name: 'pLocations',
	type: 'document',
	fields: [
		title(),
		slug(),
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

import { defineType } from 'sanity';
import { SlugField } from '@/sanity/component/SlugField';
import { BookIcon } from '@sanity/icons';

export default defineType({
	title: 'News',
	name: 'pGuides',
	type: 'document',
	icon: BookIcon,
	groups: [
		{ title: 'Content', name: 'content' },
		{ title: 'Settings', name: 'settings' },
	],
	fields: [
		{
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'content',
		},
		{
			title: 'Page Slug (URL)',
			name: 'slug',
			type: 'slug',
			components: {
				field: SlugField,
			},
			validation: (Rule) => Rule.required(),
			initialValue: { _type: 'slug', current: 'guides' },
			readOnly: true,
			group: 'settings',
		},
		{
			name: 'itemsPerPage',
			type: 'number',
			validation: (rule) => rule.min(4).required(),
			initialValue: 4,
			group: 'content',
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
			group: 'content',
		},
		{
			name: 'loadMoreButtonLabel',
			title: 'Load more label',
			type: 'string',
			group: 'content',
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
			group: 'content',
			hidden: ({ parent }) => {
				const { paginationMethod } = parent;
				if (paginationMethod === 'page-numbers') {
					return true;
				}
			},
		},
		{
			title: 'SEO + Share Settings',
			name: 'sharing',
			type: 'sharing',
			group: 'settings',
		},
	],
	preview: {
		select: {
			title: 'title',
		},
		prepare({ title = 'Untitled' }) {
			return {
				title: title,
			};
		},
	},
});

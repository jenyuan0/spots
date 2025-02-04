import { defineType } from 'sanity';
import { BookIcon } from '@sanity/icons';
import { SlugField } from '@/sanity/component/SlugField';

export default defineType({
	title: 'Blog',
	name: 'pBlog',
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
			title: 'URL Slug',
			name: 'slug',
			type: 'slug',
			description: '(required)',
			components: {
				field: SlugField,
			},
			options: {
				source: 'title',
				maxLength: 200,
				slugify: (input) =>
					input
						.toLowerCase()
						.replace(/[\s\W-]+/g, '-')
						.replace(/^-+|-+$/g, '')
						.slice(0, 200),
			},
			group: 'settings',
			validation: (Rule) => Rule.required(),
		},
		{
			title: 'Author',
			name: 'author',
			type: 'reference',
			to: [{ type: 'pBlogAuthor' }],
		},
		{
			title: 'Categories',
			name: 'categories',
			type: 'array',
			of: [
				{
					type: 'reference',
					to: { type: 'pBlogCategory' },
				},
			],
			group: 'content',
			validation: (Rule) => Rule.unique(),
		},
		// {
		// 	title: 'Publish date',
		// 	name: 'publishDate',
		// 	type: 'date',
		// 	options: {
		// 		dateFormat: 'MM/DD/YY',
		// 		calendarTodayLabel: 'Today',
		// 	},
		// 	group: 'content',
		// 	validation: (Rule) => Rule.required(),
		// },
		{
			name: 'excerpt',
			title: 'Excerpt',
			type: 'text',
			group: 'content',
			validation: (Rule) => Rule.required(),
		},
		{
			title: 'Content',
			name: 'content',
			type: 'portableText',
			group: 'content',
		},
		{
			title: 'Related News',
			name: 'relatedBlogs',
			type: 'array',
			description:
				'If left empty, will be pulled 2 news from the same category',
			of: [
				{
					title: 'News',
					name: 'news',
					type: 'reference',
					to: [{ type: 'pBlog' }],
				},
			],
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
			slug: 'slug',
			categories: 'categories.0.title',
		},
		prepare({ title = 'Untitled', slug = {}, categories }) {
			const path = `/blog/${slug.current}`;
			const categoryTitle = categories ?? '';
			const subtitle = `[${
				categoryTitle ? categoryTitle : '(missing category)'
			}] - ${slug.current ? path : '(missing slug)'}`;

			return {
				title: title,
				subtitle: subtitle,
				media: BookIcon,
			};
		},
	},
});

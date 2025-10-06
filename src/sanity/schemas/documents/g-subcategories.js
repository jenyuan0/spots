import { defineType } from 'sanity';
import { TagsIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';

export default defineType({
	title: 'Subcategories',
	name: 'gSubcategories',
	type: 'document',
	icon: TagsIcon,
	fields: [
		title(),
		slug(),
		{
			name: 'parentCategory',
			type: 'reference',
			to: [{ type: 'gCategories' }],
			validation: (Rule) => Rule.required(),
		},
		{
			name: 'locationsHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'locationsParagraph',
			type: 'portableTextSimple',
		},
		{
			name: 'guidesHeading',
			type: 'portableTextSimple',
		},
		{
			name: 'guidesParagraph',
			type: 'portableTextSimple',
		},
		sharing(),
		{
			// should match 'languageField' plugin configuration setting, if customized
			name: 'language',
			type: 'string',
			// readOnly: true,
			// hidden: true,
		},
	],
	preview: {
		select: {
			title: 'title',
			category: 'parentCategory.title',
		},
		prepare({ title, category }) {
			return {
				title: title,
				subtitle: category ? `Parent: ${category}` : '',
				media: TagsIcon,
			};
		},
	},
});

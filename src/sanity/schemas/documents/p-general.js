import { defineType } from 'sanity';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import freeform from '@/sanity/schemas/objects/freeform';
import carousel from '@/sanity/schemas/objects/carousel';
import customImage from '@/sanity/schemas/objects/custom-image';

export default defineType({
	title: 'Page',
	name: 'pGeneral',
	type: 'document',
	fields: [
		title(),
		slug(),
		{
			title: 'Page Modules',
			name: 'pageModules',
			type: 'array',
			of: [freeform(), carousel(), customImage()],
		},
		sharing(),
		{
			// should match 'languageField' plugin configuration setting, if customized
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		},
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

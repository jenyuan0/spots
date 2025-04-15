import { defineType } from 'sanity';
import { BookIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';

export default defineType({
	title: 'Contact Page',
	name: 'pContact',
	type: 'document',
	icon: BookIcon,
	fields: [title(), slug(), sharing()],
});

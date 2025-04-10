import { defineType } from 'sanity';
import { BookIcon } from '@sanity/icons';
import title from '@/sanity/schemas/objects/title';
import slug from '@/sanity/schemas/objects/slug';
import sharing from '@/sanity/schemas/objects/sharing';
import formBuilder from '@/sanity/schemas/objects/form-builder';

export default defineType({
	title: 'Contact Page',
	name: 'pContact',
	type: 'document',
	icon: BookIcon,
	fields: [
		title(),
		slug(),
		{
			title: 'Contact Form',
			name: 'contactForm',
			type: 'object',
			fields: [
				{
					name: 'formTitle',
					type: 'string',
				},
				formBuilder(),
				{
					name: 'successMessage',
					type: 'text',
					rows: 2,
				},
				{
					name: 'errorMessage',
					type: 'text',
					rows: 2,
				},
				{
					name: 'formFailureNotificationEmail',
					description:
						'A failure notification is sent when the form fails to submit. The notification includes all information that users have submitted. Use commas to separate emails.',
					type: 'string',
				},
			],
		},
		sharing(),
	],
});

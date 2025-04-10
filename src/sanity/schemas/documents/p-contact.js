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
					title: 'Form Title',
					name: 'formTitle',
					type: 'string',
				},
				formBuilder(),
				{
					title: 'Success Message',
					name: 'successMessage',
					type: 'text',
					rows: 2,
				},
				{
					title: 'Error Message',
					name: 'errorMessage',
					type: 'text',
					rows: 2,
				},
				{
					title: 'Form Failure Notification Email',
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

import { defineType } from 'sanity';
import formBuilder from '@/sanity/schemas/objects/form-builder';
import customImage from '@/sanity/schemas/objects/custom-image';

export default defineType({
	title: 'Plan Form',
	name: 'gPlanForm',
	type: 'document',
	fields: [
		customImage(),
		customImage({ name: 'mobileImage' }),
		{
			name: 'formTitle',
			type: 'string',
		},
		{
			name: 'formHeading',
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
			name: 'sendToEmail',
			type: 'string',
		},
		{
			name: 'emailSubject',
			type: 'string',
		},
		{
			name: 'formFailureNotificationEmail',
			description:
				'A failure notification is sent when the form fails to submit. The notification includes all information that users have submitted. Use commas to separate emails.',
			type: 'string',
		},
		{
			name: 'whatsapp',
			type: 'string',
		},
		{
			name: 'line',
			type: 'string',
		},
		{
			name: 'email',
			type: 'string',
		},
		{
			name: 'faq',
			type: 'array',
			of: [
				{
					name: 'item',
					type: 'object',
					fields: [
						{
							name: 'title',
							type: 'string',
						},
						{
							title: 'Answer',
							name: 'answer',
							type: 'portableTextSimple',
						},
					],
				},
			],
		},
		{
			// should match 'languageField' plugin configuration setting, if customized
			name: 'language',
			type: 'string',
			readOnly: true,
			hidden: true,
		},
	],
	preview: {
		prepare() {
			return {
				title: 'Plan Form',
			};
		},
	},
});

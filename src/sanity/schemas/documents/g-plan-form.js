import { defineType } from 'sanity';
import formBuilder from '@/sanity/schemas/objects/form-builder';

export default defineType({
	title: 'Plan Form',
	name: 'gPlanForm',
	type: 'document',
	fields: [
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
			name: 'formFailureNotificationEmail',
			description:
				'A failure notification is sent when the form fails to submit. The notification includes all information that users have submitted. Use commas to separate emails.',
			type: 'string',
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

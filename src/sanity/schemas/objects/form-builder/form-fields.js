import { defineType, defineField } from 'sanity';

export default defineType({
	name: 'formFields',
	title: 'Form Fields',
	type: 'object',
	fields: [
		defineField({
			name: 'required',
			title: 'Required',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'fieldLabel',
			title: 'Field Label',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'inputType',
			title: 'Input Type',
			type: 'string',
			initialValue: 'text',
			options: {
				layout: 'dropdown',
				list: [
					{ value: 'text', title: 'Text' },
					{ value: 'email', title: 'Email' },
					{ value: 'tel', title: 'Phone number' },
					{ value: 'textarea', title: 'Text area' },
					{ value: 'select', title: 'Dropdown selection' },
					{ value: 'checkbox', title: 'Checkbox' },
					{ value: 'file', title: 'File upload' },
				],
			},
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'selectOptions',
			title: 'Options',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{
							title: 'option',
							name: 'option',
							type: 'string',
						},
					],
				},
			],
			hidden: ({ parent }) => {
				return parent.inputType !== 'select';
			},
		}),
		defineField({
			name: 'placeholder',
			title: 'Placeholder',
			type: 'string',
			hidden: ({ parent }) => {
				return (
					parent.inputType === 'checkbox' ||
					parent.inputType === 'select' ||
					parent.inputType === 'file'
				);
			},
		}),
	],
	preview: {
		select: {
			required: 'required',
			fieldLabel: 'fieldLabel',
			inputType: 'inputType',
		},
		prepare({ required, fieldLabel, inputType }) {
			return {
				title: fieldLabel,
				subtitle: `Type: ${inputType} | Required: ${required ? 'yes' : 'no'}`,
			};
		},
	},
});

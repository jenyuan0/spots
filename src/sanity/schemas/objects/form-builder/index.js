import { ThListIcon } from '@sanity/icons';

export default function formBuilder({ name = 'formFields' } = {}) {
	return {
		name: name,
		icon: ThListIcon,
		type: 'array',
		of: [{ type: 'formFields' }],
		preview: {
			prepare() {
				return {
					title: `Custom form setup`,
					subtitle: `Form Builder`,
					media: ThListIcon,
				};
			},
		},
	};
}

import { SlugField } from '@/sanity/component/SlugField';

export default function slug({ initialValue, readOnly, group } = {}) {
	return {
		title: 'Page Slug (URL)',
		name: 'slug',
		type: 'slug',
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
		validation: (Rule) => [Rule.required()],
		initialValue: initialValue,
		readOnly: readOnly,
		group: group,
	};
}

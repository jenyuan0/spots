export default function title({ title, initialValue, readOnly, group } = {}) {
	return {
		title: title || '',
		name: 'title',
		type: 'string',
		validation: (Rule) => [Rule.required()],
		initialValue: initialValue,
		readOnly: readOnly,
		group: group,
	};
}

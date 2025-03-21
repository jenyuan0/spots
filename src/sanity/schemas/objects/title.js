export default function title({
	title,
	initialValue,
	readOnly,
	group,
	required = true,
} = {}) {
	return {
		title: title || '',
		name: 'title',
		type: 'string',
		validation: (Rule) => (required ? [Rule.required()] : []),
		initialValue: initialValue,
		readOnly: readOnly,
		group: group,
	};
}

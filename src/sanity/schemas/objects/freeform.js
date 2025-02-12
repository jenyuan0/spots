import { EditIcon } from '@sanity/icons';
import { getPortableTextPreview } from '@/sanity/lib/helpers';

export default function freeform() {
	return {
		name: 'freeform',
		type: 'object',
		icon: EditIcon,
		fields: [
			{
				name: 'content',
				type: 'portableText',
			},
		],
		preview: {
			select: {
				content: 'content',
			},
			prepare({ content }) {
				const firstImage = content.find((item) => item._type === 'image');

				return {
					title: getPortableTextPreview(content),
					subtitle: 'Freeform',
					media: firstImage || EditIcon,
				};
			},
		},
	};
}

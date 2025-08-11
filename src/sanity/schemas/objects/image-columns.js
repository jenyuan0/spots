import { InlineElementIcon } from '@sanity/icons';
import customImage from '@/sanity/schemas/objects/custom-image';
import customIframe from '@/sanity/schemas/objects/custom-iframe';

export default function imageColumns() {
	return {
		name: 'imageColumns',
		type: 'object',
		icon: InlineElementIcon,
		fields: [
			{
				title: 'Items',
				name: 'items',
				type: 'array',
				of: [
					customImage({ hasCaptionOptions: true, hasCropOptions: true }),
					customIframe(),
				],
				validation: (Rule) => Rule.min(1).required(),
			},
		],
		preview: {
			select: {
				items: 'items',
			},
			prepare({ items }) {
				const itemsWithImage = items.filter((el) => el._type == 'image');
				const media = (itemsWithImage && itemsWithImage[0].asset) || false;

				return {
					title: 'Image Columns',
					subtitle: `${items.length} item${items.length > 1 ? 's' : ''}`,
					media: media,
				};
			},
		},
	};
}

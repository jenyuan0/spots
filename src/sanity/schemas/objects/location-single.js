import { PinIcon } from '@sanity/icons';
import { getPortableTextPreview } from '@/sanity/lib/helpers';

export default function locationSingle({} = {}) {
	return {
		name: 'locationSingle',
		type: 'object',
		icon: PinIcon,
		fields: [
			{
				name: 'location',
				type: 'reference',
				to: [{ type: 'gLocations' }],
			},
			{
				name: 'additionalContent',
				type: 'portableText',
			},
		],
		preview: {
			select: {
				title: 'location.title',
				images: 'location.images',
				additionalContent: 'additionalContent',
			},
			prepare({ title, images, additionalContent }) {
				return {
					title: `[Location] ${title}`,
					subtitle: additionalContent
						? `[Additional Content] ${getPortableTextPreview(additionalContent)}`
						: '[no additional content]',
					media: images ? images[0] : PinIcon, // Check for image.asset
				};
			},
		},
	};
}

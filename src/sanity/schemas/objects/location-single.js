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
				name: 'contentReplace',
				type: 'portableText',
			},
		],
		preview: {
			select: {
				title: 'location.title',
				images: 'location.images',
				contentReplace: 'contentReplace',
			},
			prepare({ title, images, contentReplace }) {
				return {
					title: `[Location] ${title}`,
					subtitle:
						contentReplace && `${getPortableTextPreview(contentReplace)}`,
					media: images ? images[0] : PinIcon, // Check for image.asset
				};
			},
		},
	};
}

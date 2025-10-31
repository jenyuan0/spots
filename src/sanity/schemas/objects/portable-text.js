import { defineType } from 'sanity';
import callToAction from '@/sanity/schemas/objects/call-to-action';
import customIframe from '@/sanity/schemas/objects/custom-iframe';
import customImage from '@/sanity/schemas/objects/custom-image';
import locationList from '@/sanity/schemas/objects/location-list';
import locationSingle from '@/sanity/schemas/objects/location-single';
import imageColumns from '@/sanity/schemas/objects/image-columns';
import carousel from '@/sanity/schemas/objects/carousel';

export default defineType({
	name: 'portableText',
	type: 'array',
	of: [
		{
			title: 'Block',
			type: 'block',
			styles: [
				{ title: 'Paragraph', value: 'normal' },
				{
					title: 'Large Paragraph',
					value: 'large-paragraph',
					component: ({ children }) => (
						<p
							style={{
								fontSize: '24',
								lineHeight: '1.5',
								fontWeight: 700,
								textTransform: 'unset',
							}}
						>
							{children}
						</p>
					),
				},
				{
					title: 'Heading 1',
					value: 'h1',
				},
				{
					title: 'Heading 2',
					value: 'h2',
				},
				{
					title: 'Heading 3',
					value: 'h3',
				},
				{
					title: 'Heading 4',
					value: 'h4',
				},
				{
					title: 'Heading 5',
					value: 'h5',
				},
				{
					title: 'Heading 6',
					value: 'h6',
				},
				{ title: 'Quote', value: 'blockquote' },
			],
			lists: [
				{ title: 'Bullet', value: 'bullet' },
				{ title: 'Numbered', value: 'number' },
			],
			marks: {
				decorators: [
					{ title: 'Bold', value: 'strong' },
					{ title: 'Italic', value: 'em' },
					{ title: 'Underline', value: 'underline' },
					{ title: 'Strike', value: 'strike-through' },
				],
				annotations: [
					{
						name: 'link',
						type: 'link',
					},
					callToAction({ title: 'Button', showLabel: false }),
				],
			},
		},
		customImage({
			hasLinkOptions: true,
			hasCaptionOptions: true,
			hasCropOptions: true,
		}),
		imageColumns(),
		customIframe(),
		carousel(),
		locationSingle(),
		locationList(),
		{ title: 'Table', type: 'portableTable' },
	],
});

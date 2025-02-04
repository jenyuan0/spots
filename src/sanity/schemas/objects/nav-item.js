import { LinkIcon, MasterDetailIcon, WarningOutlineIcon } from '@sanity/icons';
import { defineType } from 'sanity';

import { getRoute } from '@/lib/routes';

export default defineType({
	title: 'Item',
	name: 'navItem',
	type: 'object',
	icon: LinkIcon,
	fields: [
		{
			title: 'Title',
			name: 'title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		},
		{
			title: 'Link',
			name: 'link',
			type: 'link',
			validation: (Rule) => Rule.required(),
		},
	],
	preview: {
		select: {
			title: 'title',
			link: 'link',
		},
		prepare({ title, link }) {
			if (!link.route) {
				return {
					title: 'Empty Item',
					media: WarningOutlineIcon,
				};
			}
			const isExternal = link.route.includes('http');
			const subtitle = link.route;

			return {
				title: title,
				subtitle: subtitle,
				media: link.route
					? isExternal
						? LinkIcon
						: MasterDetailIcon
					: WarningOutlineIcon,
			};
		},
	},
});

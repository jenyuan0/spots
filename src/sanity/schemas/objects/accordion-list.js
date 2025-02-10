import { defineType } from 'sanity';
import { DoubleChevronDownIcon } from '@sanity/icons';
import accordion from '@/sanity/schemas/objects/accordion';

export default function accordionList() {
	return {
		name: 'accordionList',
		type: 'object',
		icon: DoubleChevronDownIcon,
		fields: [
			{
				title: 'Accordion List',
				name: 'items',
				type: 'array',
				of: [accordion()],
			},
		],
		preview: {
			select: {
				items: 'items',
			},
			prepare({ items }) {
				return {
					title: 'Accordion List',
					subtitle: `${items.length} item(s)`,
				};
			},
		},
	};
}

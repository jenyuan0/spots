import React from 'react';
import Link from 'next/link';
import {
	IconArchitecture,
	IconSite,
	IconDine,
	IconDrinks,
	IconHotel,
	IconShop,
} from './SvgIcons';

// TODO
// add links to categories?

function Icon({ slug }) {
	switch (slug) {
		case 'health-beauty':
			return <IconArchitecture />;

		case 'sights-attractions':
			return <IconSite />;

		case 'food-drinks':
			return <IconDine />;

		case 'night-life':
			return <IconDrinks />;

		case 'hotels':
			return <IconHotel />;

		case 'shopping-gifts':
			return <IconShop />;
	}
}

export default function CategoryPill({ data }) {
	const { title, slug, parentCategory } = data;
	const colorD = data?.colorD || parentCategory?.colorD;
	const colorL = data?.colorL || parentCategory?.colorL;
	const iconSlug = parentCategory?.slug || slug;

	return (
		<div
			className="pill"
			style={{
				'--cr-primary': colorD,
				'--cr-secondary': colorL,
			}}
		>
			<Icon slug={iconSlug} />
			{title}
		</div>
	);
}

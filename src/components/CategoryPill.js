import React from 'react';
import Link from '@/components/CustomLink';
import {
	IconArchitecture,
	IconSite,
	IconDine,
	IconDrinks,
	IconHotel,
	IconShop,
} from './SvgIcons';

const iconMap = {
	'health-beauty': IconArchitecture,
	'sights-attractions': IconSite,
	'food-drinks': IconDine,
	'night-life': IconDrinks,
	hotels: IconHotel,
	'shopping-gifts': IconShop,
};

export default function CategoryPill({ data, isLink = false }) {
	const { title, slug, parentCategory } = data;
	const colorD = data?.colorD || parentCategory?.colorD;
	const colorL = data?.colorL || parentCategory?.colorL;
	const iconSlug = parentCategory?.slug || slug;
	const Icon = iconMap[iconSlug];

	if (isLink) {
		return (
			<Link
				className="pill"
				style={{
					'--cr-primary': colorL,
					'--cr-secondary': colorD,
				}}
				href={`/paris/locations/${slug}`}
			>
				{Icon && <Icon />}
				{title}
			</Link>
		);
	} else {
		return (
			<div
				className="pill"
				style={{
					'--cr-primary': colorL,
					'--cr-secondary': colorD,
				}}
			>
				{Icon && <Icon />}
				{title}
			</div>
		);
	}
}

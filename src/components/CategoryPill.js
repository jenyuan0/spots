import React from 'react';
import clsx from 'clsx';
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
	nightlife: IconDrinks,
	hotels: IconHotel,
	'shopping-gifts': IconShop,
};

export default function CategoryPill({
	data,
	postType = 'locations',
	isLink = false,
	isActive,
}) {
	const { title, slug, parentCategory } = data;
	const colorD = data?.colorD || parentCategory?.colorD || 'var(--cr-brown-d)';
	const colorL = data?.colorL || parentCategory?.colorL || 'var(--cr-brown-l)';
	const iconSlug = parentCategory?.slug || slug;
	const Icon = iconMap[iconSlug];

	if (isLink) {
		return (
			<Link
				className={clsx('pill', {
					'is-active': isActive,
				})}
				style={{
					'--cr-primary': colorD,
					'--cr-secondary': colorL,
				}}
				href={`/${postType == 'guides' ? 'paris/' : ''}${postType}${slug ? `/category/${slug}` : ''}`}
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
					'--cr-primary': colorD,
					'--cr-secondary': colorL,
				}}
			>
				{Icon && <Icon />}
				{title}
			</div>
		);
	}
}

'use client';

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { hasArrayValue } from '@/lib/helpers';
import { format } from 'date-fns';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import useAsideMap from '@/hooks/useAsideMap';
import Breadcrumb from '@/components/Breadcrumb';
import GuideCard from '@/components/GuideCard';
import CategoryPillList from '@/components/CategoryPillList';
import ResponsiveGrid from '@/components/ResponsiveGrid';

// TODO:
// min to read in &__header__subtitle
// add author with portrait in &__header
// ad block

export default function PageGuidesSingle({ data }) {
	const {
		title,
		thumb,
		publishDate,
		color,
		colorHex,
		categories,
		subcategories,
		showMap,
		excerpt,
		content,
		pageModules,
		related,
		defaultRelated,
	} = data || {};
	const setAsideMapActive = useAsideMap((state) => state.setAsideMapActive);
	const setAsideMapLocations = useAsideMap(
		(state) => state.setAsideMapLocations
	);
	const breadcrumb = [
		{
			title: 'Paris',
			url: '/paris',
		},
		{
			title: 'Guides',
			url: '/paris/guides',
		},
		...(categories?.length
			? [
					{
						title: categories[0].title,
						url: `/paris/locations/${categories[0].slug}`,
					},
				]
			: []),
	];

	useEffect(() => {
		const locations =
			[
				...content
					?.filter((item) => item._type === 'locationList')
					?.reduce((acc, curr) => {
						if (!curr?.locations) return acc;
						return [...acc, ...curr.locations];
					}, []),
				...content
					?.filter((item) => item._type === 'locationSingle')
					?.map((item) => item.location)
					?.filter(Boolean),
			]?.filter(
				(location, index, self) =>
					self.findIndex(
						(l) => JSON.stringify(l) === JSON.stringify(location)
					) === index
			) || [];

		setTimeout(() => {
			setAsideMapLocations(locations);
			setAsideMapActive(locations.length && showMap);
		}, 1);
	}, [pageModules]);

	return (
		<>
			<section className="p-guide__hero" style={{ '--cr-primary': colorHex }}>
				<div className="p-guide__hero__text wysiwyg">
					<Breadcrumb data={breadcrumb} />
					<h1 className="t-h-1">{title}</h1>
				</div>
				{thumb && (
					<div className="p-guide__hero__image">
						<span className="object-fit">
							<Img image={thumb} />
						</span>
					</div>
				)}
			</section>

			<section className="p-guide__body" style={{ '--cr-primary': colorHex }}>
				{excerpt && (
					<div className="p-guide__content">
						<div className="p-guide__content__sidebar">
							<div className="t-l-1">Introduction</div>
						</div>
						<div className="p-guide__content__content wysiwyg-page">
							<p
								className={clsx('p-guide__excerpt', {
									't-h-2': excerpt.split(' ').length <= 65,
									't-h-3': excerpt.split(' ').length > 65,
								})}
							>
								{excerpt}
							</p>
						</div>
						<div className="p-guide__content__sidebar"></div>
					</div>
				)}
				<div className="p-guide__content">
					<div className="p-guide__content__sidebar">
						<div className="t-l-1">
							Published by SPOTS Staff
							<br />
							{format(publishDate, 'MMMM do, yyyy')}
						</div>
					</div>
					<div className="p-guide__content__content wysiwyg-page">
						{<CustomPortableText blocks={content} />}
					</div>
					<div className="p-guide__content__sidebar"></div>
				</div>
			</section>

			<section className="p-guide__footer">
				{(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
					<CategoryPillList
						categories={categories}
						subcategories={subcategories}
						isLink={true}
					/>
				)}
			</section>

			{(hasArrayValue(related) || hasArrayValue(defaultRelated)) && (
				<section className="p-guide__related">
					<h2 className="p-guide__related__title t-h-2">Continue Reading</h2>
					<ResponsiveGrid className={'p-guide__related__list'}>
						{[...Array(4)].map((_, index) => {
							const relatedItems = related || [];
							const defaultItems = defaultRelated || [];
							const allItems = [...relatedItems, ...defaultItems];
							const item = allItems[index];
							return item && <GuideCard key={item._id} data={item} />;
						})}
					</ResponsiveGrid>
				</section>
			)}
		</>
	);
}

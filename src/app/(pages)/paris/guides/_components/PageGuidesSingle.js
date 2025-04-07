'use client';

import React, { useEffect } from 'react';
import { hasArrayValue } from '@/lib/helpers';
import { format } from 'date-fns';
import PageModules from '@/components/PageModules';
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
		heroImage,
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
			title: 'Locations',
			url: '/paris/locations',
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

		console.log(locations);

		setTimeout(() => {
			setAsideMapLocations(locations);
			setAsideMapActive(locations.length && showMap);
		}, 1);
	}, [pageModules]);

	return (
		<>
			<section
				className="p-guides-single__header"
				style={{ '--cr-primary': colorHex }}
			>
				{heroImage && (
					<div className="p-guides-single__header__image">
						<Img image={heroImage} />
					</div>
				)}
				<div className="p-guides-single__header__text">
					<Breadcrumb data={breadcrumb} />
					<h1 className="p-guides-single__header__heading t-h-1">{title}</h1>
					<div className="p-guides-single__subtitle t-b-1">
						{format(publishDate, 'MMMM do')}
					</div>
				</div>
			</section>

			<section className="p-guides-single__body wysiwyg-page">
				{excerpt && <p className="large-paragraph">{excerpt}</p>}
				<CustomPortableText blocks={content} />
			</section>

			<section className="p-guides-single__footer">
				{(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
					<CategoryPillList
						categories={categories}
						subcategories={subcategories}
						isLink={true}
					/>
				)}
			</section>

			{(hasArrayValue(related) || hasArrayValue(defaultRelated)) && (
				<section className="p-guides-single__related">
					<h2 className="p-guides-single__related__title t-h-2">
						Continue Reading
					</h2>
					<div className="p-guides-single__related__list">
						<ResponsiveGrid>
							{[...Array(4)].map((_, index) => {
								const relatedItems = related || [];
								const defaultItems = defaultRelated || [];
								const allItems = [...relatedItems, ...defaultItems];
								const item = allItems[index];
								return item && <GuideCard key={item._id} data={item} />;
							})}
						</ResponsiveGrid>
					</div>
				</section>
			)}
		</>
	);
}

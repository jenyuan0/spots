'use client';

import React, { Suspense } from 'react';
import LocationsPagination from './LocationsPagination';
import LocationsInfiniteScroll from './LocationsInfiniteScroll';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryPill from '@/components/CategoryPill';
import CategoryPillList from '@/components/CategoryPillList';
import CustomPortableText from '@/components/CustomPortableText';

export default function PageLocationsIndex({ data }) {
	const {
		slug,
		heading,
		paragraph,
		locationsHeading,
		locationsParagraph,
		categories,
		isCategoryPage,
		parentCategory,
		subcategories,
		categoryTitle,
		locationList,
		paginationMethod,
	} = data || {};
	const breadcrumb = [
		{
			title: 'Paris',
			url: '/paris',
		},
		{
			title: 'Locations',
			url: '/paris/locations',
		},
		...(parentCategory
			? [
					{
						title: parentCategory.title,
						url: `/paris/locations/category/${categories[0].slug}`,
					},
				]
			: []),
	];
	const dataAllPill = {
		title: 'All Locations',
		slug: '',
		parentCategory: null,
	};
	const introHeading = isCategoryPage
		? locationsHeading || (
				<>
					Best Places in Paris
					<br />
					for {categoryTitle}
				</>
			)
		: heading;
	const introParagraph = isCategoryPage ? locationsParagraph : paragraph;

	return (
		<>
			<section className="p-locations__header c-index-header wysiwyg">
				<Breadcrumb data={breadcrumb} />
				{introHeading && (
					<h1 className="t-h-1">
						{Array.isArray(introHeading) ? (
							<CustomPortableText blocks={introHeading} hasPTag={false} />
						) : (
							introHeading
						)}
					</h1>
				)}
				{introParagraph && (
					<p className="t-b-2">
						<CustomPortableText blocks={introParagraph} hasPTag={false} />
					</p>
				)}
			</section>
			<section className="p-locations__body">
				{(categories || subcategories) && (
					<div className="c-index-filters">
						{categories && (
							<CategoryPillList
								categories={categories}
								activeSlug={parentCategory?.slug || slug}
								isLink={true}
							>
								<li className="c-category-pill-list__title t-l-2">
									Categories:
								</li>
								<li>
									<CategoryPill
										className="pill"
										data={dataAllPill}
										postType={'locations'}
										isLink={true}
										isActive={!isCategoryPage}
									/>
								</li>
							</CategoryPillList>
						)}
						{subcategories && (
							<CategoryPillList
								categories={subcategories}
								activeSlug={slug}
								isLink={true}
							/>
						)}
					</div>
				)}
				{Array.isArray(locationList) && locationList.length > 0 ? (
					paginationMethod === 'page-numbers' || !paginationMethod ? (
						<Suspense>
							<LocationsPagination data={data} />
						</Suspense>
					) : (
						<LocationsInfiniteScroll data={data} />
					)
				) : (
					<div className="p-locations__empty">
						<p className="t-h-3">No items found</p>
					</div>
				)}
			</section>
		</>
	);
}

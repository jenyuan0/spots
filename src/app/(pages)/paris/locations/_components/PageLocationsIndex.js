'use client';

import React, { Suspense } from 'react';
import LocationsPagination from './LocationsPagination';
import LocationsInfiniteScroll from './LocationsInfiniteScroll';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryPill from '@/components/CategoryPill';
import CategoryPillList from '@/components/CategoryPillList';
import CustomPortableText from '@/components/CustomPortableText';

export default function PageLocationsIndex({ data }) {
	const { heading, slug, categories, isCategoryPage, paginationMethod } =
		data || {};
	const breadcrumb = [
		{
			title: 'Paris',
			url: '/paris',
		},
		{
			title: 'Locations',
			url: '/paris/locations',
		},
	];
	const dataAllPill = {
		title: 'All Locations',
		slug: '',
		parentCategory: null,
	};

	return (
		<>
			<section className="p-locations__header wysiwyg">
				<Breadcrumb data={breadcrumb} />
				{heading && (
					<h1 className="t-h-1">
						<CustomPortableText blocks={heading} hasPTag={false} />
					</h1>
				)}
			</section>
			<section className="p-locations__body">
				{categories && (
					<div className="p-guides__filters">
						<CategoryPillList
							categories={categories}
							activeSlug={slug}
							isLink={true}
						>
							<li className="c-category-pill-list__title t-l-2">Filter:</li>
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
					</div>
				)}
				{paginationMethod === 'page-numbers' || !paginationMethod ? (
					<Suspense>
						<LocationsPagination data={data} />
					</Suspense>
				) : (
					<LocationsInfiniteScroll data={data} />
				)}
			</section>
		</>
	);
}

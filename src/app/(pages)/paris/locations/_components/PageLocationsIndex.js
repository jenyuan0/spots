'use client';

import React, { Suspense } from 'react';
import LocationsPagination from './LocationsPagination';
import LocationsInfiniteScroll from './LocationsInfiniteScroll';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryPill from '@/components/CategoryPill';
import CustomPortableText from '@/components/CustomPortableText';

export default function PageLocationsIndex({ data }) {
	const { heading, categorySlug, categories, paginationMethod } = data || {};
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
	const categoryAll = {
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
					<ul className="p-locations__categories">
						<li className="t-l-2">Filter:</li>
						<li>
							<CategoryPill
								className="pill"
								data={categoryAll}
								isLink={true}
								isActive={!categorySlug}
							/>
						</li>
						{categories.map((item) => (
							<li key={`category-${item._id}`}>
								<CategoryPill
									className="pill"
									data={item}
									isLink={true}
									isActive={categorySlug == item.slug}
								/>
							</li>
						))}
					</ul>
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

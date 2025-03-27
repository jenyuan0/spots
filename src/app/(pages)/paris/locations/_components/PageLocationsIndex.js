'use client';

import React, { Suspense } from 'react';
import LocationsPagination from './LocationsPagination';
import LocationsInfiniteScroll from './LocationsInfiniteScroll';
import CategoryPill from '@/components/CategoryPill';
import CustomPortableText from '@/components/CustomPortableText';

export default function PageLocationsIndex({ data }) {
	const { heading, categorySlug, categories, paginationMethod } = data || {};
	const categoryAll = {
		title: 'All Locations',
		slug: '',
		parentCategory: null,
	};

	return (
		<>
			<section className="p-locations__header wysiwyg">
				<h1 className="t-l-2">Paris Locations</h1>
				{heading && (
					<h2 className="t-h-1">
						<CustomPortableText blocks={heading} hasPTag={false} />
					</h2>
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

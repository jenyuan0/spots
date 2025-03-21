'use client';

import React from 'react';
import LocationsPagination from './LocationsPagination';
import LocationsInfiniteScroll from './LocationsInfiniteScroll';
import { Suspense } from 'react';
import CustomPortableText from '@/components/CustomPortableText';

export default function PageLocationsIndex({ data }) {
	const { heading, paginationMethod } = data || {};

	return (
		<>
			<section className="p-locations__heading">
				{heading && (
					<h1 className="t-h-1">
						<CustomPortableText blocks={heading} hasPTag={false} />
					</h1>
				)}
			</section>
			{paginationMethod === 'page-numbers' || !paginationMethod ? (
				<Suspense>
					<LocationsPagination data={data} />
				</Suspense>
			) : (
				<LocationsInfiniteScroll data={data} />
			)}
		</>
	);
}

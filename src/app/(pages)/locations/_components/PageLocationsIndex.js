import React from 'react';
import LocationsPagination from './LocationsPagination';
import LocationsInfiniteScroll from './LocationsInfiniteScroll';
import { Suspense } from 'react';

export default function PageLocationsIndex({ data }) {
	const { title, paginationMethod } = data || {};
	return (
		<>
			<section className="p-guides-heading">
				<h1>{title}</h1>
			</section>
			<section className="p-guides-articles">
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

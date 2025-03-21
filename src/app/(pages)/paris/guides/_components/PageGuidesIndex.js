import React from 'react';
import GuidesPagination from './GuidesPagination';
import GuidesInfiniteScroll from './GuidesInfiniteScroll';
import { Suspense } from 'react';

export default function PageGuidesIndex({ data }) {
	const { title, paginationMethod } = data || {};
	return (
		<>
			<section className="p-guides-heading">
				<h1>{title}</h1>
			</section>
			<section className="p-guides-articles">
				{paginationMethod === 'page-numbers' || !paginationMethod ? (
					<Suspense>
						<GuidesPagination data={data} />
					</Suspense>
				) : (
					<GuidesInfiniteScroll data={data} />
				)}
			</section>
		</>
	);
}

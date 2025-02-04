import React from 'react';
import BlogPagination from './BlogPagination';
import BlogInfiniteScroll from './BlogInfiniteScroll';
import { Suspense } from 'react';

export default function PageBlogIndex({ data }) {
	const { title, paginationMethod } = data || {};
	return (
		<>
			<section className="p-blog-heading">
				<h1>{title}</h1>
			</section>
			<section className="p-blog-articles">
				{paginationMethod === 'page-numbers' || !paginationMethod ? (
					<Suspense>
						<BlogPagination data={data} />
					</Suspense>
				) : (
					<BlogInfiniteScroll data={data} />
				)}
			</section>
		</>
	);
}

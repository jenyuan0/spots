'use client';

import React, { Suspense } from 'react';
import GuidesPagination from './GuidesPagination';
import GuidesInfiniteScroll from './GuidesInfiniteScroll';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryPill from '@/components/CategoryPill';
import CustomPortableText from '@/components/CustomPortableText';

export default function PageGuidesIndex({ data }) {
	const { heading, categorySlug, categories, paginationMethod } = data || {};
	const breadcrumb = [
		{
			title: 'Paris',
			url: '/paris',
		},
		{
			title: 'Guides',
			url: '/paris/guides',
		},
	];
	const categoryAll = {
		title: 'All Guides',
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
								postType={'guides'}
								isLink={true}
								isActive={!categorySlug}
							/>
						</li>
						{categories.map((item) => (
							<li key={`category-${item._id}`}>
								<CategoryPill
									className="pill"
									data={item}
									postType={'guides'}
									isLink={true}
									isActive={categorySlug == item.slug}
								/>
							</li>
						))}
					</ul>
				)}
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

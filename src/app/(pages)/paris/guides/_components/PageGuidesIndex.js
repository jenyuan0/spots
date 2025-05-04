'use client';

import React, { Suspense } from 'react';
import GuidesPagination from './GuidesPagination';
import GuidesInfiniteScroll from './GuidesInfiniteScroll';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryPill from '@/components/CategoryPill';
import CategoryPillList from '@/components/CategoryPillList';
import CustomPortableText from '@/components/CustomPortableText';

export default function PageGuidesIndex({ data }) {
	const {
		heading,
		slug,
		paragraph,
		guidesParagraph,
		categories,
		categoryTitle,
		isCategoryPage,
		paginationMethod,
	} = data || {};
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
	const dataAllPill = {
		title: 'All Guides',
		slug: '',
		parentCategory: null,
	};
	const introParagraph = isCategoryPage ? guidesParagraph : paragraph;

	return (
		<>
			<section className="p-locations__header c-index-header wysiwyg">
				<Breadcrumb data={breadcrumb} />
				{heading && (
					<h1 className="t-h-1">
						{isCategoryPage && categoryTitle ? (
							<>
								Paris Guides for
								<br />
								{categoryTitle}
							</>
						) : (
							<CustomPortableText blocks={heading} hasPTag={false} />
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
				{categories && (
					<div className="p-guides__filters">
						<CategoryPillList
							categories={categories}
							activeSlug={slug}
							postType={'guides'}
							isLink={true}
						>
							<li className="c-category-pill-list__title t-l-2">Filter:</li>
							<li>
								<CategoryPill
									className="pill"
									data={dataAllPill}
									postType={'guides'}
									isLink={true}
									isActive={!isCategoryPage}
								/>
							</li>
						</CategoryPillList>
					</div>
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

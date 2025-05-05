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
		slug,
		heading,
		paragraph,
		guidesHeading,
		guidesParagraph,
		categories,
		isCategoryPage,
		parentCategory,
		subcategories,
		categoryTitle,
		articleList,
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
		title: 'All Guides',
		slug: '',
		parentCategory: null,
	};

	const introHeading = isCategoryPage
		? guidesHeading || (
				<>
					Paris Travel Guides
					<br />
					for {categoryTitle}
				</>
			)
		: heading;
	const introParagraph = isCategoryPage ? guidesParagraph : paragraph;

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
								postType={'guides'}
								isLink={true}
							>
								<li className="c-category-pill-list__title t-l-2">
									Categories:
								</li>
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
						)}
						{/* {subcategories && (
							<CategoryPillList
								categories={subcategories}
								activeSlug={slug}
								postType={'guides'}
								isLink={true}
							/>
						)} */}
					</div>
				)}
				{Array.isArray(articleList) && articleList.length > 0 ? (
					paginationMethod === 'page-numbers' || !paginationMethod ? (
						<Suspense>
							<GuidesPagination data={data} />
						</Suspense>
					) : (
						<GuidesInfiniteScroll data={data} />
					)
				) : (
					<div className="p-guides__empty">
						<p className="t-l-2">No items found</p>
					</div>
				)}
			</section>
		</>
	);
}

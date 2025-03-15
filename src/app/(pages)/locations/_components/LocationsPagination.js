'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import LocationCard from '@/components/LocationCard';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { getLocationsData } from '@/sanity/lib/queries';
import useAsideMap from '@/hooks/useAsideMap';

const getLocationsQueryGROQ = ({ pageNumber, pageSize }) => {
	let queryGroq = `_type == "gLocations"`;

	return `*[${queryGroq}] | order(_updatedAt desc) [(${pageNumber} * ${pageSize})...(${pageNumber} + 1) * ${pageSize}]{
		${getLocationsData('card')}
	}`;
};

const ListWithClientQuery = ({ data, currentPageNumber }) => {
	const { itemsPerPage, itemsTotalCount } = data || {};
	const pageNumber = Number(currentPageNumber);

	const fetchArticles = async ({ pageNumber, itemsPerPage }) => {
		const query = getLocationsQueryGROQ({
			pageNumber,
			pageSize: itemsPerPage,
		});
		const res = await client.fetch(query);
		return res;
	};

	const {
		data: articlesData,
		isPending,
		isError,
		error,
		isFetching,
		isPlaceholderData,
	} = useQuery({
		queryKey: ['locations', pageNumber],
		queryFn: () => fetchArticles({ pageNumber, itemsPerPage }),
		placeholderData: keepPreviousData,
	});

	return (
		<div>
			{isPending || isFetching ? (
				<div>Loading...</div>
			) : isError ? (
				<div>Error: {error.message}</div>
			) : (
				<div className="p-locations__list">
					{articlesData.map((item, index) => (
						<LocationCard key={item._id} data={item} />
					))}
				</div>
			)}
		</div>
	);
};

const ListWithSSG = ({ data, currentPageNumber }) => {
	const { locationList, itemsPerPage } = data;
	const [listState, setListState] = useState('isLoading');
	const [listData, setListData] = useState([]);
	const setAsideMapLocations = useAsideMap(
		(state) => state.setAsideMapLocations
	);

	useEffect(() => {
		const pageSizeStart = (currentPageNumber - 1) * itemsPerPage;
		const pageSizeEnd = currentPageNumber * itemsPerPage;
		const currentLocations = locationList.slice(pageSizeStart, pageSizeEnd);
		setListData(currentLocations);
		setListState(null);
		setAsideMapLocations(currentLocations);
	}, [locationList, itemsPerPage, currentPageNumber]);

	return (
		<>
			{listState === 'isLoading' ? (
				<p>Loading...</p>
			) : (
				<div className="p-locations__list">
					{listData.map((item, index) => (
						<LocationCard key={item._id} data={item} />
					))}
				</div>
			)}
		</>
	);
};
export default function LocationsPagination({ data }) {
	const searchParams = useSearchParams();
	const currentPageNumber = searchParams.get('page') || 1;
	const { itemsTotalCount, itemsPerPage } = data;
	const ARTICLE_TOTAL_PAGE = Math.round(itemsTotalCount / itemsPerPage);

	return (
		<>
			{/* <ListWithClientQuery data={data} currentPageNumber={currentPageNumber} /> */}
			<ListWithSSG data={data} currentPageNumber={currentPageNumber} />
			{ARTICLE_TOTAL_PAGE > 1 && (
				<div className="p-locations__pagination">
					<Link
						href={{
							pathname: '/locations',
							query: { page: Math.max(1, Number(currentPageNumber) - 1) },
						}}
						className={clsx('p-locations__pagination__button', {
							'is-disabled': currentPageNumber === '1',
						})}
					>
						<div className="icon-caret-left" />
					</Link>
					{(() => {
						const pages = [];
						const currentPage = Number(currentPageNumber);

						if (currentPage === 1) {
							// First page - show first 3 pages
							for (let i = 1; i <= Math.min(3, ARTICLE_TOTAL_PAGE); i++) {
								pages.push(i);
							}

							if (ARTICLE_TOTAL_PAGE > 3) {
								pages.push('...');
								pages.push(ARTICLE_TOTAL_PAGE);
							}
						} else if (currentPage === ARTICLE_TOTAL_PAGE) {
							// Last page - show last 3 pages
							if (ARTICLE_TOTAL_PAGE > 3) {
								pages.push(1);
								pages.push('...');
							}
							for (
								let i = Math.max(1, ARTICLE_TOTAL_PAGE - 2);
								i <= ARTICLE_TOTAL_PAGE;
								i++
							) {
								pages.push(i);
							}
						} else {
							// Middle pages - show previous, current, and next
							if (currentPage > 2) {
								pages.push(1);
								pages.push('...');
							}

							pages.push(currentPage - 1);
							pages.push(currentPage);
							pages.push(currentPage + 1);

							if (currentPage < ARTICLE_TOTAL_PAGE - 1) {
								pages.push('...');
								pages.push(ARTICLE_TOTAL_PAGE);
							}
						}

						return pages.map((page, index) => {
							if (page === '...') {
								return (
									<span
										key={`ellipsis-${index}`}
										className="p-locations__pagination__ellipsis"
									>
										...
									</span>
								);
							}

							return (
								<Link
									href={{
										pathname: '/locations',
										query: { page },
									}}
									key={page}
									className={clsx('p-locations__pagination__button t-l-1', {
										'is-active': page === currentPage,
									})}
								>
									{page}
								</Link>
							);
						});
					})()}
					<Link
						href={{
							pathname: '/locations',
							query: {
								page: Math.min(
									ARTICLE_TOTAL_PAGE,
									Number(currentPageNumber) + 1
								),
							},
						}}
						className={clsx('p-locations__pagination__button', {
							'is-disabled': currentPageNumber === String(ARTICLE_TOTAL_PAGE),
						})}
					>
						<div className="icon-caret-right" />
					</Link>
				</div>
			)}
		</>
	);
}

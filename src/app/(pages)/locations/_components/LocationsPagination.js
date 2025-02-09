'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import LocationCard from '@/components/LocationCard';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { getLocationsData } from '@/sanity/lib/queries';

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
				<div className="p-locations-articles__list">
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

	useEffect(() => {
		const pageSizeStart = (currentPageNumber - 1) * itemsPerPage;
		const pageSizeEnd = currentPageNumber * itemsPerPage;
		setListData(locationList.slice(pageSizeStart, pageSizeEnd));
		setListState(null);
	}, [locationList, itemsPerPage, currentPageNumber]);

	return (
		<>
			{listState === 'isLoading' ? (
				<p>Loading...</p>
			) : (
				<div className="p-locations-articles__list">
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
	console.log('sss', itemsPerPage, ARTICLE_TOTAL_PAGE);
	return (
		<>
			{/* <ListWithClientQuery data={data} currentPageNumber={currentPageNumber} /> */}
			<ListWithSSG data={data} currentPageNumber={currentPageNumber} />
			{ARTICLE_TOTAL_PAGE > 1 && (
				<div className="c-locations-pagination__pagination f-h f-a-c f-j-c">
					{Array.from({ length: ARTICLE_TOTAL_PAGE }, (_, index) => {
						const pageNumber = index + 1;
						return (
							<Link
								href={{
									pathname: '/locations',
									query: { page: pageNumber },
								}}
								key={index}
								className={clsx('c-locations-pagination__pagination__number', {
									'is-active': pageNumber === Number(currentPageNumber),
								})}
							>
								{pageNumber}
							</Link>
						);
					})}
				</div>
			)}
		</>
	);
}

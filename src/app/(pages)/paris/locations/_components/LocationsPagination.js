'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import LocationCard from '@/components/LocationCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import Pagination from '@/components/Pagination';
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

const LocationGrid = ({ locations }) => {
	return (
		<ResponsiveGrid className={'p-locations__list'} size={'sml'}>
			{locations?.map((item, index) => (
				<LocationCard key={item._id} data={item} layout="vertical-2" />
			))}
		</ResponsiveGrid>
	);
};

const ListWithClientQuery = ({ data, currentPageNumber }) => {
	const { itemsPerPage } = data || {};
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
				<LocationGrid locations={articlesData} />
			)}
		</div>
	);
};

const ListWithSSG = ({ data, currentPageNumber }) => {
	const { locationList, itemsPerPage } = data;
	const [listState, setListState] = useState('isLoading');
	const [listData, setListData] = useState([]);
	// const setAsideMapActive = useAsideMap((state) => state.setAsideMapActive);
	// const setAsideMapLocations = useAsideMap(
	// 	(state) => state.setAsideMapLocations
	// );

	useEffect(() => {
		const pageSizeStart = (currentPageNumber - 1) * itemsPerPage;
		const pageSizeEnd = currentPageNumber * itemsPerPage;
		const currentLocations = locationList?.slice(pageSizeStart, pageSizeEnd);
		setListData(currentLocations);
		setListState(null);

		// setTimeout(() => {
		// 	setAsideMapLocations(currentLocations);
		// 	setAsideMapActive(true);
		// }, 1);
	}, [locationList, itemsPerPage, currentPageNumber]);

	return (
		<>
			{listState === 'isLoading' ? (
				<p>Loading...</p>
			) : (
				<LocationGrid locations={listData} />
			)}
		</>
	);
};

export default function LocationsPagination({ data }) {
	const searchParams = useSearchParams();
	const { categorySlug, itemsPerPage = 12 } = data;
	const items = data?.locationList || [];
	const itemsTotalCount = items.length;
	const currentPageNumber = Number(searchParams.get('page')) || 1;
	const totalPages = Math.ceil(itemsTotalCount / itemsPerPage); // Use ceil instead of round

	if (itemsTotalCount === 0) {
		return null; // Don't render pagination if no items
	}

	return (
		<>
			<ListWithSSG data={data} currentPageNumber={currentPageNumber} />
			{totalPages > 1 && (
				<Pagination
					currentPageNumber={currentPageNumber}
					totalPage={totalPages}
					url={`/paris/locations${categorySlug ? `/category/${categorySlug}` : ''}`}
				/>
			)}
		</>
	);
}

'use client';
import React, { useState, useEffect } from 'react';
import GuideCard from '@/components/GuideCard';
import { InView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLocationsData } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';

const getLocationssQueryGROQ = ({ pageParam, pageSize }) => {
	let queryGroq = `_type == "gLocations"`;

	return `*[${queryGroq}] | order(_updatedAt desc) [(${pageParam} * ${pageSize})...(${pageParam} + 1) * ${pageSize}]{
		${getLocationsData('card')}
	}`;
};

const ListWithClientQuery = ({ data }) => {
	const {
		paginationMethod,
		itemsPerPage,
		loadMoreButtonLabel,
		infiniteScrollCompleteLabel,
	} = data || {};

	const LOAD_MORE_BUTTON_LABEL = loadMoreButtonLabel ?? 'Load More';
	const NO_MORE_ARTICLES_MESSAGE =
		infiniteScrollCompleteLabel ?? 'You’ve reached the end';

	const fetchArticles = async ({ pageParam }) => {
		const query = getLocationssQueryGROQ({
			pageParam,
			pageSize: itemsPerPage,
		});
		const res = await client.fetch(query);
		return res;
	};

	const {
		data: articlesData,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ['guides'],
		queryFn: ({ pageParam }) => fetchArticles({ pageParam }),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length ? allPages.length : undefined;
		},
	});

	return (
		<>
			{status === 'pending' ? (
				<p>Loading...</p>
			) : status === 'error' ? (
				<p>Error: {error.message}</p>
			) : (
				<>
					<section className="p-locations-articles">
						{articlesData.pages.map((group, i) => (
							<React.Fragment key={i}>
								{group.map((item) => (
									<GuideCard key={item._id} data={item} />
								))}
							</React.Fragment>
						))}
					</section>
					{paginationMethod === 'load-more' ? (
						<button
							onClick={() => fetchNextPage()}
							disabled={!hasNextPage || isFetchingNextPage}
							className="btn"
						>
							{isFetchingNextPage
								? 'Loading more...'
								: hasNextPage
									? LOAD_MORE_BUTTON_LABEL
									: NO_MORE_ARTICLES_MESSAGE}
						</button>
					) : (
						<InView
							as="section"
							className="p-locations__footer"
							onChange={(inView) => {
								if (inView && hasNextPage && !isFetchingNextPage) {
									fetchNextPage();
								}
							}}
						>
							{isFetching
								? 'Loading more...'
								: !hasNextPage && NO_MORE_ARTICLES_MESSAGE}
						</InView>
					)}
				</>
			)}
		</>
	);
};

const ListWithSSG = ({ data }) => {
	const {
		locationList,
		paginationMethod,
		itemsPerPage,
		loadMoreButtonLabel,
		infiniteScrollCompleteLabel,
		itemsTotalCount,
	} = data || {};

	const [currentPageNumber, setCurrentPageNumber] = useState(1);
	const [listState, setListState] = useState('pending');
	const [listData, setListData] = useState([]);
	const hasNextPage = listData.length < itemsTotalCount;

	useEffect(() => {
		setListState('isFetching');
		const pageSizeEnd = currentPageNumber * itemsPerPage;
		setListData(locationList.slice(0, pageSizeEnd));
		setListState('success');
	}, [locationList, listState, itemsPerPage, currentPageNumber]);

	const fetchNextPage = () => {
		setListState('isFetchingNextPage');
		setCurrentPageNumber((prev) => prev + 1);
	};

	const LOAD_MORE_BUTTON_LABEL = loadMoreButtonLabel ?? 'Load More';
	const NO_MORE_ARTICLES_MESSAGE =
		infiniteScrollCompleteLabel ?? 'You’ve reached the end';

	return (
		<>
			{listState === 'pending' ? (
				<p>Loading...</p>
			) : listState === 'error' ? (
				<p>Error: {listState}</p>
			) : (
				<>
					<div className="p-locations-articles__list">
						{listData.map((item, index) => (
							<GuideCard key={item._id} data={item} />
						))}
					</div>
					{paginationMethod === 'load-more' ? (
						<button
							onClick={() => fetchNextPage()}
							disabled={!hasNextPage || listState === 'isFetchingNextPage'}
							className="btn"
						>
							{listState === 'isFetchingNextPage'
								? 'Loading more...'
								: hasNextPage
									? LOAD_MORE_BUTTON_LABEL
									: NO_MORE_ARTICLES_MESSAGE}
						</button>
					) : (
						<InView
							as="section"
							className="p-locations__footer"
							onChange={(inView) => {
								if (
									inView &&
									hasNextPage &&
									listState !== 'isFetchingNextPage'
								) {
									fetchNextPage();
								}
							}}
						>
							{listState === 'isFetching'
								? 'Loading more...'
								: !hasNextPage && NO_MORE_ARTICLES_MESSAGE}
						</InView>
					)}
				</>
			)}
		</>
	);
};

export default function LocationsInfiniteScroll({ data }) {
	return (
		<>
			<ListWithSSG data={data} />
			{/* <ListWithClientQuery data={data} /> */}
		</>
	);
}

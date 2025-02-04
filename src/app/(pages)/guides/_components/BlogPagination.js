/*
	To determine whether to use SSG or client-side fetching to render articles, consider the following criteria: if the response size of the article list is larger than 128KB or there are more than 200 posts, you should use the client fetch component.

	By default, the component used is SSG (<ListWithSSG/>). If you need to use the client fetch, follow these steps:

	1.	Uncomment the <ListWithClientQuery /> component and delete the <ListWithSSG/> component.
	2.	Go to the blog fetch function getBlogIndexPage located in 'src/app/(pages)/blog/page.js', and set isArticleDataSSG to false. Alternatively, you can modify the pageBlogIndexWithArticleDataSSGQuery located in 'src/sanity/lib/queries' to remove the query articleListAllQuery.

*/

'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import BlogCard from '@/components/BlogCard';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { getBlogPostData } from '@/sanity/lib/queries';

const getBlogQueryGROQ = ({ pageNumber, pageSize }) => {
	let queryGroq = `_type == "pBlog"`;

	return `*[${queryGroq}] | order(_updatedAt desc) [(${pageNumber} * ${pageSize})...(${pageNumber} + 1) * ${pageSize}]{
		${getBlogPostData('card')}
	}`;
};

const ListWithClientQuery = ({ data, currentPageNumber }) => {
	const { itemsPerPage, itemsTotalCount } = data || {};
	const pageNumber = Number(currentPageNumber);

	const fetchArticles = async ({ pageNumber, itemsPerPage }) => {
		const query = getBlogQueryGROQ({
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
		queryKey: ['blogs', pageNumber],
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
				<div className="p-blog-articles__list">
					{articlesData.map((item, index) => (
						<BlogCard key={item._id} data={item} />
					))}
				</div>
			)}
		</div>
	);
};

const ListWithSSG = ({ data, currentPageNumber }) => {
	const { articleList, itemsPerPage } = data;
	const [listState, setListState] = useState('isLoading');
	const [listData, setListData] = useState([]);

	useEffect(() => {
		const pageSizeStart = (currentPageNumber - 1) * itemsPerPage;
		const pageSizeEnd = currentPageNumber * itemsPerPage;
		setListData(articleList.slice(pageSizeStart, pageSizeEnd));
		setListState(null);
	}, [articleList, itemsPerPage, currentPageNumber]);

	return (
		<>
			{listState === 'isLoading' ? (
				<p>Loading...</p>
			) : (
				<div className="p-blog-articles__list">
					{listData.map((item, index) => (
						<BlogCard key={item._id} data={item} />
					))}
				</div>
			)}
		</>
	);
};

export default function BlogPagination({ data }) {
	const searchParams = useSearchParams();
	const currentPageNumber = searchParams.get('page') || 1;
	const { itemsTotalCount, itemsPerPage } = data;
	const ARTICLE_TOTAL_PAGE = itemsTotalCount / itemsPerPage;
	return (
		<>
			{/* <ListWithClientQuery data={data} currentPageNumber={currentPageNumber} /> */}
			<ListWithSSG data={data} currentPageNumber={currentPageNumber} />
			{ARTICLE_TOTAL_PAGE > 1 && (
				<div className="c-blog-pagination__pagination f-h f-a-c f-j-c">
					{Array.from({ length: ARTICLE_TOTAL_PAGE }, (_, index) => {
						const pageNumber = index + 1;
						return (
							<Link
								href={{
									pathname: '/blog',
									query: { page: pageNumber },
								}}
								key={index}
								className={clsx('c-blog-pagination__pagination__number', {
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

import clsx from 'clsx';
import Link from 'next/link';

export default function Pagination({ totalPage, currentPageNumber, url }) {
	return (
		<div className="c-pagination">
			<Link
				href={{
					pathname: url,
					query: { page: Math.max(1, Number(currentPageNumber) - 1) },
				}}
				className={clsx('c-pagination__button', {
					'is-disabled': Number(currentPageNumber) === 1,
				})}
			>
				<div className="icon-caret-left" />
			</Link>
			{(() => {
				const pages = [];
				const currentPage = Number(currentPageNumber);

				if (currentPage === 1) {
					// First page - show first 3 pages
					for (let i = 1; i <= Math.min(3, totalPage); i++) {
						pages.push(i);
					}

					if (totalPage > 3) {
						pages.push('...');
						pages.push(totalPage);
					}
				} else if (currentPage === totalPage) {
					// Last page - show last 3 pages
					if (totalPage > 3) {
						pages.push(1);
						pages.push('...');
					}
					for (let i = Math.max(1, totalPage - 2); i <= totalPage; i++) {
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

					if (currentPage < totalPage - 1) {
						pages.push('...');
						pages.push(totalPage);
					}
				}

				return pages.map((page, index) => {
					if (page === '...') {
						return (
							<span
								key={`ellipsis-${index}`}
								className="c-pagination__ellipsis"
							>
								...
							</span>
						);
					}

					return (
						<Link
							href={{
								pathname: url,
								query: { page },
							}}
							key={page}
							className={clsx('c-pagination__button t-l-1', {
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
					pathname: url,
					query: {
						page: Math.min(totalPage, Number(currentPageNumber) + 1),
					},
				}}
				className={clsx('c-pagination__button', {
					'is-disabled': Number(currentPageNumber) === totalPage,
				})}
			>
				<div className="icon-caret-right" />
			</Link>
		</div>
	);
}

import React from 'react';
import clsx from 'clsx';
import HotelForm from '@/components/HotelForm';
import useSearchHotel from '@/hooks/useSearchHotel';
import useKey from '@/hooks/useKey';

export default function SearchHotel() {
	const {
		searchContent,
		setSearchContent,
		searchHotelActive,
		setSearchHotelActive,
	} = useSearchHotel();

	const handleClose = () => {
		setSearchHotelActive(false);
		setTimeout(() => {
			setSearchContent(null);
		}, 500);
	};

	useKey(handleClose);

	return (
		<div
			className={clsx('g-search-hotel cr-white', {
				'is-active': searchHotelActive,
			})}
			role="dialog"
			aria-label="Search Hotel"
			aria-modal={searchHotelActive}
		>
			<button
				className="g-search-hotel__overlay"
				aria-hidden="true"
				onClick={handleClose}
			/>
			<div className="g-search-hotel__content">
				<button className="g-search-hotel__close trigger" onClick={handleClose}>
					<div className="icon-close" />
				</button>
				<HotelForm data={searchContent} />
			</div>
		</div>
	);
}

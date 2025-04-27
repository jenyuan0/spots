import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';

export const useDotButton = (emblaApi, onButtonClick) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [scrollSnaps, setScrollSnaps] = useState([]);

	const onDotButtonClick = useCallback(
		(index) => {
			if (!emblaApi) return;
			emblaApi.scrollTo(index);
			if (onButtonClick) onButtonClick(emblaApi);
		},
		[emblaApi, onButtonClick]
	);

	const onInit = useCallback((emblaApi) => {
		setScrollSnaps(emblaApi.scrollSnapList());
	}, []);

	const onSelect = useCallback((emblaApi) => {
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		onInit(emblaApi);
		onSelect(emblaApi);

		emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
	}, [emblaApi, onInit, onSelect]);

	return {
		selectedIndex,
		scrollSnaps,
		onDotButtonClick,
	};
};

export const DotButton = ({ index, isSelected, ...props }) => (
	<button
		type="button"
		className={clsx('c-carousel__dot', {
			'is-selected': isSelected,
		})}
		aria-label={`Move to slide ${index + 1}`}
		{...props}
	/>
);

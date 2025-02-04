import React, { useCallback, useEffect, useState } from 'react';

export const usePrevNextButtons = (emblaApi) => {
	const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
	const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

	const onPrevButtonClick = useCallback(() => {
		if (!emblaApi) return;
		emblaApi.scrollPrev();
	}, [emblaApi]);

	const onNextButtonClick = useCallback(() => {
		if (!emblaApi) return;
		emblaApi.scrollNext();
	}, [emblaApi]);

	const onSelect = useCallback((emblaApi) => {
		setPrevBtnDisabled(!emblaApi.canScrollPrev());
		setNextBtnDisabled(!emblaApi.canScrollNext());
	}, []);

	useEffect(() => {
		if (!emblaApi) return;

		onSelect(emblaApi);
		emblaApi.on('reInit', onSelect).on('select', onSelect);
	}, [emblaApi, onSelect]);

	return {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	};
};

export const PrevButton = ({ ...props }) => (
	<button
		type="button"
		className="c-carousel__button c-carousel__button--prev"
		aria-label="Navigate to the previous slide"
		{...props}
	>
		<span className="icon-caret-left" />
	</button>
);

export const NextButton = ({ ...props }) => (
	<button
		type="button"
		className="c-carousel__button c-carousel__button--next"
		aria-label="Navigate to the next slide"
		{...props}
	>
		<div className="icon-caret-right" />
	</button>
);

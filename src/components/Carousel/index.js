import clsx from 'clsx';
import useEmblaCarousel from 'embla-carousel-react';
import AutoHeight from 'embla-carousel-auto-height';
import Autoplay from 'embla-carousel-autoplay';
import ClassNames from 'embla-carousel-class-names';
import Fade from 'embla-carousel-fade';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import React, { useCallback, useEffect, useState } from 'react';
import { PrevButton, NextButton, usePrevNextButtons } from './NavButtons';
import { DotButton, useDotButton } from './DotButton';

export default function Carousel({
	align = 'center',
	breakpoints = {},
	containScroll = 'trimSnaps',
	dragFree = false,
	gap = '0px',
	itemWidth = 100, // as %
	itemMinWidth = 0, // as px
	loop = true,
	slidesToScroll = 1,

	isShowNav = false,
	isShowDots = false,
	isFade = false,
	isAutoplay = false,
	autoplayInterval = 4000,
	isAutoHeight = true,
	children,
	className,
}) {
	const options = {
		align: isFade ? 'center' : align,
		breakpoints,
		containScroll: isFade ? false : containScroll,
		dragFree,
		loop,
		slidesToScroll,
		inViewThreshold: 1,
		skipSnaps: true,
	};
	const autoplayOptions = {
		stopOnInteraction: false,
		jump: isFade,
		delay: autoplayInterval,
	};
	const plugins = [
		ClassNames(),
		WheelGesturesPlugin(),
		...(isFade ? [Fade()] : []),
		...(isAutoplay ? [Autoplay(autoplayOptions)] : []),
		...(isAutoHeight ? [AutoHeight()] : []),
	];

	const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins);
	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi);
	const { selectedIndex, scrollSnaps, onDotButtonClick } =
		useDotButton(emblaApi);

	const [isSingleSlide, setIsSingleSlide] = useState(true);
	const [isDraggable, setIsDraggable] = useState(true);

	const updateDraggable = useCallback(() => {
		if (emblaApi.canScrollNext()) {
			setIsDraggable(true);
			emblaApi.reInit({ watchDrag: true });
		} else {
			setIsDraggable(false);
			emblaApi.reInit({ watchDrag: false });
		}
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;

		setIsSingleSlide(emblaApi.scrollSnapList().length <= 1);

		updateDraggable(emblaApi);

		emblaApi.on('resize', updateDraggable);
	}, [emblaApi, updateDraggable]);

	if (!children?.length > 0) return null;

	return (
		<div
			className={clsx('c-carousel', className)}
			style={{
				'--item-width': `${itemWidth}%`,
				'--item-min-width': `${itemMinWidth}px`,
				'--item-gap': gap,
			}}
		>
			<div
				ref={emblaRef}
				className={clsx('c-carousel__viewport', {
					'disable-draggable': !isDraggable,
				})}
			>
				<div className="c-carousel__container">{children}</div>
			</div>

			{(isShowDots || isShowNav) && !isSingleSlide && isDraggable && (
				<div className="c-carousel__controls c">
					{isShowDots && (
						<div className="c-carousel__dots">
							{scrollSnaps.map((_, index) => (
								<DotButton
									key={index}
									onClick={() => onDotButtonClick(index)}
									isSelected={index === selectedIndex}
								/>
							))}
						</div>
					)}

					{isShowNav && (
						<div className="c-carousel__buttons">
							<PrevButton
								onClick={onPrevButtonClick}
								disabled={prevBtnDisabled}
							/>
							<NextButton
								onClick={onNextButtonClick}
								disabled={nextBtnDisabled}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

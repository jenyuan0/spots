'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { colorArray, springConfig } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import clsx from 'clsx';

// Constants
const ANIMATION_CONFIG = {
	ROTATION_INTERVAL: 600,
	MASKS_INTERVAL: 6000,
	ROTATION_STEP: 15,
	SCROLL_OFFSET: ['-250px start', '-104px start'],
};

const useScrollAnimation = ({ ref, index = 0 }) => {
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ANIMATION_CONFIG.SCROLL_OFFSET,
	});

	const motionScale = useTransform(
		scrollYProgress,
		[0, 1],
		[1, 0.9 + 0.01 * index]
	);

	return 1;
	// return useSpring(motionScale, springConfig);
};

const WhyText = ({ data, color }) => {
	const { heading, paragraph, offers, cta } = data;

	return (
		<div className="p-home__why-block__text">
			<div className="p-home__why-block__text-container wysiwyg">
				<h2 className="p-home__why-block__heading t-b-1">{heading}</h2>
				<p className="p-home__why-block__paragraph t-h-2">{paragraph}</p>
				{offers && (
					<ul className="p-home__why-block__offers t-b-1">
						{offers?.map((item, index) => (
							<li key={`offer-${index}`}>{item}</li>
						))}
					</ul>
				)}
				{cta && (
					<Button
						className={clsx('btn-outline', `cr-${color}-d`)}
						link={cta.link}
						isNewTab={cta.isNewTab}
						caret="right"
					>
						{cta.label}
					</Button>
				)}
			</div>
		</div>
	);
};

const MasksBlock = ({ data, index, color }) => {
	const { masksHeading, masksParagraph, masksOffers, masksCta, masksImages } =
		data;
	const textData = {
		heading: masksHeading,
		paragraph: masksParagraph,
		offers: masksOffers,
		cta: masksCta,
	};
	const ref = useRef(null);
	const springScale = useScrollAnimation({ ref, index });
	const [activeIndices, setActiveIndices] = useState(Array(9).fill(0));

	useEffect(() => {
		const intervals = Array(9).fill(null);
		let isPageVisible = true;

		// Handle visibility change
		const handleVisibilityChange = () => {
			isPageVisible = document.visibilityState === 'visible';

			if (!isPageVisible) {
				// Clear intervals when page is hidden
				intervals.forEach((interval) => clearInterval(interval));
			} else {
				// Restart intervals when page becomes visible
				intervals.forEach((_, circleIndex) => {
					intervals[circleIndex] = setInterval(() => {
						setTimeout(() => {
							setActiveIndices((prev) => {
								const newIndices = [...prev];
								newIndices[circleIndex] =
									(prev[circleIndex] + 1) % masksImages.length;
								return newIndices;
							});
						}, circleIndex * 50);
					}, 5000);
				});
			}
		};

		// Set up initial intervals
		handleVisibilityChange();

		// Add visibility change listener
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			intervals.forEach((interval) => clearInterval(interval));
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [masksImages.length]);

	const renderMaskCircle = useCallback(
		(item, blockIndex) => (
			<div
				key={`item-${blockIndex}`}
				className="p-home__masks__circle"
				data-direction={blockIndex % 3}
			>
				{masksImages?.map((el, idx) => (
					<div
						key={idx}
						className={clsx('p-home__masks__img', {
							'is-active': idx === activeIndices[blockIndex],
							'is-prev':
								idx ===
								(activeIndices[blockIndex] === 0
									? masksImages.length - 1
									: activeIndices[blockIndex] - 1),
						})}
					>
						<Img image={el} />
					</div>
				))}
			</div>
		),
		[activeIndices, masksImages]
	);

	return (
		<motion.div
			ref={ref}
			className="p-home__why-block"
			style={{ scale: springScale, '--cr-primary': `var(--cr-${color}-d)` }}
		>
			<div className="p-home__why-block__media">
				<div className="p-home__masks">
					{Array.from({ length: 9 }).map((item, index) =>
						renderMaskCircle(item, index)
					)}
				</div>
			</div>
			<WhyText data={textData} color={color} />
		</motion.div>
	);
};

const ClockBlock = ({ data, index, color }) => {
	const { clockHeading, clockParagraph, clockOffers, clockCta, clockText } =
		data;
	const textData = {
		heading: clockHeading,
		paragraph: clockParagraph,
		offers: clockOffers,
		cta: clockCta,
	};
	const [state, setState] = useState({
		rotatingText: clockText[0].text || '',
		rotation: 0,
		color: colorArray()[0].toLowerCase(),
		textIndex: 0,
	});

	const ref = useRef(null);
	const springScale = useScrollAnimation({ ref, index });

	useEffect(() => {
		if (!clockText?.length) return;

		const interval = setInterval(() => {
			setState((prev) => ({
				textIndex: (prev.textIndex + 1) % clockText.length,
				rotatingText: clockText[prev.textIndex].text,
				rotation: (prev.rotation + ANIMATION_CONFIG.ROTATION_STEP) % 360,
				color:
					colorArray()[
						Math.floor(Math.random() * colorArray.length)
					].toLowerCase(),
			}));
		}, ANIMATION_CONFIG.ROTATION_INTERVAL);

		return () => clearInterval(interval);
	}, [clockText]);

	return (
		<div
			ref={ref}
			className="p-home__why-block"
			style={{
				scale: springScale,
				'--cr-primary': `var(--cr-${color}-d)`,
			}}
		>
			<div className="p-home__why-block__media">
				<div
					className="p-home__clock"
					style={{ '--cr-primary': `var(--cr-${state.color}-l)` }}
				>
					{clockText?.map((item, index) => {
						return (
							<div
								key={`clock-image-${index}`}
								className={clsx('p-home__clock__img', {
									'is-active': state.textIndex == index,
								})}
							>
								<div className="object-fit">
									{item.image && <Img image={item.image} />}
								</div>
							</div>
						);
					})}
					<div
						className="p-home__clock__center"
						style={{ transform: `rotate(${state.rotation}deg)` }}
					>
						<div className="p-home__clock__label">{state.rotatingText}</div>
					</div>
				</div>
			</div>
			<WhyText data={textData} color={color} />
		</div>
	);
};

const ToggleBlock = ({ data, index, color }) => {
	const { toggleHeading, toggleParagraph, toggleOffers, toggleCta } = data;
	const textData = {
		heading: toggleHeading,
		paragraph: toggleParagraph,
		offers: toggleOffers,
		cta: toggleCta,
	};
	const [toggle, setToggle] = useState(0);
	const [intervalId, setIntervalId] = useState(null);
	const ref = useRef(null);
	const springScale = useScrollAnimation({ ref, index });

	// Setup auto-toggle interval
	useEffect(() => {
		const id = setInterval(() => {
			setToggle((prev) => Number(!prev));
		}, 5000); // Toggle every 5 seconds

		setIntervalId(id);

		return () => clearInterval(id);
	}, []);

	const handleToggleClick = useCallback(() => {
		// Clear existing interval
		if (intervalId) {
			clearInterval(intervalId);
		}

		// Toggle state
		setToggle((prev) => Number(!prev));

		// Reset interval
		const newIntervalId = setInterval(() => {
			setToggle((prev) => Number(!prev));
		}, 4000);

		setIntervalId(newIntervalId);
	}, [intervalId]);

	return (
		<motion.div
			ref={ref}
			className="p-home__why-block"
			style={{ scale: springScale, '--cr-primary': `var(--cr-${color}-d)` }}
		>
			<div className="p-home__why-block__media">
				<button
					className="p-home__toggle"
					data-toggle={toggle}
					onClick={handleToggleClick}
					aria-label={toggle ? 'Switch to sun mode' : 'Switch to moon mode'}
				>
					<div className="p-home__toggle__sun">
						{Array.from({ length: 8 }).map((_, index) => (
							<div
								key={`sun-dec-${index}`}
								className="p-home__toggle__sun__dec"
								style={{ '--index': index }}
							/>
						))}
					</div>
					<div className="p-home__toggle__moon">
						{Array.from({ length: 2 }).map((_, index) => (
							<div
								key={`moon-dec-${index}`}
								className="p-home__toggle__moon__dec"
								style={{ '--index': index }}
							/>
						))}
					</div>
				</button>
			</div>
			<WhyText data={textData} color={color} />
		</motion.div>
	);
};

export default function WhySection({ data }) {
	return (
		<div className="p-home__why">
			<ClockBlock data={data} index={0} color={'red'} />
			<MasksBlock data={data} index={1} color={'blue'} />
			<ToggleBlock data={data} index={2} color={'purple'} />
		</div>
	);
}

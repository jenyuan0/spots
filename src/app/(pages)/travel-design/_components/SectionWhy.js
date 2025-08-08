'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { colorArray, getRandomInt, springConfig } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import clsx from 'clsx';

// Constants
const ANIMATION_CONFIG = {
	ROTATION_INTERVAL: 1600,
	MASKS_INTERVAL: 6000,
	ROTATION_STEP: 30,
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
		<div className="p-design__why-block__text">
			<div className="p-design__why-block__text-container wysiwyg">
				<h2 className="p-design__why-block__heading t-b-1">{heading}</h2>
				<p className="p-design__why-block__paragraph t-h-4">{paragraph}</p>
				{offers && (
					<ul className="p-design__why-block__offers t-b-1">
						{offers?.map((item, index) => (
							<li key={`offer-${index}`}>{item}</li>
						))}
					</ul>
				)}
				{cta?.link && cta?.label && (
					<Button
						className={clsx('btn-outline', `cr-${color}-d`)}
						href={cta.link.route}
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
	const [directions, setDirections] = useState(Array(9).fill(0));

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
							setDirections((prev) => {
								const newDirs = [...prev];
								newDirs[circleIndex] = Math.floor(Math.random() * 4);
								return newDirs;
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
				className="p-design__masks__circle"
				data-direction={directions[blockIndex] ?? 0}
			>
				{masksImages?.map((el, idx) => (
					<div
						key={idx}
						className={clsx('p-design__masks__img', {
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
		[activeIndices, masksImages, directions]
	);

	return (
		<motion.div
			ref={ref}
			className="p-design__why-block"
			style={{ scale: springScale, '--cr-primary': `var(--cr-${color}-d)` }}
		>
			<div className="p-design__why-block__media">
				<div className="p-design__masks">
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

	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const ref = useRef(null);
	const springScale = useScrollAnimation({ ref, index });

	const centerRef = useRef(null);
	const intervalRef = useRef(null);
	const timeoutsRef = useRef([]);
	const lastHandledRotationRef = useRef(0);
	const rotationRef = useRef(0);

	const updateTextAfterRotation = useCallback(() => {
		setState((prev) => {
			const nextIndex = (prev.textIndex + 1) % clockText.length;
			return {
				...prev,
				textIndex: nextIndex,
				rotatingText: clockText[nextIndex].text,
				color:
					colorArray()[
						Math.floor(Math.random() * colorArray.length)
					].toLowerCase(),
			};
		});
	}, [clockText]);

	const tick = useCallback(() => {
		let nextRotation = 0;
		setState((prev) => {
			nextRotation = prev.rotation + ANIMATION_CONFIG.ROTATION_STEP;
			rotationRef.current = nextRotation;
			return {
				...prev,
				rotation: nextRotation,
			};
		});

		const el = centerRef.current;
		if (!el) return;

		// Guard so text only updates once per rotation step
		const maybeUpdateText = () => {
			if (lastHandledRotationRef.current >= nextRotation) return; // already handled
			lastHandledRotationRef.current = nextRotation;
			updateTextAfterRotation();
		};

		let fired = false;
		const onEnd = (e) => {
			if (e.propertyName !== 'transform') return;
			fired = true;
			el.removeEventListener('transitionend', onEnd);
			maybeUpdateText();
		};

		el.addEventListener('transitionend', onEnd);

		// Fallback in case transitionend doesn't fire (e.g., user pref reduce-motion)
		const tid = setTimeout(() => {
			if (!fired) maybeUpdateText();
		}, 400);
		timeoutsRef.current.push(tid);
	}, [updateTextAfterRotation]);

	const startInterval = useCallback(() => {
		if (intervalRef.current) return;
		intervalRef.current = setInterval(tick, ANIMATION_CONFIG.ROTATION_INTERVAL);
	}, [tick]);

	const stopInterval = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		// Clear any pending timeouts
		timeoutsRef.current.forEach((t) => clearTimeout(t));
		timeoutsRef.current = [];
	}, []);

	// Track page visibility
	const [tabVisible, setTabVisible] = useState(
		typeof document === 'undefined' ? true : !document.hidden
	);
	useEffect(() => {
		const handleVisibility = () => setTabVisible(!document.hidden);
		document.addEventListener('visibilitychange', handleVisibility);
		return () =>
			document.removeEventListener('visibilitychange', handleVisibility);
	}, []);

	// Track in-viewport using IntersectionObserver
	const [inView, setInView] = useState(true);
	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const obs = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ root: null, threshold: 0.15 }
		);
		obs.observe(node);
		return () => obs.disconnect();
	}, []);

	useEffect(() => {
		if (clockText?.length && tabVisible && inView) {
			// align handled-rotation with current so we don't double-fire on resume
			lastHandledRotationRef.current = rotationRef.current;
			startInterval();
		} else {
			stopInterval();
		}

		return () => {
			stopInterval();
		};
	}, [clockText, tabVisible, inView, startInterval, stopInterval]);

	return (
		<div
			ref={ref}
			className="p-design__why-block"
			style={{
				scale: springScale,
				'--cr-primary': `var(--cr-${color}-d)`,
			}}
		>
			<div className="p-design__why-block__media">
				<div className="p-design__clock">
					{Array.from({ length: 12 }).map((_, i) => (
						<div
							key={`hour-line-${i}`}
							className="p-design__clock__hour-line"
							style={{
								transform: `translate3d(-50%, -50%, 0) rotate(${i * 30}deg)`,
							}}
						/>
					))}
					{/* {clockText?.map((item, index) => {
						return (
							<div
								key={`clock-image-${index}`}
								className={clsx('p-design__clock__img', {
									'is-active': state.textIndex == index,
								})}
							>
								<div className="object-fit">
									{item.image && <Img image={item.image} />}
								</div>
							</div>
						);
					})} */}
					<div
						ref={centerRef}
						className="p-design__clock__center"
						style={{
							transform: `translate3d(-50%, -50%, 0) rotate(${state.rotation}deg)`,
							'--cr-primary': isMounted ? `var(--cr-cream)` : undefined,
						}}
					>
						<div className="p-design__clock__label">{state.rotatingText}</div>
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
			className="p-design__why-block"
			style={{ scale: springScale, '--cr-primary': `var(--cr-${color}-d)` }}
		>
			<div className="p-design__why-block__media">
				<button
					className="p-design__toggle"
					data-toggle={toggle}
					onClick={handleToggleClick}
					aria-label={toggle ? 'Switch to sun mode' : 'Switch to moon mode'}
				>
					<div className="p-design__toggle__sun">
						{Array.from({ length: 8 }).map((_, index) => (
							<div
								key={`sun-dec-${index}`}
								className="p-design__toggle__sun__dec"
								style={{ '--index': index }}
							/>
						))}
					</div>
					<div className="p-design__toggle__moon">
						{Array.from({ length: 2 }).map((_, index) => (
							<div
								key={`moon-dec-${index}`}
								className="p-design__toggle__moon__dec"
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

export default function SectionWhy({ data }) {
	return (
		<section className="p-design__why">
			<ClockBlock data={data} index={0} color={'red'} />
			<MasksBlock data={data} index={1} color={'blue'} />
			<ToggleBlock data={data} index={2} color={'purple'} />
		</section>
	);
}

'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import { colorArray, getRandomInt, springConfig } from '@/lib/helpers';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import useMagnify from '@/hooks/useMagnify';
import useKey from '@/hooks/useKey';
import Link from '@/components/CustomLink';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

// Spot component for individual animated spots
function HeroSpot({ index, lastChild, data, scrollYProgress }) {
	const [spot, setSpot] = useState({
		x: 1000,
		y: 1000,
	});
	const [screen, setScreen] = useState({ x: 0, y: 0 });
	const setMag = useMagnify((state) => state.setMag);
	const { hasPressedKeys } = useKey();

	useEffect(() => {
		setSpot({
			x: data?.x,
			y: data?.y,
			slug: data.slug,
			color: data?.color,
			lightOrDark: index % 2 ? 'l' : 'd',
		});

		setScreen({
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
			height: window.innerHeight,
		});
	}, [data, lastChild]);

	// Create motion values outside of the render
	const motionX = useTransform(
		scrollYProgress,
		[
			0,
			...Array.from({ length: 5 }, () => getRandomInt(1, 1500) * 0.0001).sort(),
			0.151,
			0.3,
			0.8,
			1,
		],
		[
			spot.x,
			spot.x + getRandomInt(5, 25),
			spot.x - getRandomInt(5, 25),
			spot.x + getRandomInt(5, 25),
			spot.x - getRandomInt(5, 25),
			spot.x + getRandomInt(5, 25),
			screen.x,
			screen.x,
			screen.x,
			screen.x + (index % 2 === 0 ? 1 : -1) * getRandomInt(200, 400),
		]
	);
	const motionY = useTransform(
		scrollYProgress,
		[
			0,
			...Array.from({ length: 5 }, () => getRandomInt(1, 1500) * 0.0001).sort(),
			0.151,
			0.3,
			0.8,
			1,
		],
		[
			spot.y,
			spot.y + getRandomInt(5, 25),
			spot.y - getRandomInt(5, 25),
			spot.y + getRandomInt(5, 25),
			spot.y - getRandomInt(5, 25),
			spot.y + getRandomInt(5, 25),
			screen.height - getRandomInt(20, screen.height / 2),
			screen.height + 70,
			screen.height + 70,
			screen.height + (Math.random() * 800 - 200),
		]
	);
	const motionOpacity = useTransform(
		scrollYProgress,
		[0, 0.5, 0.9, getRandomInt(91, 99) * 0.01, 1],
		[1, 1, 1, 0, 0]
	);
	const motionScale = useTransform(
		scrollYProgress,
		[0, 0.15, 0.8, 1],
		[1, 0.2, lastChild ? 0.24 : 0.2, 0.2]
	);

	const springX = useSpring(motionX, springConfig);
	const springY = useSpring(motionY, springConfig);
	const springScale = useSpring(motionScale, springConfig);

	if (spot.slug) {
		return (
			<motion.div
				className={'p-home__spot'}
				style={{
					'--cr-primary': `var(--cr-${spot.color}-${spot.lightOrDark})`,
					x: springX,
					y: springY,
					scale: springScale,
					opacity: motionOpacity,
				}}
			>
				<Link
					className={'p-home__spot__link'}
					href={`/locations/${spot.slug}`}
					{...(!hasPressedKeys && {
						onClick: (e) => {
							e.preventDefault();
							setMag({
								slug: spot.slug,
								type: 'location',
								color: spot.color,
							});
						},
					})}
				/>
			</motion.div>
		);
	}
}

export function Hero({ data }) {
	const { heroHeading, heroImage, heroSpots } = data || {};
	const heroRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});
	const [spots, setSpots] = useState([]);
	const [isNudgeActive, setIsNudgeActive] = useState(true);

	useEffect(() => {
		const scroll = scrollYProgress.onChange((value) => {
			setIsNudgeActive(value >= 0.15 ? false : true);
		});

		return () => scroll();
	}, [scrollYProgress]);

	// Function to check for overlaps
	const checkOverlap = (x, y, existingPositions) => {
		const minDistance = innerWidth * 0.05;
		const centerY = window.innerHeight / 2;
		const isCenterArea = y > centerY - 100 && y < centerY + 100;
		const hasOverlap = existingPositions.some((pos) => {
			const dx = pos.x - x;
			const dy = pos.y - y;
			return Math.sqrt(dx * dx + dy * dy) < minDistance;
		});

		return hasOverlap || isCenterArea;
	};

	// Generate all spots first
	useEffect(() => {
		const generateSpots = () => {
			const paddingX = Math.min(window.innerWidth * 0.15, 400);
			const paddingY = Math.max(window.innerHeight * 0.2, 100);
			const newPositions = [];

			heroSpots?.forEach(() => {
				let validPosition = false;
				let attempts = 0;
				let x, y;

				while (!validPosition && attempts < 25) {
					const color = colorArray()[0];
					x = Math.random() * (window.innerWidth - paddingX * 2) + paddingX;
					y =
						Math.random() * (window.innerHeight - paddingY * 2) + paddingY / 2;

					if (!checkOverlap(x, y, newPositions)) {
						validPosition = true;
						newPositions.push({ x, y, color });
						document.documentElement.style.setProperty(
							'--cr-primary',
							`var(--cr-${color || 'green'}-d)`
						);
					}
					attempts++;
				}
			});

			setSpots(newPositions);
		};

		generateSpots();
		window.addEventListener('resize', generateSpots);

		return () => window.removeEventListener('resize', generateSpots);
	}, [heroSpots]);

	// Use useMemo to prevent re-renders
	const spotElements = useMemo(() => {
		return heroSpots && spots.length
			? heroSpots.map((el, i) => {
					return (
						<HeroSpot
							key={`spot-${i}`}
							index={i}
							lastChild={i === heroSpots.length - 1}
							data={{
								...el,
								color: spots[i]?.color,
								x: spots[i]?.x,
								y: spots[i]?.y,
							}}
							scrollYProgress={scrollYProgress}
						/>
					);
				})
			: null;
	}, [heroSpots, spots, scrollYProgress]);

	return (
		<section ref={heroRef} className="p-home__hero">
			<div className="p-home__hero__image p-fill">
				<span className="object-fit">
					{heroImage && <Img image={heroImage} />}
				</span>
			</div>
			{spotElements}
			{heroHeading && (
				<h1 className="p-home__hero__heading t-h-1">
					<CustomPortableText blocks={heroHeading} hasPTag={false} />
				</h1>
			)}
			<div
				className={clsx('p-home__hero__nudge', { 'is-active': isNudgeActive })}
			>
				{Array(3)
					.fill(null)
					.map((_, i) => (
						<div
							key={`hero-nudge-dot-${i}`}
							style={{ '--index': i }}
							className="p-home__hero__nudge-dot"
						/>
					))}
			</div>
		</section>
	);
}

// Separate component for highlights to avoid hook issues
const HighlightItem = ({ scrollYProgress, index, springConfig, el }) => {
	const opacityTransform = useTransform(
		scrollYProgress,
		[0, 0.2 + index * 0.2],
		[0, 1]
	);
	const rotateTransform = useTransform(
		scrollYProgress,
		[0, 0.2 + index * 0.2],
		[0, '360deg * 0.3']
	);

	const opacity = useSpring(opacityTransform, springConfig);
	const rotate = useSpring(rotateTransform, springConfig);

	return (
		<motion.div
			key={index}
			className="p-home__highlights__item"
			initial={{ opacity: 0, rotate: '-10deg' }}
			style={{
				opacity,
				rotate,
			}}
		>
			<div className="p-home__highlights__rotate p-fill">
				<span className="object-fit">
					<Img image={el} />
				</span>
			</div>
		</motion.div>
	);
};

function Highlights({ highlights }) {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['25% 50%', 'end end'],
	});

	return (
		<section ref={ref} className="p-home__highlights g g-3">
			{highlights?.map((el, index) => (
				<HighlightItem
					key={index}
					scrollYProgress={scrollYProgress}
					index={index}
					springConfig={springConfig}
					el={el}
				/>
			))}
		</section>
	);
}

export default function PageHome({ data }) {
	const { introTitle, introHeading, introCta, highlights } = data || {};

	return (
		<>
			<Hero data={data} />

			<section className="p-home__intro wysiwyg">
				{introTitle && (
					<h2 className="p-home__intro__title t-l-1">{introTitle}</h2>
				)}
				{introHeading && (
					<p className="t-h-2">
						<CustomPortableText blocks={introHeading} hasPTag={false} />
					</p>
				)}
				{introCta && (
					<Link link={introCta?.link} isNewTab={introCta?.isNewTab}>
						{introCta.label}
					</Link>
				)}
			</section>

			<Highlights highlights={highlights} />

			<section className="p-home__hiw"></section>
		</>
	);
}

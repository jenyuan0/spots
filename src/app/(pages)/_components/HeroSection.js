'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import { getRandomInt, springConfig } from '@/lib/helpers';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import LocationDot from '@/components/LocationDot';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

// Spot component for individual animated spots
function HeroSpot({ index, data, boundary, isLastChild, scrollYProgress }) {
	const [spot, setSpot] = useState({
		x: 1000,
		y: 1000,
	});
	const [screen, setScreen] = useState({ x: 0, y: 0 });

	useEffect(() => {
		setSpot({
			x: data?.x,
			y: data?.y,
		});
		setScreen({
			x: boundary.width / 2,
			y: boundary.height / 2,
			height: boundary.height,
		});
	}, [data]);

	// Create motion values outside of the render
	const motionX = useTransform(
		scrollYProgress,
		[
			0,
			...Array.from({ length: 5 }, () => getRandomInt(1, 1500) * 0.0001).sort(),
			0.151,
			0.3,
			0.85,
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
			0.85,
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
		[1, 0.2, isLastChild ? 0.24 : 0.2, 0.2]
	);

	const springX = useSpring(motionX, springConfig);
	const springY = useSpring(motionY, springConfig);
	const springScale = useSpring(motionScale, springConfig);

	if (!data) return null;

	return (
		<motion.div
			className={'p-home__hero__spot'}
			style={{
				x: springX,
				y: springY,
				scale: springScale,
				opacity: motionOpacity,
			}}
		>
			<LocationDot data={data} initialLightOrDark={isLastChild && 'd'} />
		</motion.div>
	);
}

export default function HeroSection({ data, setPrimaryColor }) {
	const { heroHeading, heroImage, heroSpots } = data || {};
	const heroRef = useRef(null);
	const [boundary, setBoundary] = useState({
		width: 0,
		height: 0,
	});
	const [spots, setSpots] = useState([]);
	const [isNudgeActive, setIsNudgeActive] = useState(true);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});

	useEffect(() => {
		const scroll = scrollYProgress.onChange((value) => {
			setIsNudgeActive(value >= 0.15 ? false : true);
		});

		return () => scroll();
	}, [scrollYProgress]);

	useEffect(() => {
		setBoundary({
			width: heroRef.current.getBoundingClientRect().width,
			height: heroRef.current.getBoundingClientRect().height,
		});
	}, [heroRef]);

	// Function to check for overlaps
	const checkOverlap = (x, y, existingPositions) => {
		const minDistance = boundary.width * 0.05;
		const centerY = boundary.height / 2;
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
			const paddingX = Math.min(boundary.width * 0.1, 150);
			const paddingY = Math.max(boundary.height * 0.1, 150);
			const newPositions = [];

			heroSpots?.forEach(() => {
				let validPosition = false;
				let attempts = 0;
				let x, y;

				while (!validPosition && attempts < 25) {
					x = Math.random() * (boundary.width - paddingX * 2) + paddingX;
					y = Math.random() * (boundary.height - paddingY * 2) + paddingY / 2;

					if (!checkOverlap(x, y, newPositions)) {
						validPosition = true;
						newPositions.push({ x, y });
					}
					attempts++;
				}
			});

			setSpots(newPositions);
		};

		generateSpots();
		window.addEventListener('resize', generateSpots);

		return () => window.removeEventListener('resize', generateSpots);
	}, [heroSpots, boundary]);

	useEffect(() => {
		const lastSpot = heroSpots[heroSpots.length - 1];
		setPrimaryColor(lastSpot?.color);
	});

	// Use useMemo to prevent re-renders
	const spotElements = useMemo(() => {
		return heroSpots && spots.length
			? heroSpots.map((el, i) => {
					return (
						<HeroSpot
							key={`spot-${i}`}
							index={i}
							boundary={boundary}
							data={{
								...el,
								x: spots[i]?.x,
								y: spots[i]?.y,
							}}
							isLastChild={i === heroSpots.length - 1}
							scrollYProgress={scrollYProgress}
						/>
					);
				})
			: null;
	}, [heroSpots, spots, scrollYProgress]);

	const motionScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
	const springScale = useSpring(motionScale, springConfig);

	return (
		<section ref={heroRef} className="p-home__hero">
			<motion.div
				className={'p-home__hero__image p-fill'}
				style={{
					scale: springScale,
				}}
			>
				<div className="object-fit">
					{heroImage && <Img image={heroImage} />}
				</div>
			</motion.div>
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

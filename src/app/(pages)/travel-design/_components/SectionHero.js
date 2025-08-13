'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import LocationDot from '@/components/LocationDot';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { getRandomInt, springConfig } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';

// Spot component for individual animated spots
function HeroSpot({ index, data, boundary, isLastChild, scrollYProgress }) {
	const { isMobileScreen, width, height } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const [spot, setSpot] = useState({
		x: width / 2,
		y: height / 2,
	});
	const [screen, setScreen] = useState({ x: 0, y: 0 });
	const config = {
		yLast: !isMounted || !isMobileScreen ? 70 : 20,
		scaleMin: !isMounted || !isMobileScreen ? 0.2 : 0.5,
	};

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
			screen.x + getRandomInt(screen.x / -1.2, screen.x / 1.2),
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
			screen.height + config.yLast,
			screen.height + config.yLast,
			screen.height + getRandomInt(screen.height / -4, screen.height / 4),
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
		[
			1,
			config.scaleMin,
			isLastChild ? config.scaleMin * 1.1 : config.scaleMin,
			config.scaleMin,
		]
	);
	const springX = useSpring(motionX, springConfig);
	const springY = useSpring(motionY, springConfig);
	const springScale = useSpring(motionScale, springConfig);

	if (!data) return null;

	return (
		<motion.div
			className={'p-design__hero__spot'}
			style={{
				x: springX,
				y: springY,
				scale: springScale,
				opacity: spot.x > 0 ? motionOpacity : 0,
			}}
		>
			<LocationDot data={data} initialLightOrDark={isLastChild && 'd'} />
		</motion.div>
	);
}

export default function SectionHero({ data }) {
	const { heroHeading, heroSubheading, heroImage, heroVideo, heroSpots } =
		data || {};
	const [isVideoActive, setIsVideoActive] = useState(false);
	const videoRef = useRef(null);
	const ref = useRef(null);
	const [boundary, setBoundary] = useState({
		width: 0,
		height: 0,
	});
	const [spots, setSpots] = useState([]);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start start', 'end start'],
	});
	const { isMobileScreen } = useWindowDimensions();

	useEffect(() => {
		const handleResize = () => {
			setBoundary({
				width: ref.current.getBoundingClientRect().width,
				height: ref.current.getBoundingClientRect().height,
			});
		};

		handleResize(); // Initial measurement
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [ref]);

	useEffect(() => {
		if (!heroVideo?.url || !videoRef.current) return;
		// Try to play programmatically to detect autoplay availability
		const v = videoRef.current;
		const tryPlay = async () => {
			try {
				await v.play();
				// onPlay will set isVideoActive
			} catch (e) {
				// Autoplay blocked (e.g., iOS Low Power Mode). Keep image visible.
			}
		};
		tryPlay();
	}, [heroVideo?.url]);

	// Function to check for overlaps
	const checkOverlap = (x, y, existingPositions) => {
		const minDistance = !isMobileScreen ? 150 : 50;
		const centerY = boundary.height / 2;
		const isCenterArea = y > centerY - 150 && y < centerY + 150;
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
			const paddingX = boundary.width * 0.1;
			const paddingY = boundary.height * 0.1;
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

	return (
		<section ref={ref} className="p-design__hero">
			<motion.div className={'p-design__hero__image p-fill'}>
				<div className="object-fit">
					{heroImage && !isVideoActive && <Img image={heroImage} />}
					{heroVideo?.url && (
						<video
							ref={videoRef}
							src={heroVideo.url}
							muted
							playsInline
							loop
							preload="metadata"
							onPlay={() => setIsVideoActive(true)}
							style={{
								visibility: isVideoActive,
							}}
						/>
					)}
				</div>
			</motion.div>
			{spotElements}
			<div className="p-design__hero__text wysiwyg">
				{heroHeading && (
					<h1 className="p-design__hero__heading t-h-1">
						<CustomPortableText blocks={heroHeading} hasPTag={false} />
					</h1>
				)}
				{heroSubheading && (
					<h2 className="p-design__hero__subheading t-h-3">{heroSubheading}</h2>
				)}
			</div>
		</section>
	);
}

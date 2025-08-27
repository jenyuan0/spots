'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import LocationDot from '@/components/LocationDot';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { getRandomInt, springConfig } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';

// Spot component for individual animated spots
function HeroSpot({ data, isLastChild, progress }) {
	const { isMobileScreen, width, height } = useWindowDimensions();
	const scaleMin = isMobileScreen ? 0.5 : 0.35;
	const screenX = width / 2;
	const screenY = (isMobileScreen ? width : height) / 2;

	// Use the passed MotionValue progress directly
	const motionX = useTransform(
		progress,
		[0, 1],
		[screenX, screenX + getRandomInt(screenX * -1.2, screenX * 1.2)]
	);
	const motionY = useTransform(
		progress,
		[0, 1],
		[0, getRandomInt(screenY * -1.2, screenY * 1.2)]
	);
	const motionOpacity = useTransform(progress, [0, 0.8, 1], [1, 1, 0]);
	const motionScale = useTransform(
		progress,
		[0, 0.8, 1],
		[scaleMin, scaleMin * (isLastChild ? 1.1 : 1), 1]
	);
	const springX = useSpring(motionX, springConfig);
	const springY = useSpring(motionY, springConfig);
	const springScale = useSpring(motionScale, springConfig);

	if (!data) return null;

	return (
		<motion.div
			className={'p-design__spots__spot'}
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

export default function SectionSpots({ data }) {
	const { heroSpots } = data || {};
	const ref = useRef(null);
	const progress = useMotionValue(0);
	const [isMounted, setIsMounted] = useState(false);
	const [viewportHeight, setViewportHeight] = useState(false);

	useEffect(() => {
		setViewportHeight(window.innerHeight);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			if (!isMounted) return 0;

			const rect = ref.current.getBoundingClientRect();
			const startTrigger = viewportHeight * 0.5; // middle of screen
			const endTrigger = 0; // top of screen
			const total = startTrigger - endTrigger;
			const current = startTrigger - rect.top;
			progress.set(Math.min(Math.max(current / total, 0), 1));
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	}, [ref, isMounted, progress]);

	// Use useMemo to prevent re-renders
	const spotElements = useMemo(() => {
		return heroSpots.map((el, i) => (
			<HeroSpot
				key={`spot-${i}`}
				data={el}
				isLastChild={i === heroSpots.length - 1}
				progress={progress}
			/>
		));
	}, [heroSpots, progress]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return false;

	return (
		<section ref={ref} className="p-design__spots">
			{spotElements}
		</section>
	);
}

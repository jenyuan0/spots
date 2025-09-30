'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import LocationDot from '@/components/LocationDot';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { springConfig } from '@/lib/helpers';

// Spot component for individual animated spots
function HeroSpot({ data, index, totalChild, isLastChild, progress }) {
	const scaleMin = 0.5;
	const motionY = useTransform(
		progress,
		[0, index * 0.02, 1],
		[0, 0, 500 + (index + 1) * 20]
	);
	const angle = 180 + index * (360 / totalChild);
	const motionOpacity = useTransform(
		progress,
		[0, 0.1, 0.15, 0.2, 1],
		[isLastChild ? 1 : 0, isLastChild ? 1 : 0, 1, 1, 0]
	);
	const motionScale = useTransform(
		progress,
		[0, 0.4, 1],
		[scaleMin, scaleMin * (isLastChild ? 1.1 : 1), 1]
	);
	const springY = useSpring(motionY, springConfig);
	const springScale = useSpring(motionScale, springConfig);

	if (!data) return null;
	console.log(index * 30);
	return (
		<div
			className={'p-design__spots__spot'}
			style={{
				rotate: `${angle}deg`,
			}}
		>
			<motion.div
				style={{
					y: springY,
					scale: springScale,
					opacity: motionOpacity,
				}}
			>
				<LocationDot data={data} initialLightOrDark={isLastChild && 'd'} />
			</motion.div>
		</div>
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
				index={i}
				totalChild={heroSpots.length}
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

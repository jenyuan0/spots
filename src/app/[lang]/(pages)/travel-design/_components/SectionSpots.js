'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import LocationDot from '@/components/LocationDot';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { springConfig } from '@/lib/helpers';

// Spot component for individual animated spots
function HeroSpot({ data, index, totalChild, isLastChild, progress }) {
	const motionY = useTransform(
		progress,
		[0, index * 0.01, 0.25, 1],
		[0, 0, 180, 150]
	);
	const motionOpacity = useTransform(
		progress,
		[0, 0.15, 0.25, 1],
		[0, 0, 1, 1]
	);
	const angle = 180 + index * (360 / totalChild);
	const motionAngle = useTransform(progress, [0, 1], [angle, angle + 360]);
	const springY = useSpring(motionY, springConfig);

	if (!data) return null;

	return (
		<motion.div
			className={'p-design__spots__spot'}
			style={{
				rotate: motionAngle,
				scale: 0.5,
			}}
		>
			<motion.div
				style={{
					y: springY,
					opacity: motionOpacity,
				}}
			>
				<LocationDot data={data} initialLightOrDark={isLastChild && 'd'} />
			</motion.div>
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
		let rafId = null;

		const update = () => {
			rafId = null;
			if (!isMounted || !ref.current || !viewportHeight) return;

			const rect = ref.current.getBoundingClientRect();
			const startTrigger = viewportHeight; // bottom of viewport
			const endTrigger = 0; // top of viewport
			const total = startTrigger - endTrigger;
			const current = startTrigger - rect.top;
			const totalScroll = Math.min(Math.max(current / total, 0), 1);
			progress.set(totalScroll);
		};

		const handleScroll = () => {
			if (rafId) return;
			rafId = window.requestAnimationFrame(update);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			if (rafId) window.cancelAnimationFrame(rafId);
		};
	}, [isMounted, viewportHeight, progress]);

	const motionRotate = useTransform(progress, [0, 0.28, 1], [0, 0, 360 * 0.5]);
	const springRotate = useSpring(motionRotate, springConfig);

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

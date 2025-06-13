'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Button from '@/components/Button';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { springConfig } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';

function SpotsColumns({ data, index, scrollYProgress }) {
	const motionY = useTransform(scrollYProgress, [0, 1], [0, 200]);
	const springY = useSpring(motionY, springConfig);
	const columnYTransform = useTransform(springY, (val) =>
		index % 2 === 0 ? -val : val
	);

	return (
		<motion.div
			className="p-booking__hero__column"
			style={{ y: columnYTransform }}
		>
			{data.map((el, index) => (
				<div
					key={index}
					className="p-booking__hero__spot c-card"
					data-layout="vertical-2"
				>
					<div className="c-card__thumb" />
				</div>
			))}
		</motion.div>
	);
}

export default function SectionHero({ data }) {
	const { heroSpots } = data;
	const ref = useRef(null);
	const { width, height } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const columnCount = useMemo(
		() => Math.min(3, Math.max(1, isMounted ? Math.floor(width / 400) : 3)),
		[width, isMounted]
	);
	const columnArray = useMemo(() => {
		const limitedSpots = heroSpots.slice(0, 16);
		return Array.from({ length: columnCount }, (_, i) =>
			limitedSpots.filter((_, index) => index % columnCount === i)
		);
	}, [heroSpots, columnCount]);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start start', 'end start'],
	});
	const motionY = useTransform(scrollYProgress, [0, 1], [0, height / 1.5]);

	if (!data) return null;

	return (
		<motion.section
			ref={ref}
			className="p-booking__hero"
			style={{ y: motionY }}
		>
			<div className="p-booking__hero__content wysiwyg">
				<h1 className="t-h-1">Hotel with Perks. Spots with personality.</h1>
				<p className="t-h-4">
					Your concierge service for deal finding and cool hunting
				</p>
				<Button className={'btn cr-green-l'} href={'#link'} caret="right">
					Run Free Search
				</Button>
			</div>
			<div className="p-booking__hero__spots">
				{columnArray.map((spots, index) => (
					<SpotsColumns
						data={spots}
						key={index}
						index={index}
						scrollYProgress={scrollYProgress}
					/>
				))}
			</div>
		</motion.section>
	);
}

'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import LocationCard from '@/components/LocationCard';
import useSearchHotel from '@/hooks/useSearchHotel';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { springConfig } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';

function SpotsColumns({
	data,
	index,
	scrollYProgress,
	isMounted,
	isTabletScreen,
}) {
	const motionY = useTransform(scrollYProgress, [0, 1], [0, 200]);
	const springY = useSpring(motionY, springConfig);
	const columnYTransform = useTransform(
		springY,
		(val) => (index % 2 === 0 ? -val : val * 0.8) * index
	);

	return (
		<motion.div
			className="p-booking__hero__column"
			style={{ y: columnYTransform }}
		>
			{data.map((el, index) => {
				const key = `${el._id || index}-${index}`;
				return (
					<LocationCard
						key={key}
						data={el}
						layout={
							!isMounted || isTabletScreen ? 'horizontal-1' : 'vertical-2'
						}
						aria-label={`Location card ${index + 1}`}
					/>
				);
			})}
		</motion.div>
	);
}

export default function SectionHero({ data }) {
	const { heroHeading, heroSubheading, heroSpots } = data;
	const { setSearchHotelActive } = useSearchHotel();
	const ref = useRef(null);
	const { isTabletScreen, width, height } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const columnCount = useMemo(
		() =>
			Math.min(4, Math.max(1, isMounted ? Math.floor((width - 800) / 300) : 4)),
		[width, isMounted]
	);

	const [shuffledColumns, setShuffledColumns] = useState([]);

	useEffect(() => {
		if (!heroSpots || heroSpots.length === 0) return;

		const shuffled = [...heroSpots];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}

		const limited = shuffled.slice(0, 16);
		const columns = Array.from({ length: columnCount }, (_, i) =>
			limited.filter((_, index) => index % columnCount === i)
		);
		setShuffledColumns(columns);
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
				{heroHeading && (
					<h1 className="t-h-1">
						<CustomPortableText blocks={heroHeading} hasPTag={false} />
					</h1>
				)}
				{heroSubheading && <p className="t-h-4">{heroSubheading}</p>}
				<Button
					className={'btn cr-green-l'}
					caret="right"
					onClick={() => setSearchHotelActive(true)}
				>
					Start Your Search
				</Button>
				{/* <p>No fees. No catch. We’re paid by the hotels — not by you.</p> */}
			</div>
			<div className="p-booking__hero__spots">
				{shuffledColumns.map((spots, index) => (
					<SpotsColumns
						data={spots}
						key={index}
						index={index}
						scrollYProgress={scrollYProgress}
						isMounted={isMounted}
						isTabletScreen={isTabletScreen}
					/>
				))}
			</div>
		</motion.section>
	);
}

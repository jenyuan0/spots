'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import Carousel from '@/components/Carousel';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';
import LocationCard from '@/components/LocationCard';
import usePlanner from '@/hooks/usePlanner';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { springConfig } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';

function SpotsColumns({ data, index, scrollYProgress }) {
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
				return <LocationCard key={key} data={el} layout={'vertical-2'} />;
			})}
		</motion.div>
	);
}

export default function SectionHero({ data, localization }) {
	const { heroHeading, heroSubheading, heroCta, heroSpots } = data;
	const { travelDesign, searchHotel, scrollToExplore } = localization || {};
	const { setPlannerActive } = usePlanner();
	const ref = useRef(null);
	const { isSmScreen, height } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);
	const columnsRef = useRef(null);
	const [columnsWidth, setColumnsWidth] = useState();
	const [shuffledColumns, setShuffledColumns] = useState([]);
	const [isHidden, setIsHidden] = useState(false);

	useEffect(() => {
		function handleResize() {
			if (columnsRef.current) {
				setColumnsWidth(columnsRef.current.offsetWidth || 0);
			}
		}

		setIsMounted(true);
		requestAnimationFrame(handleResize);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const columnCount = useMemo(() => {
		if (!isMounted || isSmScreen || !columnsWidth) return 1;
		return Math.max(1, Math.min(4, Math.floor(columnsWidth / 300)));
	}, [columnsWidth, isMounted, isSmScreen]);

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
		offset: ['start start', '120% start'],
	});
	const motionY = useTransform(scrollYProgress, [0, 1], [0, height / 1.5]);

	useEffect(() => {
		const unsubscribe = scrollYProgress.onChange((v) => {
			setIsHidden(v >= 1);
		});
		return () => unsubscribe();
	}, [scrollYProgress]);

	if (!data) return null;

	return (
		<motion.section
			ref={ref}
			className="p-booking__hero"
			style={{
				y: isMounted && isSmScreen ? 0 : motionY,
				visibility: isHidden ? 'hidden' : 'visible',
			}}
		>
			<div className="p-booking__hero__text">
				<div className="p-booking__hero__content wysiwyg">
					{heroHeading && (
						<h1 className="t-h-1">
							<CustomPortableText blocks={heroHeading} hasPTag={false} />
						</h1>
					)}
					{heroSubheading && <p className="t-h-4">{heroSubheading}</p>}
					{/* <Button className="btn-outline cr-green-l" href="/travel-design">
						{travelDesign || 'Travel Design'}
					</Button> */}
					{heroCta && (
						<Button
							className={'btn cr-green-l js-gtm-booking-popup'}
							caret="right"
							onClick={() => setPlannerActive(true)}
						>
							{heroCta}
						</Button>
					)}
				</div>
				<div className={'p-booking__hero__scroll t-l-1'}>
					{scrollToExplore || 'Scroll to Explore'}
				</div>
			</div>
			{isMounted &&
				(isSmScreen ? (
					<Carousel
						itemWidth="Max(24vw, 200px)"
						gap={'5px'}
						isAutoScroll={true}
						isAutoplay={true}
						autoplayInterval={2000}
					>
						{shuffledColumns[0]?.map((el, index) => {
							const key = `${el._id || index}-${index}`;
							return <LocationCard key={key} data={el} layout={'vertical-2'} />;
						})}
					</Carousel>
				) : (
					<div
						className="p-booking__hero__spots"
						tabIndex={-1}
						ref={columnsRef}
					>
						{shuffledColumns.map((spots, index) => (
							<SpotsColumns
								data={spots}
								key={index}
								index={index}
								scrollYProgress={scrollYProgress}
							/>
						))}
					</div>
				))}
		</motion.section>
	);
}

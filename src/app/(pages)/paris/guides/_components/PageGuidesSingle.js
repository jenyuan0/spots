'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
	hasArrayValue,
	springConfig,
	scrollEnable,
	scrollDisable,
} from '@/lib/helpers';
import { format } from 'date-fns';
import Img from '@/components/Image';
import Button from '@/components/Button';
import CustomPortableText from '@/components/CustomPortableText';
import useAsideMap from '@/hooks/useAsideMap';
import Breadcrumb from '@/components/Breadcrumb';
import GuideCard from '@/components/GuideCard';
import ItineraryCard from '@/components/ItineraryCard';
import CategoryPillList from '@/components/CategoryPillList';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useWindowDimensions from '@/hooks/useWindowDimensions';

function Excerpt({ data }) {
	const { excerpt } = data;

	return (
		excerpt && (
			<div className="p-guide__content">
				<div className="p-guide__content__sidebar">
					<div className="t-l-1">Intro</div>
				</div>
				<div className="p-guide__content__content">
					<p
						className={clsx('p-guide__excerpt', {
							't-h-2': excerpt.split(' ').length <= 50,
							't-h-3': excerpt.split(' ').length > 50,
						})}
					>
						{excerpt}
					</p>
				</div>
				<div className="p-guide__content__sidebar" />
			</div>
		)
	);
}

function Itineraries({ data, isInView }) {
	const { itineraries } = data;
	const [isOpen, setIsOpen] = useState(false);
	return (
		itineraries?.length > 0 && (
			<section
				className={clsx('p-guide__itineraries', {
					'is-open': isOpen,
					'is-in-view': isInView,
				})}
			>
				<Button
					className="p-guide__itineraries__toggle"
					onClick={() => {
						setIsOpen(!isOpen);
						isOpen ? scrollEnable() : scrollDisable();
					}}
				>
					<div className="btn-underline cr-green-d">
						{!isOpen ? 'View recommended itineraries' : 'Close Itineraries'}
					</div>
				</Button>
				{itineraries.map((itinerary) => (
					<ItineraryCard key={itinerary._id} data={itinerary} />
				))}
			</section>
		)
	);
}

function Related({ data }) {
	const { related, defaultRelated, colorHex } = data;
	const allItems = [...(related || []), ...(defaultRelated || [])];
	return (
		allItems.length > 0 && (
			<section
				className="p-guide__related"
				style={{ '--cr-primary': colorHex }}
			>
				<div className="p-guide__content">
					<div className="p-guide__content__sidebar">
						<h2 className="t-l-1">Continue Reading</h2>
					</div>
					<div className="p-guide__content__content wysiwyg-page">
						<ResponsiveGrid className="p-guide__related__list">
							{[...Array(4)].map((_, index) => {
								const item = allItems[index];
								return (
									item && (
										<GuideCard
											key={item._id}
											data={item}
											layout="horizontal-1"
										/>
									)
								);
							})}
						</ResponsiveGrid>
					</div>
					<div className="p-guide__content__sidebar" />
				</div>
			</section>
		)
	);
}

const PageGuidesSingle = ({ data = {} }) => {
	const {
		title,
		thumb,
		publishDate,
		colorHex,
		categories = [],
		subcategories,
		showMap,
		content,
	} = data;
	const breadcrumb = [
		{ title: 'Paris', url: '/paris' },
		{ title: 'Guides', url: '/paris/guides' },
		...(categories[0]
			? [
					{
						title: categories[0].title,
						url: `/paris/locations/category/${categories[0].slug}`,
					},
				]
			: []),
	];
	const heroRef = useRef(null);
	const [bodyRef, inView] = useInView({
		rootMargin: '-100% 0% 0% 0%',
	});
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});
	const springScale = useSpring(
		useTransform(scrollYProgress, [0, 1], [1, 0.3]),
		springConfig
	);
	const { isTabletScreen } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// const { setAsideMapActive, setAsideMapLocations } = useAsideMap();
	// useEffect(() => {
	// 	const getLocations = () => {
	// 		const locationLists =
	// 			content
	// 				?.filter((item) => item._type === 'locationList')
	// 				?.reduce(
	// 					(acc, curr) =>
	// 						curr?.locations ? [...acc, ...curr.locations] : acc,
	// 					[]
	// 				) || [];

	// 		const singleLocations =
	// 			content
	// 				?.filter((item) => item._type === 'locationSingle')
	// 				?.map((item) => item.location)
	// 				?.filter(Boolean) || [];

	// 		return [...locationLists, ...singleLocations].filter(
	// 			(location, index, self) =>
	// 				self.findIndex(
	// 					(l) => JSON.stringify(l) === JSON.stringify(location)
	// 				) === index
	// 		);
	// 	};

	// 	const locations = getLocations();

	// 	// Small timeout to ensure DOM is ready
	// 	requestAnimationFrame(() => {
	// 		setAsideMapLocations(locations);
	// 		setAsideMapActive(locations.length && showMap);
	// 	});
	// }, [content, showMap, setAsideMapActive, setAsideMapLocations]);

	return (
		<>
			<section
				ref={heroRef}
				className="p-guide__hero"
				style={{ '--cr-primary': colorHex }}
			>
				<div className="p-guide__hero__text wysiwyg">
					<Breadcrumb data={breadcrumb} />
					<h1 className="t-h-1">{title}</h1>
				</div>
				{thumb && (
					<motion.div
						className="p-guide__hero__image"
						style={{
							scale: isMounted && !isTabletScreen ? springScale : undefined,
						}}
					>
						<span className="object-fit">
							<Img image={thumb} />
						</span>
					</motion.div>
				)}
			</section>
			<section
				ref={bodyRef}
				className="p-guide__body"
				style={{ '--cr-primary': colorHex }}
			>
				<Excerpt data={data} />
				<div className="p-guide__content">
					<div className="p-guide__content__sidebar">
						<div className="t-l-1">Published by SPOTS Staff</div>
						<div className="t-l-1">{format(publishDate, 'MMMM do, yyyy')}</div>
					</div>
					<div className="p-guide__content__content wysiwyg-page">
						<CustomPortableText blocks={content} />
					</div>
					<div className="p-guide__content__sidebar-right">
						{(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
							<CategoryPillList
								categories={categories}
								subcategories={subcategories}
								isLink
							/>
						)}
					</div>
				</div>
			</section>
			<Itineraries data={data} isInView={inView} />
			<Related data={data} />
		</>
	);
};

export default PageGuidesSingle;

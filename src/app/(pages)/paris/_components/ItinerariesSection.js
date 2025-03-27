'use client';

import React, { useCallback, useState, useEffect } from 'react';
import ItineraryCard from '@/components/ItineraryCard';
import Carousel from '@/components/Carousel';
import CustomPortableText from '@/components/CustomPortableText';
import { motion } from 'framer-motion';

export default function ItinerariesSection({ data }) {
	const { itinerariesTitle, itinerariesExcerpt, itinerariesItems } = data;
	const [activeIndex, setActiveIndex] = useState(0);
	const [dotColor, setDotColor] = useState();

	const calculateDistanceFromCenter = useCallback(
		(index, activeIndex, totalItems) => {
			const directDistance = index - activeIndex;
			const loopDistance = totalItems - Math.abs(directDistance);
			return Math.abs(directDistance) <= loopDistance
				? directDistance
				: directDistance > 0
					? -loopDistance
					: loopDistance;
		},
		[]
	);

	const getRotation = useCallback((distance) => {
		const rotationMap = {
			1: -10,
			2: -20,
			3: -30,
			[-1]: 10,
			[-2]: 20,
			[-3]: 30,
		};
		return rotationMap[distance] || 0;
	}, []);

	useEffect(() => {
		if (itinerariesItems[activeIndex]?.color?.colorD) {
			setDotColor(itinerariesItems[activeIndex].color.colorD);
		}
	}, [activeIndex, itinerariesItems]);

	if (!itinerariesItems?.length) return null;

	return (
		<section
			className="p-paris__itineraries"
			style={{ '--cr-primary': dotColor }}
		>
			<div className="p-paris__itineraries__header wysiwyg-b-1">
				{itinerariesTitle && (
					<h2 className="p-paris__itineraries__title t-h-2">
						{itinerariesTitle}
					</h2>
				)}
				{itinerariesExcerpt && (
					<CustomPortableText blocks={itinerariesExcerpt} />
				)}
			</div>
			<Carousel
				itemWidth="Min(650px, 60vw)"
				gap="5px"
				isShowDots
				isAutoHeight={false}
				setActiveIndex={setActiveIndex}
			>
				{itinerariesItems.map((item, index) => {
					const distanceFromCenter = calculateDistanceFromCenter(
						index,
						activeIndex,
						itinerariesItems.length
					);

					return (
						<div
							key={`itineraries-${item._id}-${index}`}
							className="p-paris__itineraries__item"
						>
							<motion.div
								style={{
									rotateY: getRotation(distanceFromCenter),
									transition: 'transform var(--t-3)',
								}}
							>
								<ItineraryCard data={item} />
							</motion.div>
						</div>
					);
				})}
			</Carousel>
		</section>
	);
}

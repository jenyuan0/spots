'use client';

import React, { useCallback, useState, useEffect } from 'react';
import ItineraryCard from '@/components/ItineraryCard';
import Carousel from '@/components/Carousel';
import CustomPortableText from '@/components/CustomPortableText';
import { motion } from 'motion/react';

export default function ItineraryList({ data }) {
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
			1: -5,
			2: -10,
			3: -15,
			[-1]: 5,
			[-2]: 10,
			[-3]: 15,
		};
		return rotationMap[distance] || 0;
	}, []);

	useEffect(() => {
		if (itinerariesItems && itinerariesItems[activeIndex]?.color?.colorD) {
			setDotColor(itinerariesItems[activeIndex].color.colorD);
		}
	}, [activeIndex, itinerariesItems]);

	if (!itinerariesItems?.length) return null;

	return (
		<section className="c-itinerary-list" style={{ '--cr-primary': dotColor }}>
			<div className="c-itinerary-list__header wysiwyg-b-1">
				{itinerariesTitle && (
					<h2 className="c-itinerary-list__title t-h-2">{itinerariesTitle}</h2>
				)}
				{itinerariesExcerpt && (
					<CustomPortableText blocks={itinerariesExcerpt} />
				)}
			</div>
			<Carousel
				gap="Min(20px, 2vw)"
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
							className="c-itinerary-list__item"
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

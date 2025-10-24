'use client';

import React, { useEffect, useRef, useState } from 'react';
import CategoryPillList from '@/components/CategoryPillList';
import LocationDot from '@/components/LocationDot';
import Button from '@/components/Button';

export default function LocationsSection({ data }) {
	const { eyebrow, titleHeader, ctaLabel, locationList, locationCategories } =
		data || {};
	const containerRef = useRef(null);
	const [radius, setRadius] = useState(150);
	const [dots, setDots] = useState([]);

	useEffect(() => {
		const updateRadius = () => {
			if (containerRef.current) {
				const newRadius = containerRef.current.offsetWidth / 2;
				setRadius(newRadius);

				if (locationList) {
					const computedDots = locationList.map((item, index) => {
						const angle = (index / locationList.length) * Math.PI * 2;
						const x = parseFloat(
							(newRadius * Math.cos(angle) * 0.97).toFixed(2)
						);
						const y = parseFloat(
							(newRadius * Math.sin(angle) * 0.97).toFixed(2)
						);
						return { x, y, item };
					});
					setDots(computedDots);
				}
			}
		};

		updateRadius();
		window.addEventListener('resize', updateRadius);
		return () => window.removeEventListener('resize', updateRadius);
	}, [locationList]);

	return (
		<section className="p-paris__locations">
			<div className="p-paris__locations__text wysiwyg">
				<h1 className="t-l-2">{eyebrow || 'Explore Paris'}</h1>
				<h2 className="t-h-1">
					{titleHeader || 'Where every circle leads to discovery'}
				</h2>
				<CategoryPillList categories={locationCategories} isLink={true} />
				<Button
					href={'/locations'}
					className="p-paris__locations__cta btn-outline"
				>
					{ctaLabel || 'View All Spots (200+)'}
				</Button>
			</div>
			<div className="p-paris__locations__dots">
				<div className="p-paris__locations__dots-container" ref={containerRef}>
					{dots?.map(({ x, y, item }, index) => (
						<div
							key={`dot-${index}`}
							className="p-paris__locations__dot"
							style={{
								transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
							}}
						>
							<LocationDot data={item} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

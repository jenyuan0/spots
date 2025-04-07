'use client';

import React, { useEffect, useRef, useState } from 'react';
import CategoryPillList from '@/components/CategoryPillList';
import LocationDot from '@/components/LocationDot';
import Button from '@/components/Button';

export default function LocationsSection({ data }) {
	const { locationList, locationCategories } = data || {};
	const containerRef = useRef(null);
	const [radius, setRadius] = useState(150);

	useEffect(() => {
		const updateRadius = () => {
			if (containerRef.current) {
				setRadius(containerRef.current.offsetWidth / 2);
			}
		};

		updateRadius();
		window.addEventListener('resize', updateRadius);
		return () => window.removeEventListener('resize', updateRadius);
	}, []);

	if (!locationList) return null;

	const dots = locationList.map((item, index) => {
		const angle = (index / locationList.length) * Math.PI * 2;
		const x = radius * Math.cos(angle);
		const y = radius * Math.sin(angle);

		return { x, y, item };
	});

	return (
		<section className="p-paris__locations">
			<div className="p-paris__locations__text wysiwyg">
				<h1 className="t-l-2">Explore Paris</h1>
				<h2 className="t-h-1">Where every circle leads to discovery</h2>
				<Button
					href={'/paris/locations'}
					className="p-paris__locations__cta btn-outline"
				>
					View All Spots (200+)
				</Button>
				<CategoryPillList categories={locationCategories} isLink={true} />
			</div>
			<div className="p-paris__locations__dots">
				<div className="p-paris__locations__dots-container" ref={containerRef}>
					{dots.map(({ x, y, item }, index) => (
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

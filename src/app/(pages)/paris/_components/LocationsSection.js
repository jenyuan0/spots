'use client';

import React, { useEffect, useRef } from 'react';
import useAsideMap from '@/hooks/useAsideMap';
import CategoryPill from '@/components/CategoryPill';
import LocationCard from '@/components/LocationCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import Button from '@/components/Button';

export default function LocationsSection({ data }) {
	const { locationList, locationCategories } = data || {};
	const locationRef = useRef(null);
	const setAsideMapActive = useAsideMap((state) => state.setAsideMapActive);
	const setAsideMapLocations = useAsideMap(
		(state) => state.setAsideMapLocations
	);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setAsideMapActive(entry.isIntersecting);
			},
			{ threshold: 0.5 } // Trigger when 50% of the component is visible
		);

		if (locationRef.current) {
			observer.observe(locationRef.current);
		}

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setAsideMapLocations(locationList);
		}, 1);
	}, [locationList]);

	if (!locationList) return null;

	return (
		<section ref={locationRef} className="p-paris__locations">
			<div className="p-paris__locations__header wysiwyg">
				<h2 className="t-l-2">Find Your Spots in Paris</h2>
				<h3 className="t-h-2">Where every circle leads to discovery</h3>
			</div>
			<div className="p-paris__locations__grid">
				<ResponsiveGrid>
					{locationList.map((item, index) => (
						<LocationCard
							key={`item-${index}`}
							data={item}
							layout="horizontal"
						/>
					))}
				</ResponsiveGrid>
			</div>
			<div className="p-paris__locations__footer">
				<Button
					href={'/paris/locations'}
					className="p-paris__locations__cta btn-outline"
				>
					View All Spots (200+)
				</Button>
				{locationCategories && (
					<ul className="p-paris__locations__footer-categories">
						<li className="t-l-2">By category:</li>
						{locationCategories.map((item) => (
							<li key={`category-${item._id}`}>
								<CategoryPill className="pill" data={item} isLink={true} />
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}

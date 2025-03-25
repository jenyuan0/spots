'use client';

import React, { useEffect, useRef } from 'react';
import useAsideMap from '@/hooks/useAsideMap';
import CategoryPill from '@/components/CategoryPill';
import LocationCard from '@/components/LocationCard';
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
			<h2 className="p-paris__locations__heading t-h-2">Find Your Spots</h2>
			<div className="p-paris__locations__grid">
				{locationList.map((item, index) => (
					<LocationCard key={`item-${index}`} data={item} layout="horizontal" />
				))}
			</div>
			<div className="p-paris__locations__footer">
				<Button
					href={'/paris/locations'}
					className="p-paris__locations__cta btn-outline"
				>
					View All Spots (200+)
				</Button>
				<span className="t-l-1">or browse by categories:</span>
				{locationCategories && (
					<ul className="p-paris__locations__footer-categories">
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

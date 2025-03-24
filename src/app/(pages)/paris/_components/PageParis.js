'use client';

import React, { useEffect, useRef } from 'react';
import useAsideMap from '@/hooks/useAsideMap';
import HeroSection from './HeroSection';
import ItinerariesSection from './ItinerariesSection';
import ContentListSection from './ContentListSection';
import SeasonSection from './SeasonSection';
import CategoryPill from '@/components/CategoryPill';
import LocationCard from '@/components/LocationCard';
import Button from '@/components/Button';

export default function PageParis({ data }) {
	const { locationList, locationCategories, contentList } = data || {};
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

	return (
		<>
			<HeroSection data={data} />
			{locationList && (
				<section ref={locationRef} className="p-paris__locations">
					<div className="p-paris__locations__grid">
						{locationList.map((item, index) => (
							<LocationCard
								key={`item-${index}`}
								data={item}
								layout="vertical"
							/>
						))}
					</div>

					<div className="p-paris__locations__footer">
						<Button
							href={'/paris/locations'}
							className="p-paris__locations__cta btn-outline"
						>
							View All Locations
						</Button>
						<span className="t-l-1 cr-subtle-5">or browse by categories:</span>
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
			)}
			<ItinerariesSection data={data} />
			<ContentListSection data={data} />
			<SeasonSection data={data} />
		</>
	);
}

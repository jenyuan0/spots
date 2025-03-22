'use client';

import React, { useEffect, useRef } from 'react';
import HeroSection from './HeroSection';
import LocationSection from './LocationSection';
import ContentList from './ContentList';
import useAsideMap from '@/hooks/useAsideMap';

export default function PageParis({ data }) {
	const { locationList, contentList } = data || {};
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
			<div ref={locationRef}>
				<LocationSection data={data} />
			</div>
			{contentList?.map((el, index) => (
				<ContentList key={`guide-row-${index}`} data={el} />
			))}
		</>
	);
}

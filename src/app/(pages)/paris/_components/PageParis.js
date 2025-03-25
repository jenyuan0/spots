'use client';

import React from 'react';
import HeroSection from './HeroSection';
import LocationsSection from './LocationsSection';
import ItinerariesSection from './ItinerariesSection';
import ContentListSection from './ContentListSection';
import SeasonSection from './SeasonSection';

export default function PageParis({ data }) {
	return (
		<>
			<HeroSection data={data} />
			<LocationsSection data={data} />
			<ItinerariesSection data={data} />
			<ContentListSection data={data} />
			<SeasonSection data={data} />
		</>
	);
}

'use client';

import React from 'react';
import LocationsSection from './LocationsSection';
import ItineraryList from '@/components/ItineraryList';
import ContentListSection from './ContentListSection';
import SeasonSection from './SeasonSection';

export default function PageParis({ data }) {
	return (
		<>
			<LocationsSection data={data} />
			<ItineraryList data={data} />
			<ContentListSection data={data} />
			<SeasonSection data={data} />
		</>
	);
}

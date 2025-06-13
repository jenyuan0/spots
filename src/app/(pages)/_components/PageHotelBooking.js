'use client';

import React from 'react';
import SectionHero from './SectionHero';
import SectionWhy from './SectionWhy';
import SectionExamples from './SectionExamples';

export default function PageHotelBooking({ data }) {
	return (
		<>
			<SectionHero data={data} />
			<SectionWhy data={data} />
			<SectionExamples data={data} />
		</>
	);
}

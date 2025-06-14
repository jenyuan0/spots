'use client';

import React from 'react';
import SectionHero from './SectionHero';
import SectionWhy from './SectionWhy';
import SectionExamples from './SectionExamples';
import SectionFaq from './SectionFaq';
import SectionContact from './SectionContact';

export default function PageHotelBooking({ data }) {
	return (
		<>
			<SectionHero data={data} />
			<SectionWhy data={data} />
			<SectionExamples data={data} />
			<SectionFaq data={data} />
			<SectionContact data={data} />
		</>
	);
}

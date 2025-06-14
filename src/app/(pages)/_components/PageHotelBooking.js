'use client';

import React from 'react';
import SectionHero from './SectionHero';
import SectionWhy from './SectionWhy';
import SectionExamples from './SectionExamples';
import SectionFaq from './SectionFaq';
import SectionContact from './SectionContact';

export default function PageHotelBooking({ data }) {
	const data1 = {
		contactHeading: 'Start Your Search',
		contactSubheading:
			'A smoother stay starts with a human who gets it. Tell us where you’re going, we’ll handle the rest.',
		contactPlaceholder:
			'Hi! I’m planning a trip would love help finding a hotel.',
	};

	return (
		<>
			<SectionHero data={data} />
			<SectionWhy data={data} />
			<SectionExamples data={data} />
			<SectionFaq data={data} />
			<SectionContact data={data1} />
		</>
	);
}

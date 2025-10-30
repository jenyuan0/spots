'use client';

import React from 'react';
import SectionHero from './SectionHero';
import SectionWhy from './SectionWhy';
import SectionExamples from './SectionExamples';
import SectionFaq from './SectionFaq';
import SectionContact from './SectionContact';

export default function PageHotelBooking({ data, siteData }) {
	const { localization } = siteData || {};
	return (
		<>
			<SectionHero data={data} localization={localization} />
			<SectionWhy data={data} localization={localization} />
			<SectionExamples data={data} />
			<SectionFaq data={data} />
			<SectionContact data={data} />
		</>
	);
}

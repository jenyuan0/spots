'use client';

import React from 'react';
import SectionHero from './SectionHero';
import SectionIntro from './SectionIntro';
import SectionSpots from './SectionSpots';
import SectionWhy from './SectionWhy';
import SectionCase from './SectionCase';
import SectionFaq from './SectionFaq';
import SectionContact from './SectionContact';

export default function PageTravelDesign({ data, siteData }) {
	return (
		<>
			<SectionHero data={data} />
			<SectionIntro data={data} />
			<SectionSpots data={data} />
			<SectionCase data={data} siteData={siteData} />
			<SectionFaq data={data} />
			<SectionWhy data={data} />
			<SectionContact data={data} />
		</>
	);
}

'use client';

import React from 'react';
import SectionHero from './SectionHero';
import SectionIntro from './SectionIntro';
import SectionWhy from './SectionWhy';
import SectionCase from './SectionCase';
import SectionFaq from './SectionFaq';
import SectionContact from './SectionContact';

export default function PageTravelDesign({ data }) {
	return (
		<>
			<SectionHero data={data} />
			<SectionCase data={data} />
			{/* <SectionIntro data={data} /> */}
			<SectionWhy data={data} />
			<SectionFaq data={data} />
			<SectionContact data={data} />
		</>
	);
}

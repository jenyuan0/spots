'use client';

import React, { useState } from 'react';
import HeroSection from './HeroSection';
import IntroSection from './IntroSection';
import WhySection from './WhySection';

export default function PageHome({ data }) {
	const [primaryColor, setPrimaryColor] = useState();

	return (
		<>
			<HeroSection data={data} setPrimaryColor={setPrimaryColor} />
			<IntroSection data={data} primaryColor={primaryColor} />
			<WhySection data={data} />
			<section className="p-home__hiw"></section>
		</>
	);
}

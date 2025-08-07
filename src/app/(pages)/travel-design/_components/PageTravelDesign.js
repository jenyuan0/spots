'use client';

import React, { useState } from 'react';
import HeroSection from './HeroSection';
import IntroSection from './IntroSection';
import WhySection from './WhySection';
import CaseSection from './CaseSection';

// https://engine.com/
// add: "easily book group travels"
// Geared towards corporate retreats, group travels, or such that may require a "need"
// consolidate notes on notion

export default function PageTravelDesign({ data }) {
	return (
		<>
			<HeroSection data={data} />
			<IntroSection data={data} />
			<WhySection data={data} />
			<CaseSection data={data} />
		</>
	);
}

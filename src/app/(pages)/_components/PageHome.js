'use client';

import React, { useState } from 'react';
import HeroSection from './HeroSection';
import IntroSection from './IntroSection';
import WhySection from './WhySection';
import ItineraryList from '@/components/ItineraryList';
import ContactSection from './ContactSection';

export default function PageHome({ data }) {
	const [primaryColor, setPrimaryColor] = useState();

	return (
		<>
			<HeroSection data={data} setPrimaryColor={setPrimaryColor} />
			<IntroSection data={data} primaryColor={primaryColor} />
			<WhySection data={data} />
			<ItineraryList data={data} />
			<ContactSection data={data} />
		</>
	);
}

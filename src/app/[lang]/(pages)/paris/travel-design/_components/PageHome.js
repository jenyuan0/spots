'use client';

import React, { useState } from 'react';
import HeroSection from './HeroSection';
import IntroSection from './IntroSection';
import WhySection from './WhySection';
import ItineraryList from '@/components/ItineraryList';
import PlanSection from '@/components/PlanSection';

export default function PageHome({ data }) {
	return (
		<>
			<HeroSection data={data} />
			<IntroSection data={data} />
			<WhySection data={data} />
			<ItineraryList data={data} />
			<section className="p-home__contact">
				<PlanSection data={data?.planForm} isH1Style={true} />
			</section>
		</>
	);
}

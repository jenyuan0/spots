'use client';

import React from 'react';
import HeroSection from './HeroSection';
import LocationSection from './LocationSection';
import ContentList from './ContentList';

export default function PageParis({ data }) {
	const { contentList } = data || {};

	return (
		<>
			<HeroSection data={data} />
			<LocationSection data={data} />
			{contentList?.map((el, index) => (
				<ContentList key={`guide-row-${index}`} data={el} />
			))}
		</>
	);
}

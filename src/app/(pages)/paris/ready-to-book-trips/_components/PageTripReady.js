'use client';
import React from 'react';
import ItineraryCard from '@/components/ItineraryCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';

export default function PageReadyToBook({ data }) {
	const { title, itineraries } = data || {};

	// TODO
	// Include filters: 'for couples', 'first-timers', 'most popular'
	// or 'most popular filters'

	return (
		<section className="p-trip-ready">
			<div className="p-trip-ready__header wysiwyg">
				<h1 className="t-l-2">Paris</h1>
				<h2 className="t-h-1">{title}</h2>
			</div>
			<div className="p-trip-ready__grid">
				<ResponsiveGrid size="lge">
					{itineraries?.map((item, index) => {
						return (
							<div
								key={`itineraries-${item._id}-${index}`}
								className="p-paris__itineraries__item"
							>
								<ItineraryCard data={item} />
							</div>
						);
					})}
				</ResponsiveGrid>
			</div>
		</section>
	);
}

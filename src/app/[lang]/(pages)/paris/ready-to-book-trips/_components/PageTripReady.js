'use client';
import React from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import CustomPortableText from '@/components/CustomPortableText';
import ItineraryCard from '@/components/ItineraryCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function PageReadyToBook({ data, siteData }) {
	const [currentLanguageCode, currentLanguageCodeDisplay] = useCurrentLang();
	const { title, paragraph, itineraries } = data || {};
	const { localization } = siteData || {};
	const { parisLabel, readyToBookLabel } = localization || {};

	const breadcrumb = [
		{
			title: parisLabel || 'Paris',
			url: `/${currentLanguageCodeDisplay}/paris`,
		},
		{
			title: readyToBookLabel || 'Ready-to-Book Trips',
			url: `/${currentLanguageCodeDisplay}/paris/ready-to-book-trips`,
		},
	];
	// TODO
	// Include filters: 'for couples', 'first-timers', 'most popular'
	// or 'most popular filters'

	return (
		<>
			<section className="p-trip-ready__header c-index-header wysiwyg">
				<Breadcrumb data={breadcrumb} />
				<h1 className="t-h-1">{title}</h1>
				{paragraph && (
					<p className="t-b-2">
						<CustomPortableText blocks={paragraph} hasPTag={false} />
					</p>
				)}
			</section>
			<section className="p-trip-ready__body">
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
			</section>
		</>
	);
}

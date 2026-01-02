'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { siteSetup } from '@/hooks/useVsSetup';
import * as gtag from '@/lib/gtag';
import AdaSkip from './AdaSkip';
import Announcement from './Announcement';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import Magnify from './Magnify';
import Lightbox from './Lightbox';
import Planner from './Planner';
import ProgressLoader from './ProgressLoader';
import useAsideMap from '@/hooks/useAsideMap';

export default function Layout({ children, siteData }) {
	const { announcement, header, footer, localization } = siteData || {};
	const pathname = usePathname();
	const [isHeaderActive, setIsHeaderActive] = useState(false);
	const [isFooterActive, setIsFooterActive] = useState(false);
	const setAsideMapActive = useAsideMap((state) => state.setAsideMapActive);
	const setAsideMapLocations = useAsideMap(
		(state) => state.setAsideMapLocations
	);

	useEffect(() => {
		siteSetup();
		document.documentElement.style.setProperty(
			'--s-vp-height',
			`${window.innerHeight}px`
		);
	}, []);

	useEffect(() => {
		if (siteData?.integrations?.gaID) {
			gtag.pageview(pathname, siteData.integrations.gaID);
		}

		// Optimize color mapping with early return
		if (!siteData.colors?.length) return;

		// Batch DOM updates
		const colorUpdates = siteData.colors.reduce((updates, item) => {
			const title = item.title.toLowerCase();
			updates[`--cr-${title}-d`] = item.colorD;
			updates[`--cr-${title}-l`] = item.colorL;
			return updates;
		}, {});

		// Apply all styles at once
		Object.entries(colorUpdates).forEach(([property, value]) => {
			document.documentElement.style.setProperty(property, value);
		});
	}, [siteData, pathname]);

	const fetchIsCustomItinerary = async (pathname) => {
		try {
			const dataSlug = pathname.split('/').pop();
			const showItineraryHeader = await Promise.all([
				client.fetch(
					`*[_type == "gItineraries" && language == "en" && slug.current == "${dataSlug}"][0] {
						"value": coalesce(
							select(
									defined(slug.current) && type == "custom" => false,
									true
							)
						)
					}.value`
				),
			]);
			setIsHeaderActive(!showItineraryHeader);
			setIsFooterActive(!showItineraryHeader);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		if (pathname.includes('/itinerary/')) {
			fetchIsCustomItinerary(pathname);
		} else {
			setIsHeaderActive(true);
			setIsFooterActive(true);
		}

		// aside map is set on the page level
		setAsideMapActive(false);
		setAsideMapLocations(false);
	}, [pathname]);

	if (pathname.startsWith('/sanity')) {
		return children;
	}

	return (
		<>
			<ProgressLoader />
			<AdaSkip />
			<Announcement data={announcement} />
			<Header isActive={isHeaderActive} localization={localization} />
			<Main>{children}</Main>
			<Magnify siteData={siteData} />
			<Lightbox />
			<Planner localization={localization} />
			<Footer siteData={siteData} data={footer} isActive={isFooterActive} />
		</>
	);
}

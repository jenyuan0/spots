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
import Magnify from './Magnify';
import Main from './Main';
import ProgressLoader from './ProgressLoader';

export default function Layout({ children, siteData }) {
	const { announcement, header, footer } = siteData || {};
	const pathname = usePathname();
	const [isCustomItinerary, setIsCustomItinerary] = useState(false);

	useEffect(() => {
		siteSetup();
	}, []);

	useEffect(() => {
		if (siteData?.integrations?.gaID) {
			gtag.pageview(pathname, siteData?.integrations?.gaID);
		}
	}, [siteData, pathname]);

	const fetchIsCustomItinerary = async (pathname) => {
		try {
			const dataSlug = pathname.split('/').pop();
			const showHeader = await Promise.all([
				client.fetch(
					`*[_type == "gItineraries" && slug.current == "${dataSlug}"][0] {
						"value": coalesce(
							select(
									defined(slug.current) && type == "custom" => false,
									true
							)
						)
					}.value`
				),
			]);
			setIsCustomItinerary(showHeader);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		if (pathname.includes('/itinerary/')) {
			fetchIsCustomItinerary(pathname);
		} else {
			setIsCustomItinerary(false);
		}
	}, [pathname]);

	if (pathname.startsWith('/sanity')) {
		return children;
	}

	return (
		<>
			<ProgressLoader />
			<AdaSkip />
			<Announcement data={announcement} />
			{!isCustomItinerary && <Header data={header} />}
			<Main>{children}</Main>
			<Magnify />
			{!isCustomItinerary && <Footer siteData={siteData} data={footer} />}
		</>
	);
}

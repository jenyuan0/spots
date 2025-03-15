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
import AsideMap from './AsideMap';
import Magnify from './Magnify';
import ProgressLoader from './ProgressLoader';
import useAsideMap from '@/hooks/useAsideMap';

export default function Layout({ children, siteData }) {
	const { announcement, header, footer } = siteData || {};
	const pathname = usePathname();
	const [isHeaderActive, setIsHeaderActive] = useState(false);
	const [isFooterActive, setIsFooterActive] = useState(false);
	const [isMainSpaceL, setIsMainSpaceL] = useState(false);
	const [isMainSpaceR, setIsMainSpaceR] = useState(false);
	const setAsideMapActive = useAsideMap((state) => state.setAsideMapActive);

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
			const showItineraryHeader = await Promise.all([
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
		setIsMainSpaceL(pathname !== '/');
		setIsMainSpaceR(pathname !== '/');
		setAsideMapActive(pathname.includes('/locations'));
	}, [pathname]);

	if (pathname.startsWith('/sanity')) {
		return children;
	}

	return (
		<>
			<ProgressLoader />
			<AdaSkip />
			<Announcement data={announcement} />
			<Header data={header} isActive={isHeaderActive} />
			<Main isSpaceL={isMainSpaceL} isSpaceR={isMainSpaceR}>
				{children}
			</Main>
			<AsideMap />
			<Magnify />
			<Footer siteData={siteData} data={footer} isActive={isFooterActive} />
		</>
	);
}

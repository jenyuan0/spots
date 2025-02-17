'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { siteSetup } from '@/hooks/useVsSetup';
import * as gtag from '@/lib/gtag';
import AdaSkip from './AdaSkip';
import Announcement from './Announcement';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import ProgressLoader from './ProgressLoader';

export default function Layout({ children, siteData }) {
	const { announcement, header, footer } = siteData || {};
	const pathname = usePathname();
	const pathArray = pathname.split('/').filter(Boolean);

	useEffect(() => {
		siteSetup();
	}, []);

	useEffect(() => {
		if (siteData?.integrations?.gaID) {
			gtag.pageview(pathname, siteData?.integrations?.gaID);
		}
	}, [siteData, pathname]);

	if (pathname.startsWith('/sanity')) {
		return children;
	}

	return (
		<>
			<ProgressLoader />
			<AdaSkip />
			<Announcement data={announcement} />
			{pathArray?.[0] !== 'itinerary' && (
				<Header siteData={siteData} data={header} />
			)}
			<Main>{children}</Main>
			{pathArray?.[0] !== 'itinerary' && (
				<Footer siteData={siteData} data={footer} />
			)}
		</>
	);
}

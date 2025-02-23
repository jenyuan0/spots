'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
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
	const { announcement, header, showHeader, footer } = siteData || {};
	const pathname = usePathname();

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
			{showHeader && <Header data={header} />}
			<Main>{children}</Main>
			<Magnify />
			{showHeader && <Footer siteData={siteData} data={footer} />}
		</>
	);
}

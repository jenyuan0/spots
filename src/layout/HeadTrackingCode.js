'use client';

import React from 'react';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';

export default function HeadTrackingCode({ siteData = {} }) {
	const { integrations } = siteData || {};
	const pathName = usePathname();
	const isSanityRoute = pathName?.startsWith('/sanity');

	if (process.env.NODE_ENV !== 'production' || isSanityRoute) {
		return null;
	}

	return (
		<>
			{integrations?.gaID && <GoogleAnalytics gaId={integrations.gaID} />}
			{integrations?.gtmID && <GoogleTagManager gtmId={integrations.gtmID} />}
		</>
	);
}

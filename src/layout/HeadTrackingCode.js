import React from 'react';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

export default function HeadTrackingCode({ siteData = {} }) {
	const { integrations } = siteData || {};
	const isSanityRoute =
		typeof window !== 'undefined' &&
		window.location.pathname.startsWith('/sanity');

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

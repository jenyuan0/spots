import React from 'react';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

export default function HeadTrackingCode({ siteData = {} }) {
	const { integrations } = siteData || {};

	return (
		process.env.NODE_ENV === 'production' && (
			<>
				{integrations?.gaID && <GoogleAnalytics gaId={integrations.gaID} />}
				{integrations?.gtmID && <GoogleTagManager gtmId={integrations.gtmID} />}
			</>
		)
	);
}

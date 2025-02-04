'use client';

import { useEffect, useState } from 'react';

export function siteSetup() {
	// site credit
	console.log(
		'%cSite by View Source \n%cview-source.com',
		[
			'margin: 20px 0 0;',
			'font-size: 12px',
			'font-family: Helvetica, sans-serif',
			'font-weight: 700',
		].join(';'),
		[
			'margin: -5px 0 20px;',
			'font-size: 12px',
			'font-family: Helvetica, sans-serif',
			'font-weight: 400',
		].join(';')
	);

	// enable the possibility for browser-specific CSS
	document.documentElement.setAttribute('data-useragent', navigator.userAgent);

	// .avoid-style-flash elements turns visible
	setTimeout(() => {
		document.querySelectorAll('.avoid-style-flash').forEach((el) => {
			el.style.visibility = 'visible';
		});
	}, 400);
}

// ***GLOBAL VARIABLES***

function getVsObject() {
	const vs = {
		isWindow: typeof window !== 'undefined',
	};

	if (!vs.isWindow) {
		return false;
	}

	vs.hasLocalStorage = () => {
		try {
			var storage = window['localStorage'],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		} catch (e) {
			return false;
		}
	};
	vs.browserType = () => {
		if (
			(navigator.userAgent.indexOf('Opera') ||
				navigator.userAgent.indexOf('OPR')) != -1
		) {
			return 'Opera';
		} else if (navigator.userAgent.indexOf('Chrome') != -1) {
			return 'Chrome';
		} else if (navigator.userAgent.indexOf('Safari') != -1) {
			return 'Safari';
		} else if (navigator.userAgent.indexOf('Firefox') != -1) {
			return 'Firefox';
		} else if (
			navigator.userAgent.indexOf('MSIE') != -1 ||
			!!document.documentMode === true
		) {
			return 'IE';
		} else {
			return 'Unknown';
		}
	};

	return vs;
}

export default function useVsObject() {
	const [vsObject, setVsObject] = useState(getVsObject());

	useEffect(() => {
		function handleResize() {
			setVsObject(getVsObject());
		}
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return vsObject;
}

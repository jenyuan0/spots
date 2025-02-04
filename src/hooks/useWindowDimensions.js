'use client';

import { useEffect, useState } from 'react';

export const breakpoints = {
	mobile: 600,
	tablet: 1024,
	widescreen: 1920,
};

const getWindowDimensions = () => {
	if (typeof window === 'undefined') {
		// If it's server-side, return default values
		return {
			width: 0,
			height: 0,
		};
	}
	const { innerWidth: width, innerHeight: height } = window;
	return {
		width,
		height,
	};
};

const getDeviceFlags = (width) => {
	const isTouchDevice =
		typeof window !== 'undefined' && // Check if window is available (client-side)
		window.matchMedia('(any-hover: none)').matches;
	const isMobileScreen = width <= breakpoints.mobile;
	const isTabletScreen = width <= breakpoints.tablet;
	const isDesktopScreen = width > breakpoints.tablet;
	const isWideScreen = width >= breakpoints.widescreen;

	return {
		isTouchDevice,
		isMobileScreen,
		isTabletScreen,
		isDesktopScreen,
		isWideScreen,
	};
};

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState(
		getWindowDimensions()
	);
	const [deviceFlags, setDeviceFlags] = useState(
		getDeviceFlags(windowDimensions.width)
	);

	useEffect(() => {
		const handleResize = () => {
			const newDimensions = getWindowDimensions();
			setWindowDimensions(newDimensions);
			setDeviceFlags(getDeviceFlags(newDimensions.width));
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return {
		width: windowDimensions.width,
		height: windowDimensions.height,
		...deviceFlags,
	};
}

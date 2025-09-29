export const checkIfActive = ({ pathname, url }) => {
	if (!pathname) return null;

	if (pathname.includes('/paris/guides') && url == '/paris/guides') {
		return true;
	} else if (pathname.includes('/locations' && url == '/locations')) {
		return true;
	} else {
		return pathname == url;
	}
};

export const getRoute = ({ documentType, slug }) => {
	if (!documentType) return undefined;

	switch (documentType) {
		case 'pHome':
			return '/paris/travel-design';
		case 'pGeneral':
			return `/${slug}`;
		case 'pContact':
			return `/contact`;
		case 'pHotelBooking':
			return '/';

		case 'pLocations':
			return `/locations`;
		case 'gCategories': // default categories to locations
			return `/locations/category/${slug}`;
		case 'pLocationsCategory':
			return `/locations/category/${slug}`;
		case 'gLocations':
			return `/locations/${slug}`;

		case 'pGuides':
			return '/paris/guides';
		case 'pGuidesCategory':
			return `/paris/guides/category/${slug}`;
		case 'gGuides':
			return `/paris/guides/${slug}`;
		case 'pParis':
			return `/paris`;
		case 'pTripReady':
			return `/paris/${slug}`;
		case 'gItineraries':
			return `/paris/itinerary/${slug}`;
		case 'gCases':
			return `/travel-design/${slug}`;

		case 'externalUrl':
			return slug;

		default:
			console.warn('Invalid document type:', documentType);
			return slug ? `/${slug}` : undefined;
	}
};

export const getWindowURl = (windowUrl) => {
	if (windowUrl.includes('localhost:')) {
		return `http://${windowUrl}`;
	}
	return `https://${windowUrl}`;
};

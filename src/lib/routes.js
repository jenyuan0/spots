export const checkIfActive = ({ pathName, url, isChild }) => {
	if (isChild) {
		return pathName.split('/')[1] == url.split('/')[1];
	} else {
		return pathName == url;
	}
};

export const getRoute = ({ documentType, slug }) => {
	if (!documentType) return undefined;

	switch (documentType) {
		case 'pHome':
			return '/';
		case 'pGeneral':
			return `/${slug}`;
		case 'pGuides':
			return '/guides';
		case 'gGuides':
			return `/guides/${slug}`;
		case 'pLocations':
			return `/locations`;
		case 'gLocations':
			return `/locations/${slug}`;
		case 'gItineraries':
			return `/itinerary/${slug}`;
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

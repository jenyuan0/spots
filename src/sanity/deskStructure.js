import { BookIcon, PinIcon, DocumentIcon, EarthGlobeIcon } from '@sanity/icons';
import { globalMenu } from './desk/global';
import { pagesMenu, otherPagesMenu } from './desk/pages';
import {
	globalLocations,
	globalItinerariesDay,
	globalItineraries,
	globalGuides,
	globalFAQ,
	globalAds,
	globalCategories,
	globalSubcategories,
	globalAuthors,
} from './desk/g-misc';
import { menusMenu } from './desk/menus';
import { colorsMenu } from './desk/colors';
import { settingsMenu } from './desk/settings';

export const pageParis = (S) => {
	return S.listItem()
		.title('Paris')
		.child(
			S.editor()
				.id('pParis')
				.title('Paris')
				.schemaType('pParis')
				.documentId('pParis')
		)
		.icon(EarthGlobeIcon);
};

export const pageGuidesIndex = (S) => {
	return S.listItem()
		.title('Guides Index')
		.child(
			S.editor()
				.id('pGuides')
				.title('Guides Index')
				.schemaType('pGuides')
				.documentId('pGuides')
		)
		.icon(BookIcon);
};

export const pageLocationsIndex = (S) => {
	return S.listItem()
		.title('Locations Index')
		.child(
			S.editor()
				.id('pLocations')
				.title('Locations Index')
				.schemaType('pLocations')
				.documentId('pLocations')
		)
		.icon(PinIcon);
};

export const pageTripReady = (S) => {
	return S.listItem()
		.title('Ready-to-Book Trips')
		.child(
			S.editor()
				.id('pTripReady')
				.title('Ready-to-Book Trips')
				.schemaType('pTripReady')
				.documentId('pTripReady')
		)
		.icon(DocumentIcon);
};

export const pageHotelBooking = (S) => {
	return S.listItem()
		.title('Hotel Booking')
		.child(
			S.editor()
				.id('pHotelBooking')
				.title('Hotel Booking')
				.schemaType('pHotelBooking')
				.documentId('pHotelBooking')
		)
		.icon(DocumentIcon);
};

const deskStructure = (S) =>
	S.list()
		.title('Spots.Paris')
		.items([
			globalMenu(S),
			pagesMenu(S),
			otherPagesMenu(S),
			S.divider(),
			pageParis(S),
			pageGuidesIndex(S),
			pageLocationsIndex(S),
			pageTripReady(S),
			pageHotelBooking(S),
			S.divider(),
			globalLocations(S),
			globalItinerariesDay(S),
			globalItineraries(S),
			S.divider(),
			globalGuides(S),
			globalFAQ(S),
			globalAds(S),
			S.divider(),
			globalCategories(S),
			globalSubcategories(S),
			// globalAuthors(S),
			S.divider(),
			menusMenu(S),
			colorsMenu(S),
			settingsMenu(S),
		]);

export default deskStructure;

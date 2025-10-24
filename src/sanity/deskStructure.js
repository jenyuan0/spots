import {
	BookIcon,
	PinIcon,
	DocumentIcon,
	EarthGlobeIcon,
	CalendarIcon,
	HighlightIcon,
} from '@sanity/icons';
import { globalMenu } from './desk/global';
import { pagesMenu, otherPagesMenu, pageTravelDesign } from './desk/pages';
import {
	globalLocations,
	globalItinerariesDay,
	globalItineraries,
	globalCases,
	globalGuides,
	globalAds,
	globalCategories,
	globalSubcategories,
	globalAuthors,
} from './desk/g-misc';
import {
	locationsFilterEmptyContent,
	locationsFilterHideFromIndex,
	locationsFilterByCategory,
	locationsFilterBySubcategory,
	locationsFilterByHighlight,
} from './desk/locations-filters';
import {
	guidesFilterByCategory,
	guidesFilterBySubcategory,
} from './desk/guides-filters';
import { menusMenu } from './desk/menus';
import { colorsMenu } from './desk/colors';
import { settingsMenu, settingsLocalization } from './desk/settings';
import { createBulkActionsTable } from 'sanity-plugin-bulk-actions-table';

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

const deskStructure = (S, context) =>
	S.list()
		.title('Spots.Paris')
		.items([
			globalMenu(S),
			pagesMenu(S),
			otherPagesMenu(S),
			S.divider(),
			pageTravelDesign(S),
			pageHotelBooking(S),
			S.divider(),
			pageParis(S),
			pageTripReady(S),
			S.divider(),
			globalLocations(S),
			locationsFilterEmptyContent(S),
			locationsFilterHideFromIndex(S),
			locationsFilterByCategory(S),
			locationsFilterBySubcategory(S),
			locationsFilterByHighlight(S),
			pageLocationsIndex(S),
			S.divider(),
			globalItinerariesDay(S),
			globalItineraries(S),
			S.divider(),
			globalCases(S),
			S.divider(),
			globalGuides(S),
			guidesFilterByCategory(S),
			guidesFilterBySubcategory(S),
			pageGuidesIndex(S),
			globalAds(S),
			S.divider(),
			globalCategories(S),
			globalSubcategories(S),
			// globalAuthors(S),
			S.divider(),
			createBulkActionsTable({
				type: 'gGuides',
				S,
				context,
				title: 'Guides Bulk Edit',
				icon: BookIcon,
			}),
			createBulkActionsTable({
				type: 'gCategories',
				S,
				context,
				title: 'Category Bulk Edit',
				icon: PinIcon,
			}),
			createBulkActionsTable({
				type: 'gSubcategories',
				S,
				context,
				title: 'Subcategory Bulk Edit',
				icon: PinIcon,
			}),
			createBulkActionsTable({
				type: 'gItineraries',
				S,
				context,
				title: 'Itinerary Bulk Edit',
				icon: HighlightIcon,
			}),
			createBulkActionsTable({
				type: 'gItinerariesDay',
				S,
				context,
				title: 'Itinerary Day Bulk Edit',
				icon: CalendarIcon,
			}),
			S.divider(),
			menusMenu(S),
			colorsMenu(S),
			settingsMenu(S),
			settingsLocalization(S),
		]);

export default deskStructure;

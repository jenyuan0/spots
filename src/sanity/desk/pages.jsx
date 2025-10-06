import {
	HomeIcon,
	EnvelopeIcon,
	UnknownIcon,
	DocumentsIcon,
	DocumentIcon,
} from '@sanity/icons';
import { apiVersion } from '@/sanity/env';

const pageHome = (S) => {
	return S.listItem()
		.title('Homepage')
		.child(
			S.editor()
				.id('pHome')
				.title('Homepage')
				.schemaType('pHome')
				.documentId('pHome')
		)
		.icon(HomeIcon);
};

const pageContact = (S) => {
	return S.listItem()
		.title('Contact Page')
		.child(
			S.editor()
				.id('pContact')
				.title('Contact Page')
				.schemaType('pContact')
				.documentId('pContact')
		)
		.icon(EnvelopeIcon);
};

const pageError = (S) => {
	return S.listItem()
		.title('404 Page')
		.child(
			S.editor()
				.id('p404')
				.title('404 Page')
				.schemaType('p404')
				.documentId('p404')
		)
		.icon(UnknownIcon);
};

export const pageTripBespoke = (S) => {
	return S.listItem()
		.title('Bespoke Trips')
		.child(
			S.editor()
				.id('pTripBespoke')
				.title('Bespoke Trips')
				.schemaType('pTripBespoke')
				.documentId('pTripBespoke')
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

export const pageTravelDesign = (S) => {
	return S.listItem()
		.title('Travel Design')
		.child(
			S.editor()
				.id('pTravelDesign')
				.title('Travel Design')
				.schemaType('pTravelDesign')
				.documentId('pTravelDesign')
		)
		.icon(DocumentIcon);
};

export const pagesMenu = (S) => {
	return S.listItem()
		.title('Primary Pages')
		.id('pages')
		.icon(DocumentsIcon)
		.child(
			S.list()
				.title('Primary Pages')
				.items([pageHome(S), pageError(S), pageContact(S)])
		);
};

export const otherPagesMenu = (S) => {
	return S.listItem()
		.title('Other Pages')
		.schemaType('pGeneral')
		.icon(DocumentsIcon)
		.child(
			S.documentTypeList('pGeneral')
				.title('Other Pages')
				.filter(`_type == "pGeneral" && language == "en"`)
				.apiVersion(apiVersion)
				.child((documentId) =>
					S.document().documentId(documentId).schemaType('pGeneral')
				)
				.canHandleIntent(
					(intent, { type }) =>
						['create', 'edit'].includes(intent) && type === 'pGeneral'
				)
		);
};

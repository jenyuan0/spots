import { defineField, defineType } from 'sanity';

export default defineType({
	title: 'Localization',
	name: 'settingsLocalization',
	type: 'document',
	fields: [
		globalLabelLocalization(),
		globalFormLocalization(),
		globalCustomEmailLocalization(),
	],
	preview: {
		prepare() {
			return {
				title: 'Localization',
			};
		},
	},
});

function globalLabelLocalization() {
	return defineField({
		title: 'Global Label',
		name: 'globalLabel',
		type: 'object',
		fields: [
			defineField({
				title: 'Travel Design',
				name: 'travelDesign',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Search Hotel',
				name: 'searchHotel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Plan Your Trip',
				name: 'planYourTrip',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Scroll to Explore',
				name: 'scrollToExplore',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: false,
		},
	});
}

function globalFormLocalization() {
	return defineField({
		title: 'Global Form',
		name: 'globalForm',
		type: 'object',
		fields: [
			defineField({
				title: 'First Consultation · No Fees',
				name: 'firstConsultationNoFees',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Hotel Booking · No Fees',
				name: 'hotelBookingNoFees',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Where',
				name: 'where',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Your Destination(s)',
				name: 'yourDestinations',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'When',
				name: 'when',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Select Dates',
				name: 'selectDates',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Who',
				name: 'who',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Add guests',
				name: 'addGuests',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Adult',
				name: 'adult',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Age 13 or above',
				name: 'ageAbove',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Children',
				name: 'children',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Ages 0-12',
				name: 'ageBelow',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Pets',
				name: 'pets',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Dogs, cats, etc.',
				name: 'dogsCats',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Would you like help planning your trip?',
				name: 'wouldYouLikeHelp',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Yes',
				name: 'yesOption',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'No',
				name: 'noOption',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'What’s your ideal nightly budget?',
				name: 'whatsYourBudget',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Send via Email',
				name: 'sendViaEmail',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Send via WhatsApp',
				name: 'sendViaWhatsApp',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Need another way? Reach us at',
				name: 'needAnotherWay',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: false,
		},
	});
}

function globalCustomEmailLocalization() {
	return defineField({
		title: 'Global Custom Email',
		name: 'globalCustomEmail',
		type: 'object',
		fields: [
			defineField({
				title: 'Greeting',
				name: 'greeting',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'I’m looking for help planning a trip',
				name: 'helpPlanTrip',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'To',
				name: 'toPreposition',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Travel Planning to ',
				name: 'travelPlanning',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'I’m looking to book a room at',
				name: 'bookRoomAt',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'I’m looking for help finding a hotel in',
				name: 'findHotelIn',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Hotel',
				name: 'hotel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Inquiry for',
				name: 'inquiryFor',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Search in',
				name: 'searchIn',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'I’m looking for help finding a hotel',
				name: 'findHotel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'For',
				name: 'forConjunction',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'with a nightly budget of',
				name: 'withNightlyBudget',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'and I’d like help planning the trip',
				name: 'andHelpPlanTrip',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: false,
		},
	});
}

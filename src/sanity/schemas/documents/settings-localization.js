import { defineField, defineType } from 'sanity';

export default defineType({
	title: 'Localization',
	name: 'settingsLocalization',
	type: 'document',
	fields: [
		globalLabelLocalization(),
		globalFormLocalization(),
		globalCustomEmailLocalization(),
		globalLocationCard(),
		globalHighlights(),
		globalItinerary(),
		globalGuide(),
		globalMap(),
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
				name: 'menuLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				name: 'newsletterLabel2',
				type: 'internationalizedArrayString',
			}),
			defineField({
				name: 'newsletterSignUpLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Travel Design',
				name: 'travelDesign',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Hotel Booking',
				name: 'hotelBooking',
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
			defineField({
				title: 'Contact Us',
				name: 'contactUs',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Frequently Asked Questions',
				name: 'frequentlyAskedQuestions',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Option',
				name: 'option',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Trip Highlights',
				name: 'tripHighlights',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Our Role',
				name: 'ourRole',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Suggested Accomodations',
				name: 'suggestedAccomodations',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Unlock Insider Rates',
				name: 'unlockInsiderRates',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Close',
				name: 'closeLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Explore Case Study',
				name: 'exploreCaseStudy',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Address Label',
				name: 'addressLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Website Label',
				name: 'websiteLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Paris Label',
				name: 'parisLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Guides Label',
				name: 'guidesLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Ready-to-Book Trips',
				name: 'readyToBookLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Categories Label',
				name: 'categoriesLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'No Items Found',
				name: 'noItemsFound',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Reservation Label',
				name: 'reservationLabel',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: true,
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
			defineField({
				title: 'Sending',
				name: 'sending',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Send message',
				name: 'sendMessage',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Average response time < 8hr',
				name: 'averageResponseTime',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Select Option',
				name: 'selectOption',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: true,
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
				name: 'tester',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: true,
		},
	});
}

function globalLocationCard() {
	return defineField({
		title: 'Global Location Labels',
		name: 'globalLocationCard',
		type: 'object',
		fields: [
			defineField({
				title: 'Locations Label',
				name: 'locationsLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Best Places In Paris',
				name: 'bestPlacesInParis',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Read More',
				name: 'readMore',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Details',
				name: 'detailsLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Get Direction',
				name: 'getDirection',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'All Spots',
				name: 'allSpots',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'More Spots to Discover',
				name: 'moreSpotsToDiscover',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: true,
		},
	});
}

function globalHighlights() {
	return defineField({
		title: 'Global Highlights',
		name: 'globalHighlights',
		type: 'object',
		fields: [
			defineField({
				title: 'Iconic',
				name: 'iconic',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Trending',
				name: 'trending',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Editor’s Pick',
				name: 'editorsPick',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'On Our Radar',
				name: 'onOurRadar',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: true,
		},
	});
}

function globalItinerary() {
	return defineField({
		title: 'Global Itinerary',
		name: 'globalItinerary',
		type: 'object',
		fields: [
			defineField({
				title: 'Day',
				name: 'day',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Spot',
				name: 'spot',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Itinerary',
				name: 'itinerary',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'View Trip',
				name: 'viewTrip',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Trip Itinerary',
				name: 'tripItinerary',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Person',
				name: 'person',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Plan Your Trip Today',
				name: 'planYourTripToday',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Optional',
				name: 'optionalLabel',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: true,
		},
	});
}

function globalGuide() {
	return defineField({
		title: 'Global Guide',
		name: 'globalGuide',
		type: 'object',
		fields: [
			defineField({
				title: 'Read Guide',
				name: 'readGuide',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Guide Coming Soon',
				name: 'guideComingSoon',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'All Guides',
				name: 'allGuides',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Paris Travel Guides',
				name: 'parisTravelGuides',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Continue Reading',
				name: 'continueReading',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Intro Label',
				name: 'introLabel',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Published by SPOTS Staff',
				name: 'publishedBy',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: true,
		},
	});
}

function globalMap() {
	return defineField({
		title: 'Global Map',
		name: 'globalMap',
		type: 'object',
		fields: [
			defineField({
				title: 'Show Map',
				name: 'showMap',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Close Map',
				name: 'closeMap',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Filter Activities',
				name: 'filterActivities',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Select All',
				name: 'selectAll',
				type: 'internationalizedArrayString',
			}),
			defineField({
				title: 'Deselect All',
				name: 'deselectAll',
				type: 'internationalizedArrayString',
			}),
		],
		options: {
			collapsible: true,
			collapsed: true,
		},
	});
}

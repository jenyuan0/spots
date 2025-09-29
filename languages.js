// Sanity accepts only underscore, use id for Sanity-related settings
// The language code must follow [ISO 639-1 format](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes),
// code is used on client side (middleware, path, hreflang...etc)

const languages = [
	{
		id: 'en',
		code: 'en',
		title: 'English',
		subtitle: 'EN',
		isDefault: true,
		country: 'us',
	},
	{
		id: 'zh_TW',
		code: 'zh-TW',
		title: '繁體中文',
		subtitle: '繁',
		country: 'tw',
	},
];

// Add document's type to the list to enable localization for the document
const translationDocuments = [
	'gCases',
	'gLocations',
	'pHotelBooking',
	'pTravelDesign',
	'gPlanForm',
];

export const i18n = {
	languages,
	defaultLanguage: languages.find((item) => item.isDefault),
	base: languages.find((item) => item.isDefault).id,
	translationDocuments,
};

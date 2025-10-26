import { groq } from 'next-sanity';
import { i18n } from '../../../languages';

export const getDocumentWithFallback = ({ docType, withSlug = false } = {}) => {
	const slugCondition = withSlug ? ' && slug.current == $slug' : '';

	return `coalesce(
  *[_type == "${docType}"${slugCondition} && language == $language][0],
  *[_type == "${docType}"${slugCondition} && language == "${i18n.base}"][0]
)`;
};

export const translatedReference = ({
	sourceField, // e.g. "parentCategory"
	projection, // e.g. 'title,slug'
} = {}) => `
	${sourceField}->{
		...coalesce(
			*[_type == "translation.metadata" && references(^._id)][0].translations[_key == $language][0].value->{
				${projection}
			},
			*[_type == "translation.metadata" && references(^._id)][0].translations[_key == "en"][0].value->{
				${projection}
			},
			{
				${projection}
			}
		)
	}
`;

export const translatedReferenceArray = ({
	sourceField, // e.g. "caseItems"
	projection, // e.g. getCaseData('card')
} = {}) => `
	${sourceField}[]->{
		...coalesce(
			*[_type == "translation.metadata" && references(^._id)][0].translations[_key == $language][0].value->{
				${projection}
			},
			*[_type == "translation.metadata" && references(^._id)][0].translations[_key == "en"][0].value->{
				${projection}
			},
			{
				${projection}
			}
		)
	}`;

export const getTranslationByLanguage = (type) => {
	return `
		select(
			count(${type}[_key == $language]) > 0 => ${type}[_key == $language][0].value,
			${type}[_key == '${i18n.base}'][0].value
		)
	`;
};

export const translations = groq`
	language,
	"_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
		title,
		slug,
		language,
	},
`;

// Construct our "home" page GROQ
export const homeID = groq`*[_type=="pHome"][0]._id`;

// Base queries for common fields
const baseFields = groq`
  _id,
  _type,
  title,
  "slug": slug.current,
	language,
  sharing
`;

const linkFields = groq`
  _type,
  route,
  isNewTab
`;

const menuFields = groq`
  _key,
  _type,
  title,
  items[]{
    title,
    link {
      ${linkFields}
    }
  }
`;

export const imageMetaFields = groq`
  asset,
  crop,
  customRatio,
  hotspot,
  ...asset-> {
    "id": assetId,
    "alt": coalesce(^.alt, altText),
    "type": mimeType,
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height,
    "aspectRatio": metadata.dimensions.aspectRatio,
    "lqip": metadata.lqip
  }
`;

export const fileMetaFields = groq`
  asset,
  ...asset-> {
    "id": assetId,
    "filename": originalFilename,
    "type": mimeType,
    "size": size,
    "url": url,
    "extension": extension
  }
`;

export const callToActionFields = groq`
  label,
  link {
    ${linkFields}
  },
  "isButton": true
`;

export const colorMetaFields = groq`
  "title": lower(title),
  "colorD": colorD.hex,
  "colorL": colorL.hex
`;

export const categoryMetaFields = groq`
  ${baseFields},
  "colorTitle": color->title,
  "colorD": color->colorD.hex,
  "colorL": color->colorL.hex
`;

export const subcategoryMetaFields = groq`
  ${baseFields},
  parentCategory->{${categoryMetaFields}}
`;

export const portableTextContentFields = groq`
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      ${linkFields}
    },
    _type == "callToAction" => {
      ${callToActionFields}
    }
  },
  _type == "image" => {
    ${imageMetaFields}
  }
`;

export const getLocationsData = (type) => {
	let defaultData = groq`
    ${baseFields},
		${translatedReferenceArray({
			sourceField: 'categories',
			projection: `${categoryMetaFields}`,
		})},
		${translatedReferenceArray({
			sourceField: 'subcategories',
			projection: `${subcategoryMetaFields}`,
		})},
    "color": lower(categories[0]->color->title),
		highlights,
		hideFromIndex,
    images[0...8]{
      ${imageMetaFields}
    },
    geo,
    address{
      street,
      city,
      zip
    },
    content[]{
      ${portableTextContentFields}
    },
		"localization": *[_type == "settingsLocalization"][0].globalLocationCard {
			"readMore": ${getTranslationByLanguage('readMore')},
			"detailsLabel": ${getTranslationByLanguage('detailsLabel')},
			"getDirection": ${getTranslationByLanguage('getDirection')},
			"moreSpotsToDiscover": ${getTranslationByLanguage('moreSpotsToDiscover')},
			"locationsLabel": ${getTranslationByLanguage('locationsLabel')},
		},
		"localizationHighlights": *[_type == "settingsLocalization"][0].globalHighlights {
			"iconic": ${getTranslationByLanguage('iconic')},
			"trending": ${getTranslationByLanguage('trending')},
			"editorsPick": ${getTranslationByLanguage('editorsPick')},
			"onOurRadar": ${getTranslationByLanguage('onOurRadar')},
		},
		`;
	if (type === 'card') {
		// Card-specific fields can be added here
	} else {
		defaultData += groq`
      urls,
      fees,
      contentItinerary[]{
        ${portableTextContentFields}
      },
      relatedLocations[]->{
        ${getLocationsData('card')}
      },
      relatedGuides[]->{
        ${getGuidesData('card')}
      }
    `;
	}
	return defaultData;
};

export const locationListObj = groq`
  ...,
  _id,
  _type,
  title,
  startTime,
  content,
  locations[]->{
    ${getLocationsData('card')}
  },
  fallbackRains[]->{
    ${getLocationsData('card')}
  },
  fallbackLongWait[]->{
    ${getLocationsData('card')}
  }
`;

export const locationSingleObj = groq`
  ...,
  location->{
    ${getLocationsData('card')}
  },
  contentReplace[]{
    ${portableTextContentFields}
  }`;

export const freeformFields = groq`
  ...,
  _type,
  _key,
  content[]{
    ${portableTextContentFields}
  },
  sectionAppearance
`;

export const portableTextObj = groq`
  ...,
  _type == 'carousel' => {
    _type,
    _key,
    items,
    autoplay,
    autoplayInterval
  },
  _type == 'locationList' => {
    ${locationListObj}
  },
  _type == 'locationSingle' => {
    ${locationSingleObj}
  },
  _type == 'ad' =>  *[_type == 'gAds' && _id == ^._ref][0]
`;

export const getGuidesData = (type) => {
	let defaultData = groq`
    ${baseFields},
    thumb{
      ${imageMetaFields}
    },
    publishDate,
		${translatedReferenceArray({
			sourceField: 'categories',
			projection: ` ${categoryMetaFields}`,
		})},
		${translatedReferenceArray({
			sourceField: 'subcategories',
			projection: ` ${subcategoryMetaFields}`,
		})},
    "color": lower(categories[0]->color->title),
    "colorHex": lower(categories[0]->color->colorD.hex),
    excerpt,
		"localization": *[_type == "settingsLocalization"][0].globalGuide {
			"readGuide": ${getTranslationByLanguage('readGuide')},
			"continueReading": ${getTranslationByLanguage('continueReading')},
			"introLabel": ${getTranslationByLanguage('introLabel')},
			"publishedBy": ${getTranslationByLanguage('publishedBy')},
		},
		`;
	if (type === 'card') {
		defaultData += groq`excerpt`;
	} else {
		defaultData += groq`
    showMap,
    content[]{
      ${portableTextObj}
    },
		${translatedReferenceArray({
			sourceField: 'itineraries',
			projection: `${getItineraryData('card')}`,
		})},
    ${translatedReferenceArray({
			sourceField: 'related',
			projection: `${getGuidesData('card')}`,
		})}`;
	}
	return defaultData;
};

export const getItineraryData = (type) => {
	let defaultData = groq`
    ${baseFields},
    subtitle,
    images[0...5]{
      ${imageMetaFields}
    },
    color->{
      ${colorMetaFields}
    },
    "totalDays": length(plan[]),
    "totalActivities": count(plan[].itineraryDay->activities[]),
    "totalLocations": count(plan[].itineraryDay->activities[].locations[]),
		`;
	if (type === 'card') {
		defaultData += groq`
		excerpt,
		"localization": *[_type == "settingsLocalization"][0].globalItinerary {
			"dayLabel": ${getTranslationByLanguage('day')},
			"itineraryLabel": ${getTranslationByLanguage('itinerary')},
			"viewTrip": ${getTranslationByLanguage('viewTrip')},
		},
		`;
	} else {
		defaultData += groq`
      introduction,
			${translatedReferenceArray({
				sourceField: 'accomodations',
				projection: `${getLocationsData('card')}`,
			})},
      plan[]{
				"day":${translatedReference({
					sourceField: 'itineraryDay',
					projection: `title,
          content,
          images[0...6]{
            ${imageMetaFields}
          },
          activities[] {
            ${locationListObj}
          },
					${translatedReferenceArray({
						sourceField: 'relatedGuides',
						projection: `${getLocationsData('card')}`,
					})},`,
				})},
        title,
        content
      },
			${translatedReferenceArray({
				sourceField: 'guides',
				projection: `${getGuidesData('card')}`,
			})},
      type,
      ...select(type == "premade" => {
        NumOfTravelers,
        "budget": {
          "low": budget.budgetLow,
          "high": budget.budgetHigh
        },
        ${planFormData}
      }),
			"localization": *[_type == "settingsLocalization"][0].globalItinerary {
				"dayLabel": ${getTranslationByLanguage('day')},
				"spotLabel": ${getTranslationByLanguage('spot')},
				"tripItinerary": ${getTranslationByLanguage('tripItinerary')},
				"planYourTripToday": ${getTranslationByLanguage('planYourTripToday')},
				"person": ${getTranslationByLanguage('person')},
			},
			"localizationGlobal": *[_type == "settingsLocalization"][0].globalLabel {
				"tripHighlights": ${getTranslationByLanguage('tripHighlights')},
				"suggestedAccomodations": ${getTranslationByLanguage('suggestedAccomodations')},
				"option": ${getTranslationByLanguage('option')},
				"closeLabel": ${getTranslationByLanguage('closeLabel')},
			},
			"localizationMap": *[_type == "settingsLocalization"][0].globalMap {
				"showMap": ${getTranslationByLanguage('showMap')},
				"closeMap": ${getTranslationByLanguage('closeMap')},
				"filterActivities": ${getTranslationByLanguage('filterActivities')},
				"selectAll": ${getTranslationByLanguage('selectAll')},
				"deselectAll": ${getTranslationByLanguage('deselectAll')},
			},
      ...select(type == "custom" => {
        passcode,
        name,
        startDate,
        introMessage,
        endingMessage,
        emergencyContact,
        "accommodation": {
          "location": accomodation.accomodationLocation->{${getLocationsData('card')}},
          "checkInTime": accomodation.accomodationCheckInTime,
          "checkOutTime": accomodation.accomodationCheckOutTime,
          "notes": accomodation.accomodationNotes,
          "attachments": accomodation.accomodationAttachments
        },
        "reservations": reservations[]{
          "location": location->{${getLocationsData('card')}},
          "startTime": startTime,
          "endTime": endTime,
          "notes": notes,
          "attachments": attachments[]{${fileMetaFields}}
        }
      })
			`;
	}
	return defaultData;
};

export const getCaseData = (type) => {
	let defaultData = groq`
    ${baseFields},
    subtitle,
    thumbs[0...8]{
      ${imageMetaFields}
    },
		"images": thumbs[0...8]{
			${imageMetaFields}
		},
    color->{
      ${colorMetaFields}
    },`;
	if (type !== 'card') {
		defaultData += groq`
			heroImage{
				${imageMetaFields}
			},
      introduction,
			highlights[]{
				${portableTextObj}
			},
			offers,
			content[]{
				${portableTextObj}
			},
			${translatedReferenceArray({
				sourceField: 'accomodations',
				projection: `${getLocationsData('card')}`,
			})},
		`;
	}
	return defaultData;
};

// Construct our content "modules" GROQ
export const pageModules = groq`
  _type == 'freeform' => {
    ${freeformFields}
  },
  _type == 'carousel' => {
    _type,
    _key,
    items,
    autoplay,
    autoplayInterval
  },
  _type == 'marquee' => {
    _type,
    _key,
    items[]{
      _type == 'simple' => {
        _type,
        text
      },
      _type == 'image' => {
        _type,
        "image": {
          ${imageMetaFields}
        }
      }
    },
    speed,
    reverse,
    pausable
  },
  _type == 'locationList' => {
    ${locationListObj}
  },
  _type == 'locationSingle' => {
    ${locationSingleObj}
  },
  _type == 'ad' =>  *[_type == 'gAds' && _id == ^._ref][0]
`;

const customForm = groq`
  formFields[] {
    placeholder,
    _key,
    required,
    fieldLabel,
    inputType,
    size,
    selectOptions[] {
      _key,
      "title": option,
      "value": option
    }
  }`;

export const formLocalization = groq`
	"localization": *[_type == "settingsLocalization"][0].globalForm {
		"firstConsultationNoFees": ${getTranslationByLanguage('firstConsultationNoFees')},
		"hotelBookingNoFees": ${getTranslationByLanguage('hotelBookingNoFees')},
		"where": ${getTranslationByLanguage('where')},
		"yourDestinations": ${getTranslationByLanguage('yourDestinations')},
		"when": ${getTranslationByLanguage('when')},
		"selectDates": ${getTranslationByLanguage('selectDates')},
		"who": ${getTranslationByLanguage('who')},
		"addGuests": ${getTranslationByLanguage('addGuests')},
		"adult": ${getTranslationByLanguage('adult')},
		"ageAbove": ${getTranslationByLanguage('ageAbove')},
		"children": ${getTranslationByLanguage('children')},
		"ageBelow": ${getTranslationByLanguage('ageBelow')},
		"pets": ${getTranslationByLanguage('pets')},
		"dogsCats": ${getTranslationByLanguage('dogsCats')},
		"wouldYouLikeHelp": ${getTranslationByLanguage('wouldYouLikeHelp')},
		"yesOption": ${getTranslationByLanguage('yesOption')},
		"noOption": ${getTranslationByLanguage('noOption')},
		"whatsYourBudget": ${getTranslationByLanguage('whatsYourBudget')},
		"sendViaEmail": ${getTranslationByLanguage('sendViaEmail')},
		"sendViaWhatsApp": ${getTranslationByLanguage('sendViaWhatsApp')},
		"needAnotherWay": ${getTranslationByLanguage('needAnotherWay')},
		"sending": ${getTranslationByLanguage('sending')},
		"sendMessage": ${getTranslationByLanguage('sendMessage')},
		"averageResponseTime": ${getTranslationByLanguage('averageResponseTime')},
		"errorMessage": ${getTranslationByLanguage('errorMessage')},
	},
`;

export const customEmailLocalization = groq`
	"emailLocalization": *[_type == "settingsLocalization"][0].globalCustomEmail {
		"greeting": ${getTranslationByLanguage('greeting')},
		"helpPlanTrip": ${getTranslationByLanguage('helpPlanTrip')},
		"toPreposition": ${getTranslationByLanguage('toPreposition')},
		"travelPlanning": ${getTranslationByLanguage('travelPlanning')},
		"bookRoomAt": ${getTranslationByLanguage('bookRoomAt')},
		"findHotelIn": ${getTranslationByLanguage('findHotelIn')},
		"hotel": ${getTranslationByLanguage('hotel')},
		"inquiryFor": ${getTranslationByLanguage('inquiryFor')},
		"searchIn": ${getTranslationByLanguage('searchIn')},
		"findHotel": ${getTranslationByLanguage('findHotel')},
		"forConjunction": ${getTranslationByLanguage('forConjunction')},
		"withNightlyBudget": ${getTranslationByLanguage('withNightlyBudget')},
		"andHelpPlanTrip": ${getTranslationByLanguage('andHelpPlanTrip')},
	},
`;

export const planFormData = groq`
 	"planForm": ${getDocumentWithFallback({ docType: 'gPlanForm' })} {
    image,
    mobileImage,
    formTitle,
    formHeading,
    ${customForm},
    successMessage,
    errorMessage,
    sendToEmail,
    emailSubject,
    formFailureNotificationEmail,
    email,
    whatsapp,
    line,
		offering[],
    faq[]{
      _key,
      title,
      answer[]{
        ${portableTextContentFields}
      }
    },
		"localizationTitle": *[_type == "settingsLocalization"][0].globalLabel {
			"contactUs": ${getTranslationByLanguage('contactUs')},
			"frequentlyAskedQuestions": ${getTranslationByLanguage('frequentlyAskedQuestions')},
		},
		"localization": *[_type == "settingsLocalization"][0].globalForm {
			"sending": ${getTranslationByLanguage('sending')},
			"sendMessage": ${getTranslationByLanguage('sendMessage')},
			"averageResponseTime": ${getTranslationByLanguage('averageResponseTime')},
			"selectOption": ${getTranslationByLanguage('selectOption')},
			"errorMessage": ${getTranslationByLanguage('errorMessage')},
		}
  }`;

// Construct our "site" GROQ
export const site = groq`
  "site": {
    "title": *[_type == "settingsGeneral"][0].siteTitle,
    "announcement": *[_type == "gAnnouncement"][0]{
      display,
      messages,
      autoplay,
      autoplayInterval,
      backgroundColor,
      textColor,
      emphasizeColor,
      "link": ${linkFields}
    },
    "header": *[_type == "gHeader"][0]{
      menu[]{
        ${menuFields}
      },
    },
    "footer": *[_type == "gFooter"][0]{
      menu->{
        ${menuFields}
      },
      menuLegal->{
        ${menuFields}
      }
    },
    "sharing": *[_type == "settingsGeneral"][0]{
      shareGraphic,
      favicon,
      faviconLight
    },
    "integrations": *[_type == "settingsIntegration"][0]{
      gtmID,
      gaID,
      KlaviyoApiKey
    },
    "colors": *[_type == "settingsBrandColors"][]{
      ${colorMetaFields}
    },
		"localization": *[_type == "settingsLocalization"][0].globalLabel {
			"tripHighlights": ${getTranslationByLanguage('tripHighlights')},
			"ourRole": ${getTranslationByLanguage('ourRole')},
			"suggestedAccomodations": ${getTranslationByLanguage('suggestedAccomodations')},
			"planYourTrip": ${getTranslationByLanguage('planYourTrip')},
			"option": ${getTranslationByLanguage('option')},
			"unlockInsiderRates": ${getTranslationByLanguage('unlockInsiderRates')},
			"closeLabel": ${getTranslationByLanguage('closeLabel')},
			"addressLabel": ${getTranslationByLanguage('addressLabel')},
			"websiteLabel": ${getTranslationByLanguage('websiteLabel')},
			"categoriesLabel": ${getTranslationByLanguage('categoriesLabel')},
			"noItemsFound": ${getTranslationByLanguage('noItemsFound')},
			"parisLabel": ${getTranslationByLanguage('parisLabel')},
			"guidesLabel": ${getTranslationByLanguage('guidesLabel')},
			"readyToBookLabel": ${getTranslationByLanguage('readyToBookLabel')},
			"exploreCaseStudy": ${getTranslationByLanguage('exploreCaseStudy')},
			"hotelBooking": ${getTranslationByLanguage('hotelBooking')},
			"travelDesign": ${getTranslationByLanguage('travelDesign')},
			"searchHotel": ${getTranslationByLanguage('searchHotel')},
			"scrollToExplore": ${getTranslationByLanguage('scrollToExplore')},
			"reservationLabel": ${getTranslationByLanguage('reservationLabel')},
		},
		"localizationHighlights": *[_type == "settingsLocalization"][0].globalHighlights {
			"iconic": ${getTranslationByLanguage('iconic')},
			"trending": ${getTranslationByLanguage('trending')},
			"editorsPick": ${getTranslationByLanguage('editorsPick')},
			"onOurRadar": ${getTranslationByLanguage('onOurRadar')},
		},
  }
`;

export const pageHomeQuery = groq`
	${getDocumentWithFallback({ docType: 'pHome' })}{
    ${baseFields},
    "isHomepage": true,
    heroHeading[]{
      ${portableTextContentFields}
    },
    heroSubheading,
    heroImage,
		${translatedReferenceArray({
			sourceField: 'heroSpots',
			projection: `title,
      _id,
      "slug": slug.current,
      "color": lower(categories[0]->color->title)`,
		})},
    introTitle,
    introHeading,
    introCta,
    clockHeading,
    clockParagraph,
    clockOffers,
    clockText,
    clockCta,
    masksHeading,
    masksParagraph,
    masksOffers,
    masksCta,
    masksImages[0...8]{
      ${imageMetaFields}
    },
    toggleHeading,
    toggleParagraph,
    toggleOffers,
    toggleCta,
    itinerariesTitle,
    itinerariesExcerpt[]{
      ${portableTextContentFields}
    },
		${translatedReferenceArray({
			sourceField: 'itinerariesItems',
			projection: `${getItineraryData('card')}`,
		})},
    ${planFormData}
  }
`;

export const page404Query = groq`
	${getDocumentWithFallback({ docType: 'p404' })}{
    ${baseFields},
    heading,
    paragraph[]{
      ${portableTextContentFields}
    },
    callToAction{
      ${callToActionFields}
    }
  }`;

export const pagesBySlugQuery = groq`
  ${getDocumentWithFallback({ docType: 'pGeneral', withSlug: true })}{
    ${baseFields},
    pageModules[]{
      ${pageModules}
    }
  }`;

export const pageHotelBookingQuery = groq`
	${getDocumentWithFallback({ docType: 'pHotelBooking' })}{
    ${baseFields},
    heroHeading[]{
      ${portableTextContentFields}
    },
    heroSubheading,
    heroSpots[]->{
      ${getLocationsData('card')}
    },
    whyListHeading,
    whyList[]{
      title,
      paragraph,
      img {
        ${imageMetaFields}
      }
    },
    examplesHeading,
    examplesList[]{
      title,
      excerpt,
      color->{
        ${colorMetaFields}
      },
      ctaLabel,
      messages[]{
        sender,
        text[]{
					${portableTextContentFields}
				}
      }
    },
		faqHeading,
		faqSubheading,
    faq[]{
      _key,
      title,
      answer[]{
        ${portableTextContentFields}
      }
    },
  }
`;

export const pageTravelDesignQuery = groq`
 ${getDocumentWithFallback({ docType: 'pTravelDesign' })}{
    ${baseFields},
    "isHomepage": true,
    heroImage,
    heroVideo{
      ${fileMetaFields}
    },
    heroSpots[]->{
      title,
      _id,
      "slug": slug.current,
      "color": lower(categories[0]->color->title)
    },
    introHeading,
    introParagraph[]{
      ${portableTextContentFields}
		},
    caseHeading,
		${translatedReferenceArray({
			sourceField: 'caseItems',
			projection: `${getCaseData('card')}`,
		})},
    whyHeading[]{
      ${portableTextContentFields}
    },
		whyParagraph,
    clockHeading,
    clockParagraph,
    clockText,
    clockCta,
    masksHeading,
    masksParagraph,
    masksCta,
    masksImages[0...8]{
      ${imageMetaFields}
    },
    toggleHeading,
    toggleParagraph,
    toggleCta,
    faqHeading,
    faqSubheading,
    faq[]{
      _key,
      title,
      answer[]{
        ${portableTextContentFields}
      }
    },
  }
`;

export const pageContactQuery = groq`
	${getDocumentWithFallback({ docType: 'pContact' })}{
    ${baseFields},
    ${planFormData}
  }
`;

export const pageTripReadyQuery = groq`
	${getDocumentWithFallback({ docType: 'pTripReady' })}{
    ${baseFields},
    paragraph[]{
      ${portableTextContentFields}
    },
		${translatedReferenceArray({
			sourceField: 'itineraries',
			projection: `${getItineraryData('card')}`,
		})},
  }
`;

export const pageParisQuery = groq`
	${getDocumentWithFallback({ docType: 'pParis' })}{
    ${baseFields},
		eyebrow,
		titleHeader,
		ctaLabel,
		${translatedReferenceArray({
			sourceField: 'locationCategories',
			projection: `${categoryMetaFields}`,
		})},
    "locationList": *[_type == "gLocations" && language == "en"] | order(_updatedAt desc)[0...30] {
      ${getLocationsData('card')}
    },
    itinerariesTitle,
    itinerariesExcerpt[]{
      ${portableTextContentFields}
    },
		${translatedReferenceArray({
			sourceField: 'itinerariesItems',
			projection: `${getItineraryData('card')}`,
		})},
    contentList[]{
      title,
			titleUrl,
      subtitle,
      excerpt[]{
        ${portableTextContentFields}
      },
      items[]{
        _type == 'categoryGuides' => {
          "category": @-> {
            _id,
            title,
            "items": *[_type == "gGuides" && language == $language && hideFromIndex != true && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
              ${getGuidesData('card')}
            }
          }
        },
        _type == 'subcategoryGuides' => {
          "subcategory": @-> {
            _id,
            title,
            "items": *[_type == "gSubcategories" && language == $language && hideFromIndex != true && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
              ${getGuidesData('card')}
            }
          }
        },
        _type == 'guide' => @-> {
          ${getGuidesData('card')}
        },
        _type == 'categoryLocations' => {
          "category": @-> {
            _id,
            title,
            "items": *[_type == "gLocations" && language == $language && hideFromIndex != true && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
              ${getLocationsData('card')}
            }
          }
        },
        _type == 'subcategoryLocations' => {
          "subcategory": @-> {
            _id,
            title,
            "items": *[_type == "gSubcategories" && language == $language && hideFromIndex != true && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
              ${getLocationsData('card')}
            }
          }
        },
        _type == 'location' => @-> {
          ${getLocationsData('card')}
        }
      }
    },
    seasonsTitle,
    seasons[]{
      name,
      description,
      guide->{
        "slug": slug.current
      },
      months[]{
        name,
        guide->{
          "slug": slug.current
        }
      }
    },
		"localization": *[_type == "settingsLocalization"][0].globalGuide {
			"guideComingSoon": ${getTranslationByLanguage('guideComingSoon')},
		},
  }
`;

export const articleListAllQuery = groq`
	"articleList": coalesce(
		*[_type == "gGuides" && language == $language],
		*[_type == "gGuides" && language == "en"]
	)| order(_updatedAt desc)[0...200]{
		${getGuidesData('card')}
	}
`;

export const guidesIndexQuery = groq`
  ${baseFields},
  heading[]{
    ${portableTextContentFields}
  },
  paragraph[]{
    ${portableTextContentFields}
  },
	${translatedReferenceArray({
		sourceField: 'categories',
		projection: `${categoryMetaFields}`,
	})},
  itemsPerPage,
  paginationMethod,
  loadMoreButtonLabel,
  infiniteScrollCompleteLabel,
	"localization": *[_type == "settingsLocalization"][0].globalGuide {
		"allGuides": ${getTranslationByLanguage('allGuides')},
		"parisTravelGuides": ${getTranslationByLanguage('parisTravelGuides')},
	}
`;

export const pageGuidesIndex = groq`
	${getDocumentWithFallback({ docType: 'pGuides' })}{
    ${guidesIndexQuery}
  }`;

export const pageGuidesCategoryQuery = groq`{
  ...${getDocumentWithFallback({ docType: 'pGuides' })}{
    ${guidesIndexQuery}
  },
	"_type": "pGuidesCategory",
	"slug": coalesce(
		*[_type == "gCategories" && language == "en" && slug.current == $slug][0].slug.current,
		*[_type == "gSubcategories" && language == "en" && slug.current == $slug][0].slug.current
	),
	"isCategoryPage": true,
	"parentCategory": ${translatedReference({
		sourceField:
			'*[_type == "gSubcategories" && language == $language && slug.current == $slug][0].parentCategory',
		projection: `"slug": slug.current,
		title,
		_id,`,
	})},
	"subcategories": select(
		defined(*[_type == "gSubcategories" && language == "en" && slug.current == $slug][0].parentCategory) =>
			*[
				_type == "gSubcategories" && language == "en" &&
				parentCategory._ref == *[_type == "gSubcategories" && language == "en" && slug.current == $slug][0].parentCategory._ref
			]{
				${baseFields},
				"colorTitle": parentCategory->color->title,
				"colorD": parentCategory->color->colorD.hex,
				"colorL": parentCategory->color->colorL.hex
			},
		true =>
			*[
				_type == "gSubcategories" && language == "en" &&
				parentCategory._ref == *[_type == "gCategories" && language == "en" && slug.current == $slug][0]._id
			]{
				${baseFields},
				"colorTitle": parentCategory->color->title,
				"colorD": parentCategory->color->colorD.hex,
				"colorL": parentCategory->color->colorL.hex
			}
	),
	"categoryTitle": coalesce(
		*[_type == "gCategories" && language == $language && slug.current == $slug][0].title,
		*[_type == "gSubcategories" && language == "en" && slug.current == $slug][0].title
	),
	"guidesHeading": coalesce(
		*[_type == "gCategories" && language == $language && slug.current == $slug][0].guidesHeading[]{
			${portableTextContentFields}
		},
		*[_type == "gSubcategories" && language == "en" && slug.current == $slug][0].guidesHeading[]{
			${portableTextContentFields}
		}
	),
	"guidesParagraph": coalesce(
		*[_type == "gCategories" && language == $language && slug.current == $slug][0].guidesParagraph[]{
			${portableTextContentFields}
		},
		*[_type == "gSubcategories" && language == "en" && slug.current == $slug][0].guidesParagraph[]{
			${portableTextContentFields}
		},
	),
	"articleList": *[_type == "gGuides" && language == $language && hideFromIndex != true && (references(*[_type == "gCategories" && language == "en" && slug.current == $slug]._id) || references(*[_type == "gSubcategories" && language == "en" && slug.current == $slug]._id))]{
		${getGuidesData('card')}
	},
	"title": coalesce(
		*[_type == "gCategories" && language == $language && slug.current == $slug][0].title,
		*[_type == "gSubcategories" && language == "en" && slug.current == $slug][0].title
	) + " Guides",
}`;

export const pageGuidesIndexWithArticleDataSSGQuery = groq`
  ${getDocumentWithFallback({ docType: 'pGuides' })}{
    ${guidesIndexQuery},
    ${articleListAllQuery}
  }`;

export const pageGuidesPaginationMethodQuery = groq`
  {
    "articleTotalNumber": count(*[_type == "gGuides" && language == "en"]),
    "itemsPerPage": *[_type == "pGuides" && language == "en"][0].itemsPerPage
  }`;

export const pageGuidesSingleQuery = groq`
	${getDocumentWithFallback({ docType: 'gGuides', withSlug: true })}{
    ${getGuidesData()},
    "defaultRelated": *[_type == "gGuides" && language == "en" && count(categories[@._ref in ^.^.categories[]._ref]) > 0
      && _id != ^._id
      ] | order(publishedAt desc, _createdAt desc) [0..1] {
        ${getGuidesData('card')}
      }
  }`;

export const locationListAllQuery = groq`
	"locationList": coalesce(
		*[_type == "gLocations" && language == $language],
		*[_type == "gLocations" && language == "en"]
	) | order(_updatedAt desc)[0...300]{
		${getLocationsData('card')}
	}
`;

export const locationIndexQuery = groq`
	${baseFields},
  heading[]{
    ${portableTextContentFields}
  },
  paragraph[]{
    ${portableTextContentFields}
  },
	${translatedReferenceArray({
		sourceField: 'categories',
		projection: `${categoryMetaFields}`,
	})},
  itemsPerPage,
  paginationMethod,
  loadMoreButtonLabel,
  infiniteScrollCompleteLabel,
	"localization": *[_type == "settingsLocalization"][0].globalLocationCard {
		"locationsLabel": ${getTranslationByLanguage('locationsLabel')},
		"allSpots": ${getTranslationByLanguage('allSpots')},
		"bestPlacesInParis": ${getTranslationByLanguage('bestPlacesInParis')},
	}
`;

export const pageLocationsIndex = groq`
  ${getDocumentWithFallback({ docType: 'pLocations' })}{
    ${locationIndexQuery}
  }`;

export const pageLocationsCategoryQuery = groq`{
  ...${getDocumentWithFallback({ docType: 'pLocations' })}{
    ${locationIndexQuery}
  },
	"_type": "pLocationsCategory",
	"isCategoryPage": true,
	"parentCategory": ${translatedReference({
		sourceField:
			'*[_type == "gSubcategories" && language == $language && slug.current == $slug][0].parentCategory',
		projection: `"slug": slug.current,
		title,
		_id,`,
	})},
	"subcategories": select(
		defined(*[_type == "gSubcategories" && language == $language && slug.current == $slug][0].parentCategory) =>
			*[
				_type == "gSubcategories" && language == $language &&
				parentCategory._ref == *[_type == "gSubcategories" && language == "en" && slug.current == $slug][0].parentCategory._ref
			]{
				${baseFields},
				"colorTitle": parentCategory->color->title,
				"colorD": parentCategory->color->colorD.hex,
				"colorL": parentCategory->color->colorL.hex
			},
		true =>
			*[
				_type == "gSubcategories" && language == $language &&
				parentCategory._ref == *[_type == "gCategories" && language == "en" && slug.current == $slug][0]._id
			]{
				${baseFields},
				"colorTitle": parentCategory->color->title,
				"colorD": parentCategory->color->colorD.hex,
				"colorL": parentCategory->color->colorL.hex
			}
	),
	"slug": coalesce(
		${getDocumentWithFallback({ docType: 'gCategories', withSlug: true })}.slug.current,
		${getDocumentWithFallback({ docType: 'gSubcategories', withSlug: true })}.slug.current
	),
	"categoryTitle": coalesce(
		${getDocumentWithFallback({ docType: 'gCategories', withSlug: true })}.title,
		${getDocumentWithFallback({ docType: 'gSubcategories', withSlug: true })}.title
	),
	"locationsHeading": coalesce(
		${getDocumentWithFallback({ docType: 'gCategories', withSlug: true })}.locationsHeading[]{
			${portableTextContentFields}
		},
		${getDocumentWithFallback({ docType: 'gSubcategories', withSlug: true })}.locationsHeading[]{
			${portableTextContentFields}
		}
	),
	"locationsParagraph": coalesce(
		${getDocumentWithFallback({ docType: 'gCategories', withSlug: true })}.locationsParagraph[]{
			${portableTextContentFields}
		},
		${getDocumentWithFallback({ docType: 'gSubcategories', withSlug: true })}.locationsParagraph[]{
			${portableTextContentFields}
		},
	),
	"locationList": *[_type == "gLocations" && language == $language && hideFromIndex != true && (references(*[_type == "gCategories" && language == "en" && slug.current == $slug]._id) || references(*[_type == "gSubcategories" && language == "en" && slug.current == $slug]._id))]{
		${getLocationsData('card')}
	},
	"title": coalesce(
		*[_type == "gCategories" && slug.current == $slug && language == "en"][0].title,
		*[_type == "gSubcategories" && slug.current == $slug && language == "en"][0].title
	),
}`;

export const pageLocationsIndexWithArticleDataSSGQuery = groq`
  ${getDocumentWithFallback({ docType: 'pLocations' })}{
    ${locationIndexQuery},
    ${locationListAllQuery}
  }`;

export const pageLocationsPaginationMethodQuery = groq`
  {
    "articleTotalNumber": count(*[_type == "gLocations" && language == "en"]),
    "itemsPerPage": *[_type == "pLocations" && language == "en"][0].itemsPerPage
  }`;

export const pageLocationsSingleQuery = groq`
  ${getDocumentWithFallback({ docType: 'gLocations', withSlug: true })}{
    ${getLocationsData()},
    "defaultRelatedLocations": *[_type == "gLocations" && language == "en"
      && count(categories[@._ref in ^.^.categories[]._ref ]) > 0
      && _id != ^._id
      ] | order(publishedAt desc, _createdAt desc) [0..11] {
        ${getLocationsData('card')}
      },
    "defaultRelatedGuides": *[_type == "gGuides" && language == "en"
      && count(categories[@._ref in ^.^.categories[]._ref ]) > 0
      && _id != ^._id
      ] | order(publishedAt desc, _createdAt desc) [0..11] {
        ${getGuidesData('card')}
      }
  }`;

export const pageCasesSingleQuery = groq`
	${getDocumentWithFallback({ docType: 'gCases', withSlug: true })}{
    ${getCaseData()}
  }`;

export const pageItinerariesSingleQuery = groq`
  ${getDocumentWithFallback({ docType: 'gItineraries', withSlug: true })}{
    ${getItineraryData()},
    ${planFormData}
  }`;

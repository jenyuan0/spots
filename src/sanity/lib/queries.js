import { groq } from 'next-sanity';

// Construct our "home" page GROQ
export const homeID = groq`*[_type=="pHome"][0]._id`;

// Construct our "link" GROQ
const link = groq`
	_type,
	route,
	isNewTab
`;

// Construct our "menu" GROQ
const menu = groq`
	_key,
	_type,
	title,
	items[]{
		title,
		link {
			${link}
		}
	}
`;

// Construct our "image meta" GROQ
export const imageMeta = groq`
	asset,
  crop,
  customRatio,
  hotspot,
  ...asset -> {
    "id": assetId,
    "alt": coalesce(^.alt, altText),
    "type": mimeType,
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height,
    "aspectRatio": metadata.dimensions.aspectRatio,
    "lqip": metadata.lqip
   }
`;

// Construct our "image meta" GROQ
export const fileMeta = groq`
  asset,
  ...asset -> {
    "id": assetId,
    "filename": originalFilename,
    "type": mimeType,
    "size": size,
    "url": url,
    "extension": extension
  }
`;

export const callToAction = groq`
	label,
	link {
		${link}
	},
	"isButton": true
`;

export const colorMeta = groq`
	"title": lower(title),
	"colorD": colorD.hex,
	"colorL": colorL.hex,
`;

export const categoryMeta = groq`
	_id,
	title,
	"slug": slug.current,
	"colorTitle": color->title,
	"colorD": color->colorD.hex,
	"colorL": color->colorL.hex
`;

export const subcategoryMeta = groq`
	_id,
	title,
	"slug": slug.current,
	parentCategory->{${categoryMeta}}
`;

// Construct our "portable text content" GROQ
export const portableTextContent = groq`
	...,
	markDefs[]{
		...,
		_type == "link" => {
			${link}
		},
		_type == "callToAction" => {
			${callToAction}
		}
	},
	_type == "image" => {
		${imageMeta}
	}
`;

export const freeformObj = groq`
	...,
	_type,
	_key,
	content[]{
		${portableTextContent}
	},
	sectionAppearance
`;

export const getGuidesData = (type) => {
	let defaultData = groq`
		_type,
		_id,
		title,
		"slug": slug.current,
		thumb{
			${imageMeta}
		},
		publishDate,
		categories[]->{
			${categoryMeta}
		},
		subcategories[]->{
			${subcategoryMeta}
		},
		"color": lower(categories[0]->color->title),
		"colorHex": lower(categories[0]->color->colorD.hex),
		excerpt,`;
	if (type === 'card') {
		defaultData += groq`excerpt`;
	} else {
		defaultData += groq`
		showMap,
		content[]{
			${portableTextObj}
		},
		itineraries[]->{
			${getItineraryData('card')}
		},
		related[]->{
			${getGuidesData('card')}
		}`;
	}
	return defaultData;
};

export const getLocationsData = (type) => {
	let defaultData = groq`
		title,
		_id,
		"slug": slug.current,
		categories[]->{
			${categoryMeta}
		},
		subcategories[]->{
			${subcategoryMeta}
		},
		"color": lower(categories[0]->color->title),
		images[]{
			${imageMeta}
		},
		geo,
		address{
			street,
			city,
			zip
		},
		content[]{
			${portableTextContent}
		},`;
	if (type === 'card') {
		// defaultData += groq`
		// 	"thumb": images[0]{
		// 			${imageMeta}
		// 	},
		// `;
	} else {
		defaultData += groq`
			urls,
			fees,
			contentItinerary[]{
				${portableTextContent}
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
		${portableTextContent}
	},`;

export const getItineraryData = (type) => {
	let defaultData = groq`
		title,
		subtitle,
		_id,
		"slug": slug.current,
		images[]{
			${imageMeta}
		},
		color->{
			${colorMeta}
		},
		"totalDays": length(plan[]),
		"totalActivities": count(plan[].itineraryDay->activities[]),
		"totalLocations": count(plan[].itineraryDay->activities[].locations[]),`;
	if (type === 'card') {
		defaultData += groq`excerpt`;
	} else {
		defaultData += groq`
		introduction,
		accomodations[]->{
			${getLocationsData('card')}
		},
	  plan[]{
			"day": itineraryDay->{
				title,
				content,
				images[]{
					${imageMeta}
				},
				activities[] {
					${locationListObj}
				},
				relatedGuides[]->{
					${getGuidesData('card')}
				}
			},
			title,
			content
		},
		guides[]->{
			${getGuidesData('card')}
		},
		type,
		...select(type == "premade" => {
			NumOfTravelers,
			"budget": {
				"low": budget.budgetLow,
				"high": budget.budgetHigh
			},
			${planFormData}
		}),
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
				"attachments": attachments[]{${fileMeta}}
			}
		}),`;
	}
	return defaultData;
};

// Construct our content "modules" GROQ
// export const adObj = groq`
// 	...,
// 	_id,
// 	_type,
// 	title,
// 	content[]{
// 		${portableTextContent}
// 	},
// 	image{
// 		${imageMeta}
// 	},
// 	newsletterID,
// 	callToAction
// `;

export const pageModules = groq`
	_type == 'freeform' => {
		${freeformObj}
	},
	_type == 'carousel' => {
		_type,
		_key,
		items,
		autoplay,
		autoplayInterval,
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
					${imageMeta}
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

export const portableTextObj = groq`
	...,
	_type == 'carousel' => {
		_type,
		_key,
		items,
		autoplay,
		autoplayInterval,
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

export const planFormData = groq`
	"planForm": *[_type == "gPlanForm"][0]{
		image,
		formTitle,
		formHeading,
		${customForm},
		successMessage,
		errorMessage,
		formFailureNotificationEmail,
		email,
		whatsapp,
		line,
		faq[]{
			_key,
			title,
			answer[]{
				${portableTextContent}
			}
		}
	},`;

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
			"link": ${link}
		},
		"header": *[_type == "gHeader"][0]{
			menu[]{
				${menu}
			}
		},
		"footer": *[_type == "gFooter"][0]{
			menu->{
				${menu}
			},
			menuLegal->{
				${menu}
			},
		},
		"sharing": *[_type == "settingsGeneral"][0]{
			shareGraphic,
			favicon,
			faviconLight
		},
		"integrations": *[_type == "settingsIntegration"][0]{
			gtmID,
			gaID,
			KlaviyoApiKey,
		},
		"colors": *[_type == "settingsBrandColors"][]{
			${colorMeta}
		}
	}
`;

export const pageHomeQuery = `
	*[_type == "pHome"][0]{
		title,
		"slug": slug.current,
		sharing,
		"isHomepage": true,
		heroHeading[]{
			${portableTextContent}
		},
		heroSubheading,
		heroImage,
		heroSpots[]->{
			title,
			_id,
			"slug": slug.current,
			"color": lower(categories[0]->color->title),
		},
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
		masksImages[]{
			${imageMeta}
		},
		toggleHeading,
		toggleParagraph,
		toggleOffers,
		toggleCta,
		itinerariesTitle,
		itinerariesExcerpt[]{
			${portableTextContent}
		},
		"itinerariesItems": itinerariesItems[]->{
			${getItineraryData('card')}
		},
		${planFormData}
	}
`;

export const page404Query = `*[_type == "p404" && _id == "p404"][0]{
	heading,
	paragraph[]{
		${portableTextContent}
	},
	callToAction{
		${callToAction}
	}
}`;

export const pagesBySlugQuery = groq`
	*[_type == "pGeneral" && slug.current == $slug][0]{
		title,
		"slug": slug.current,
		sharing,
		pageModules[]{
			${pageModules}
		},
	}`;

export const pageContactQuery = groq`
	*[_type == "pContact"][0]{
		title,
		"slug": slug.current,
		${planFormData}
	}
`;

export const pageTripReadyQuery = groq`
	*[_type == "pTripReady"][0]{
		title,
		"slug": slug.current,
		"itineraries": itineraries[]->{
			${getItineraryData('card')}
		},
	}
`;

// new pages below...
// export const pageAboutQuery = groq`
// 	*[_type == "pAbout"][0]{
// 		title,
// 		"slug": slug.current,
// 		sharing
// 	}`;

// PARIS PAGE
export const pageParisQuery = groq`
	*[_type == "pParis"][0]{
		title,
		"slug": slug.current,
		"locationCategories": locationCategories[]->{
			${categoryMeta}
		},
		"locationList": *[_type == "gLocations"] | order(_updatedAt desc)[0...30] {
			${getLocationsData('card')}
		},
		itinerariesTitle,
		itinerariesExcerpt[]{
			${portableTextContent}
		},
		"itinerariesItems": itinerariesItems[]->{
			${getItineraryData('card')}
		},
		contentList[]{
			title,
			subtitle,
			excerpt[]{
				${portableTextContent}
			},
			items[]{
				_type == 'categoryGuides' => {
					"category": @-> {
						_id,
						title,
						"items": *[_type == "gGuides" && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
							${getGuidesData('card')}
						}
					}
				},
				_type == 'subcategoryGuides' => {
					"subcategory": @-> {
						_id,
						title,
						"items": *[_type == "gSubcategories" && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
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
						"items": *[_type == "gLocations" && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
							${getLocationsData('card')}
						}
					}
				},
				_type == 'subcategoryLocations' => {
					"subcategory": @-> {
						_id,
						title,
						"items": *[_type == "gSubcategories" && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
							${getLocationsData('card')}
						}
					}
				},
				_type == 'location' => @-> {
					${getLocationsData('card')}
				},
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
				},
			},
		},
		sharing,
	}
`;

// GUIDES
export const articleListAllQuery = groq`
	"articleList": *[_type == "gGuides"] | order(_updatedAt desc) {
		${getGuidesData('card')}
	}
`;

export const guidesIndexQuery = groq`
	title,
	heading[]{
		${portableTextContent}
	},
	"categories": categories[]->{
		${categoryMeta}
	},
	itemsPerPage,
	paginationMethod,
	loadMoreButtonLabel,
	infiniteScrollCompleteLabel,
`;

export const pageGuidesIndexDefaultQuery = groq`
	_type,
	title,
	${guidesIndexQuery}
	sharing`;

export const pageGuidesIndex = groq`
	*[_type == "pGuides"][0]{
		${pageGuidesIndexDefaultQuery}
	}`;

export const pageGuidesCategoryQuery = groq`{
	...*[_type == "pGuides"][0]{
		${guidesIndexQuery}
	},
	"categorySlug": *[_type == "gCategories" && slug.current == $slug][0].slug.current,
	"articleList": *[_type == "gGuides" && references(*[_type == "gCategories" && slug.current == $slug]._id)] {
		${getGuidesData('card')}
	},
	"sharing": *[_type == "gCategories" && slug.current == $slug][0]{
		"disableIndex": sharing.disableIndex,
		"metaTitle": sharing.metaTitle,
		"metaDesc": sharing.metaDesc,
		"shareGraphic": sharing.shareGraphic
	}
}`;

export const pageGuidesIndexWithArticleDataSSGQuery = groq`
	*[_type == "pGuides"][0]{
		${pageGuidesIndexDefaultQuery},
		${articleListAllQuery}
	}`;

export const pageGuidesPaginationMethodQuery = groq`
	{
		"articleTotalNumber": count(*[_type == "gGuides"])}
		"itemsPerPage": *[_type == "pGuides"][0].itemsPerPage
	}`;

export const pageGuidesSingleQuery = groq`
	*[_type == "gGuides" && slug.current == $slug][0]{
		${getGuidesData()},
		"defaultRelated": *[_type == "gGuides"
			&& count(categories[@._ref in ^.^.categories[]._ref]) > 0
			&& _id != ^._id
			] | order(publishedAt desc, _createdAt desc) [0..1] {
				${getGuidesData('card')}
			}
	}`;

// LOCATIONS
export const locationListAllQuery = groq`
	"locationList": *[_type == "gLocations"] | order(_updatedAt desc) {
		${getLocationsData('card')}
	}
`;

export const locationIndexQuery = groq`
	title,
	heading[]{
		${portableTextContent}
	},
	"categories": categories[]->{
		${categoryMeta}
	},
	itemsPerPage,
	paginationMethod,
	loadMoreButtonLabel,
	infiniteScrollCompleteLabel,
`;

export const pageLocationsIndexDefaultQuery = groq`
	_type,
	"slug": "locations",
	${locationIndexQuery}
	sharing`;

export const pageLocationsIndex = groq`
	*[_type == "pLocations"][0]{
		${pageLocationsIndexDefaultQuery}
	}`;

export const pageLocationsCategoryQuery = groq`{
	...*[_type == "pLocations"][0]{
		${locationIndexQuery}
	},
	"categorySlug": *[_type == "gCategories" && slug.current == $slug][0].slug.current,
	"locationList": *[_type == "gLocations" && references(*[_type == "gCategories" && slug.current == $slug]._id)] {
		${getLocationsData('card')}
	},
	"sharing": *[_type == "gCategories" && slug.current == $slug][0]{
		"disableIndex": sharing.disableIndex,
		"metaTitle": sharing.metaTitle,
		"metaDesc": sharing.metaDesc,
		"shareGraphic": sharing.shareGraphic
	}
}`;

export const pageLocationsIndexWithArticleDataSSGQuery = groq`
	*[_type == "pLocations"][0]{
		${pageLocationsIndexDefaultQuery},
		${locationListAllQuery}
	}`;

export const pageLocationsPaginationMethodQuery = groq`
	{
		"articleTotalNumber": count(*[_type == "gLocations"])}
		"itemsPerPage": *[_type == "pLocations"][0].itemsPerPage
	}`;

export const pageLocationsSingleQuery = groq`
	*[_type == "gLocations" && slug.current == $slug][0]{
		${getLocationsData()},
		"defaultRelatedLocations": *[_type == "gLocations"
			&& count(categories[@._ref in ^.^.categories[]._ref ]) > 0
			&& _id != ^._id
			] | order(publishedAt desc, _createdAt desc) [0..11] {
				${getLocationsData('card')}
			},
		"defaultRelatedGuides": *[_type == "gGuides"
			&& count(categories[@._ref in ^.^.categories[]._ref ]) > 0
			&& _id != ^._id
			] | order(publishedAt desc, _createdAt desc) [0..11] {
				${getGuidesData('card')}
			}
	}`;

// ITINERARIES
export const pageItinerariesSingleQuery = groq`
	*[_type == "gItineraries" && slug.current == $slug][0]{
		${getItineraryData()}
		${planFormData}
	}`;

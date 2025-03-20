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

export const getLocationsData = (type) => {
	let defaultData = groq`
		title,
		_id,
		"slug": slug.current,
		"categories": categories[]->{
			${categoryMeta}
		},
		"subcategories": subcategories[]->{
			${subcategoryMeta}
		},
		"color": lower(categories[0]->color->title),
		"images": images[]{
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
			"relatedLocations": relatedLocations[]->{
				${getLocationsData('card')}
			},
			"relatedGuides": relatedGuides[]->{
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
	"locations": locations[]->{
		${getLocationsData('card')}
	},
	"fallbackRains": fallbackRains[]->{
		${getLocationsData('card')}
	},
	"fallbackLongWait": fallbackLongWait[]->{
		${getLocationsData('card')}
	}
`;

export const getItineraryData = (type) => {
	let defaultData = groq`
		title,
		_id,
		"slug": slug.current,
		"images": images[]{
			${imageMeta}
		},
		"numDays": length(plan[]),`;
	if (type === 'card') {
		defaultData += groq`excerpt`;
	} else {
		defaultData += groq`
		startingColor,
	  plan[]{
			"day": itineraryDay->{
				title,
				content,
				"images": images[]{
					${imageMeta}
				},
				"activities": activities[] {
					${locationListObj}
				},
				"relatedGuides": relatedGuides[]->{
					${getGuidesData('card')}
				}
			},
			title,
			content
		},
		"guides": guides[]->{
			${getGuidesData('card')}
		},
		type,
		...select(type == "premade" => {
			NumOfDays,
			NumOfTravelers,
			"budget": {
				"low": budget.budgetLow,
				"high": budget.budgetHigh
			},
			"accommodations": accomodations[]->{
				${getLocationsData('card')}
			}
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
	_type == 'ad' =>  *[_type == 'gAds' && _id == ^._ref][0]
`;

const customForm = groq`
	customForm {
		formFields[] {
			placeholder,
			_key,
			required,
			fieldLabel,
			inputType,
			selectOptions[] {
				_key,
				"title": option,
				"value": option
			}
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
		heroImage,
		heroSpots[]->{
			title,
			_id,
			"slug": slug.current,
		},
		introTitle,
		introHeading,
		introCta,
		"highlights": highlights[]{
			${imageMeta}
		},
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
		contactForm {
			formTitle,
			${customForm},
			successMessage,
			errorMessage,
			formFailureNotificationEmail
		}
	}
`;

// new pages below...
// export const pageAboutQuery = groq`
// 	*[_type == "pAbout"][0]{
// 		title,
// 		"slug": slug.current,
// 		sharing
// 	}`;

// GUIDES
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
		"categories": categories[]->{
			${categoryMeta}
		},
		"subcategories": subcategories[]->{
			${subcategoryMeta}
		},
		"color": lower(categories[0]->color->title),`;
	if (type === 'card') {
		defaultData += groq`excerpt`;
	} else {
		defaultData += groq`
		showContentTable,
		showMap,
		pageModules[]{
			${pageModules}
		},
		"related": related[]->{
			${getGuidesData('card')}
		}`;
	}
	return defaultData;
};

export const articleListAllQuery = groq`
	"articleList": *[_type == "gGuides"] | order(_updatedAt desc) {
		${getGuidesData('card')}
	}
`;

export const pageGuidesIndexDefaultQuery = groq`
	_type,
	title,
	"slug": "guides",
	itemsPerPage,
	paginationMethod,
	loadMoreButtonLabel,
	infiniteScrollCompleteLabel,
	"itemsTotalCount": count(*[_type == "gGuides"]),
	sharing`;

export const pageGuidesIndex = groq`
	*[_type == "pGuides"][0]{
		${pageGuidesIndexDefaultQuery}
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

export const pageLocationsIndexDefaultQuery = groq`
	_type,
	title,
	"slug": "locations",
	heading[]{
		${portableTextContent}
	},
	itemsPerPage,
	paginationMethod,
	loadMoreButtonLabel,
	infiniteScrollCompleteLabel,
	"itemsTotalCount": count(*[_type == "gLocations"]),
	guideList[]{
		title,
		content[]{
			${portableTextContent}
		},
		color,
		"items": items[]{
			_type == 'guide' => @-> {
				${getGuidesData('card')}
			},
			_type == 'category' => {
				"category": @-> {
					_id,
					title,
					"guides": *[_type == "gGuides" && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
						${getGuidesData('card')}
					}
				}
			},
			_type == 'subcategory' => {
				"subcategory": @-> {
					_id,
					title,
					"guides": *[_type == "gSubcategories" && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
						${getGuidesData('card')}
					}
				}
			},
			_type == 'itinerary' => @-> {
				${getItineraryData()}
			},
		}
	},
	sharing`;

export const pageLocationsIndex = groq`
	*[_type == "pLocations"][0]{
		${pageLocationsIndexDefaultQuery}
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
			] | order(publishedAt desc, _createdAt desc) [0..3] {
				${getLocationsData('card')}
			},
		"defaultRelatedGuides": *[_type == "gGuides"
			&& count(categories[@._ref in ^.^.categories[]._ref ]) > 0
			&& _id != ^._id
			] | order(publishedAt desc, _createdAt desc) [0..3] {
				${getGuidesData('card')}
			}
	}`;

export const pageItinerariesSingleQuery = groq`
	*[_type == "gItineraries" && slug.current == $slug][0]{
		${getItineraryData()}
	}`;

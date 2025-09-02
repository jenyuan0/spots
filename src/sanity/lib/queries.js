import { groq } from 'next-sanity';

// Construct our "home" page GROQ
export const homeID = groq`*[_type=="pHome"][0]._id`;

// Base queries for common fields
const baseFields = groq`
  _id,
  _type,
  title,
  "slug": slug.current,
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
    categories[]->{
      ${categoryMetaFields}
    },
    subcategories[]->{
      ${subcategoryMetaFields}
    },
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
    },`;
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
    categories[]->{
      ${categoryMetaFields}
    },
    subcategories[]->{
      ${subcategoryMetaFields}
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
          images[0...6]{
            ${imageMetaFields}
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
          "attachments": attachments[]{${fileMetaFields}}
        }
      })`;
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
      accomodations[]->{
        ${getLocationsData('card')}
      },
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

export const planFormData = groq`
  "planForm": *[_type == "gPlanForm"][0]{
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
    faq[]{
      _key,
      title,
      answer[]{
        ${portableTextContentFields}
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
      "link": ${linkFields}
    },
    "header": *[_type == "gHeader"][0]{
      menu[]{
        ${menuFields}
      }
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
    }
  }
`;

export const pageHomeQuery = groq`
  *[_type == "pHome"][0]{
    ${baseFields},
    "isHomepage": true,
    heroHeading[]{
      ${portableTextContentFields}
    },
    heroSubheading,
    heroImage,
    heroSpots[]->{
      title,
      _id,
      "slug": slug.current,
      "color": lower(categories[0]->color->title)
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
    "itinerariesItems": itinerariesItems[]->{
      ${getItineraryData('card')}
    },
    ${planFormData}
  }
`;

export const page404Query = groq`
  *[_type == "p404" && _id == "p404"][0]{
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
  *[_type == "pGeneral" && slug.current == $slug][0]{
    ${baseFields},
    pageModules[]{
      ${pageModules}
    }
  }`;

export const pageHotelBookingQuery = groq`
  *[_type == "pHotelBooking"][0]{
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
    }
  }
`;

export const pageTravelDesignQuery = groq`
  *[_type == "pTravelDesign"][0]{
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
    "caseItems": caseItems[]->{
      ${getCaseData('card')}
    },
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
    }
  }
`;

export const pageContactQuery = groq`
  *[_type == "pContact"][0]{
    ${baseFields},
    ${planFormData}
  }
`;

export const pageTripReadyQuery = groq`
  *[_type == "pTripReady"][0]{
    ${baseFields},
    paragraph[]{
      ${portableTextContentFields}
    },
    "itineraries": itineraries[]->{
      ${getItineraryData('card')}
    }
  }
`;

export const pageParisQuery = groq`
  *[_type == "pParis"][0]{
    ${baseFields},
    "locationCategories": locationCategories[]->{
      ${categoryMetaFields}
    },
    "locationList": *[_type == "gLocations"] | order(_updatedAt desc)[0...30] {
      ${getLocationsData('card')}
    },
    itinerariesTitle,
    itinerariesExcerpt[]{
      ${portableTextContentFields}
    },
    "itinerariesItems": itinerariesItems[]->{
      ${getItineraryData('card')}
    },
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
            "items": *[_type == "gGuides" && hideFromIndex != true && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
              ${getGuidesData('card')}
            }
          }
        },
        _type == 'subcategoryGuides' => {
          "subcategory": @-> {
            _id,
            title,
            "items": *[_type == "gSubcategories" && hideFromIndex != true && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
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
            "items": *[_type == "gLocations" && hideFromIndex != true && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
              ${getLocationsData('card')}
            }
          }
        },
        _type == 'subcategoryLocations' => {
          "subcategory": @-> {
            _id,
            title,
            "items": *[_type == "gSubcategories" && hideFromIndex != true && references(^._id)] | order(publishedAt desc, _createdAt desc) [0..11] {
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
    }
  }
`;

export const articleListAllQuery = groq`
  "articleList": *[_type == "gGuides"] | order(_updatedAt desc)[0...200] {
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
  "categories": categories[]->{
    ${categoryMetaFields}
  },
  itemsPerPage,
  paginationMethod,
  loadMoreButtonLabel,
  infiniteScrollCompleteLabel
`;

export const pageGuidesIndex = groq`
  *[_type == "pGuides"][0]{
    ${guidesIndexQuery}
  }`;

export const pageGuidesCategoryQuery = groq`{
  ...*[_type == "pGuides"][0]{
    ${guidesIndexQuery}
  },
	"_type": "pGuidesCategory",
	"slug": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].slug.current,
		*[_type == "gSubcategories" && slug.current == $slug][0].slug.current
	),
	"isCategoryPage": true,
	"parentCategory": *[_type == "gSubcategories" && slug.current == $slug][0].parentCategory->{
		"slug": slug.current,
		title,
	},
	"subcategories": select(
		defined(*[_type == "gSubcategories" && slug.current == $slug][0].parentCategory) =>
			*[
				_type == "gSubcategories" &&
				parentCategory._ref == *[_type == "gSubcategories" && slug.current == $slug][0].parentCategory._ref
			]{
				${baseFields},
				"colorTitle": parentCategory->color->title,
				"colorD": parentCategory->color->colorD.hex,
				"colorL": parentCategory->color->colorL.hex
			},
		true =>
			*[
				_type == "gSubcategories" &&
				parentCategory._ref == *[_type == "gCategories" && slug.current == $slug][0]._id
			]{
				${baseFields},
				"colorTitle": parentCategory->color->title,
				"colorD": parentCategory->color->colorD.hex,
				"colorL": parentCategory->color->colorL.hex
			}
	),
	"categoryTitle": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].title,
		*[_type == "gSubcategories" && slug.current == $slug][0].title
	),
	"guidesHeading": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].guidesHeading[]{
			${portableTextContentFields}
		},
		*[_type == "gSubcategories" && slug.current == $slug][0].guidesHeading[]{
			${portableTextContentFields}
		}
	),
	"guidesParagraph": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].guidesParagraph[]{
			${portableTextContentFields}
		},
		*[_type == "gSubcategories" && slug.current == $slug][0].guidesParagraph[]{
			${portableTextContentFields}
		},
	),
	"articleList": *[_type == "gGuides" && hideFromIndex != true && (references(*[_type == "gCategories" && slug.current == $slug]._id) || references(*[_type == "gSubcategories" && slug.current == $slug]._id))] {
		${getGuidesData('card')}
	},
	"title": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].title,
		*[_type == "gSubcategories" && slug.current == $slug][0].title
	) + " Guides",
}`;

export const pageGuidesIndexWithArticleDataSSGQuery = groq`
  *[_type == "pGuides"][0]{
    ${guidesIndexQuery},
    ${articleListAllQuery}
  }`;

export const pageGuidesPaginationMethodQuery = groq`
  {
    "articleTotalNumber": count(*[_type == "gGuides"]),
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

export const locationListAllQuery = groq`
  "locationList": *[_type == "gLocations" && hideFromIndex != true] | order(_updatedAt desc)[0...300] {
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
  "categories": categories[]->{
    ${categoryMetaFields}
  },
  itemsPerPage,
  paginationMethod,
  loadMoreButtonLabel,
  infiniteScrollCompleteLabel
`;

export const pageLocationsIndex = groq`
  *[_type == "pLocations"][0]{
    ${locationIndexQuery}
  }`;

export const pageLocationsCategoryQuery = groq`{
  ...*[_type == "pLocations"][0]{
    ${locationIndexQuery}
  },
	"_type": "pLocationsCategory",
	"isCategoryPage": true,
	"parentCategory": *[_type == "gSubcategories" && slug.current == $slug][0].parentCategory->{
		"slug": slug.current,
		title,
		_id,
	},
	"subcategories": select(
		defined(*[_type == "gSubcategories" && slug.current == $slug][0].parentCategory) =>
			*[
				_type == "gSubcategories" &&
				parentCategory._ref == *[_type == "gSubcategories" && slug.current == $slug][0].parentCategory._ref
			]{
				${baseFields},
				"colorTitle": parentCategory->color->title,
				"colorD": parentCategory->color->colorD.hex,
				"colorL": parentCategory->color->colorL.hex
			},
		true =>
			*[
				_type == "gSubcategories" &&
				parentCategory._ref == *[_type == "gCategories" && slug.current == $slug][0]._id
			]{
				${baseFields},
				"colorTitle": parentCategory->color->title,
				"colorD": parentCategory->color->colorD.hex,
				"colorL": parentCategory->color->colorL.hex
			}
	),
	"slug": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].slug.current,
		*[_type == "gSubcategories" && slug.current == $slug][0].slug.current
	),
	"categoryTitle": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].title,
		*[_type == "gSubcategories" && slug.current == $slug][0].title
	),
	"locationsHeading": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].locationsHeading[]{
			${portableTextContentFields}
		},
		*[_type == "gSubcategories" && slug.current == $slug][0].locationsHeading[]{
			${portableTextContentFields}
		}
	),
	"locationsParagraph": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].locationsParagraph[]{
			${portableTextContentFields}
		},
		*[_type == "gSubcategories" && slug.current == $slug][0].locationsParagraph[]{
			${portableTextContentFields}
		},
	),
	"locationList": *[_type == "gLocations" && hideFromIndex != true && (references(*[_type == "gCategories" && slug.current == $slug]._id) || references(*[_type == "gSubcategories" && slug.current == $slug]._id))] {
		${getLocationsData('card')}
	},
	"title": coalesce(
		*[_type == "gCategories" && slug.current == $slug][0].title,
		*[_type == "gSubcategories" && slug.current == $slug][0].title
	),
}`;

export const pageLocationsIndexWithArticleDataSSGQuery = groq`
  *[_type == "pLocations"][0]{
    ${locationIndexQuery},
    ${locationListAllQuery}
  }`;

export const pageLocationsPaginationMethodQuery = groq`
  {
    "articleTotalNumber": count(*[_type == "gLocations"]),
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

export const pageCasesSingleQuery = groq`
  *[_type == "gCases" && slug.current == $slug][0]{
    ${getCaseData()}
  }`;

export const pageItinerariesSingleQuery = groq`
  *[_type == "gItineraries" && slug.current == $slug][0]{
    ${getItineraryData()},
    ${planFormData}
  }`;

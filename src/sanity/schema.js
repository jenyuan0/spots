// Setting types
import settingsGeneral from './schemas/documents/settings-general';
import settingsBrandColors from './schemas/documents/settings-color';
import settingsMenu from './schemas/documents/settings-menu';
import settingsRedirect from './schemas/documents/settings-redirect';
import settingsIntegration from './schemas/documents/settings-integrations';

// Object types
import button from './schemas/objects/button';
import formBuilder from './schemas/objects/form-builder';
import formFields from './schemas/objects/form-builder/form-fields';
import link from './schemas/objects/link';
import navDropdown from './schemas/objects/nav-dropdown';
import navItem from './schemas/objects/nav-item';
import portableText from './schemas/objects/portable-text';
import portableTextSimple from './schemas/objects/portable-text-simple';
import sectionAppearance from './schemas/objects/section-appearance';
import socialLink from './schemas/objects/social-link';

// Module types
import freeform from './schemas/modules/freeform';
import carousel from './schemas/modules/carousel';
import marquee from './schemas/modules/marquee';
import newsletter from './schemas/modules/newsletter';
import accordion from './schemas/modules/accordion';
import accordionList from './schemas/modules/accordion-list';
import locationList from './schemas/modules/location-list';

// Global types
import gAnnouncement from './schemas/documents/g-announcement';
import gHeader from './schemas/documents/g-header';
import gFooter from './schemas/documents/g-footer';
import gLocations from './schemas/documents/g-locations';
import gItinerariesDay from './schemas/documents/g-itineraries-day';
import gItineraries from './schemas/documents/g-itineraries';
import gGuides from './schemas/documents/g-guides';
import gFAQ from './schemas/documents/g-faq';
import gCategories from './schemas/documents/g-categories';
import gAuthors from './schemas/documents/g-authors';
import gAds from './schemas/documents/g-ads';

// Page types
import pGeneral from './schemas/documents/p-general';
import p404 from './schemas/documents/p-404';
import pHome from './schemas/documents/p-home';
import pGuides from './schemas/documents/p-guides';
import pContact from './schemas/documents/p-contact';

const schemas = [
	settingsGeneral,
	settingsBrandColors,
	settingsMenu,
	settingsRedirect,
	settingsIntegration,

	button,
	formBuilder,
	formFields,
	link,
	navDropdown,
	navItem,
	portableText,
	portableTextSimple,
	sectionAppearance,
	socialLink,

	freeform,
	carousel,
	marquee,
	newsletter,
	accordion,
	accordionList,
	locationList,

	gAnnouncement,
	gHeader,
	gFooter,
	gLocations,
	gItinerariesDay,
	gItineraries,
	gGuides,
	gFAQ,
	gCategories,
	gAuthors,
	gAds,

	pGeneral,
	p404,
	pHome,

	pGuides,
	pContact,
];

export default schemas;

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
import sharing from './schemas/objects/sharing';
import socialLink from './schemas/objects/social-link';

// Module types
import freeform from './schemas/modules/freeform';
import carousel from './schemas/modules/carousel';
import marquee from './schemas/modules/marquee';
import newsletter from './schemas/modules/newsletter';
import accordion from './schemas/modules/accordion';
import accordionList from './schemas/modules/accordion-list';

// Global types
import gAnnouncement from './schemas/documents/g-announcement';
import gHeader from './schemas/documents/g-header';
import gFooter from './schemas/documents/g-footer';

// Page types
import pGeneral from './schemas/documents/p-general';
import p404 from './schemas/documents/p-404';
import pHome from './schemas/documents/p-home';

import pBlogIndex from './schemas/documents/p-blog-index';
import pBlog from './schemas/documents/p-blog';
import pBlogAuthor from './schemas/documents/p-blog-author';
import pBlogCategory from './schemas/documents/p-blog-category';
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
	sharing,
	socialLink,

	freeform,
	carousel,
	marquee,
	newsletter,
	accordion,
	accordionList,

	gAnnouncement,
	gHeader,
	gFooter,

	pGeneral,
	p404,
	pHome,

	pBlogIndex,
	pBlog,
	pBlogAuthor,
	pBlogCategory,
	pContact,
];

export default schemas;

import { globalMenu } from './desk/global';
import { pagesMenu, otherPagesMenu } from './desk/pages';
import {
	globalLocations,
	globalItinerariesDay,
	globalItineraries,
	globalGuides,
	globalFAQ,
	globalAds,
	globalCategories,
	globalSubcategories,
	globalAuthors,
} from './desk/g-misc';
import { menusMenu } from './desk/menus';
import { colorsMenu } from './desk/colors';
import { settingsMenu } from './desk/settings';

const deskStructure = (S) =>
	S.list()
		.title('Spots.Paris')
		.items([
			globalMenu(S),
			pagesMenu(S),
			otherPagesMenu(S),
			S.divider(),
			globalLocations(S),
			globalItinerariesDay(S),
			globalItineraries(S),
			S.divider(),
			globalGuides(S),
			globalFAQ(S),
			globalAds(S),
			S.divider(),
			globalCategories(S),
			globalSubcategories(S),
			// globalAuthors(S),
			S.divider(),
			menusMenu(S),
			colorsMenu(S),
			settingsMenu(S),
		]);

export default deskStructure;

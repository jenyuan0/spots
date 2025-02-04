import { globalMenu } from './desk/global';
import { pagesMenu, otherPagesMenu } from './desk/pages';
import {
	globalLocations,
	globalItineraries,
	globalGuides,
	globalFAQ,
	globalCategories,
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
			globalItineraries(S),
			globalGuides(S),
			globalFAQ(S),
			S.divider(),
			globalCategories(S),
			globalAuthors(S),
			S.divider(),
			menusMenu(S),
			colorsMenu(S),
			settingsMenu(S),
		]);

export default deskStructure;

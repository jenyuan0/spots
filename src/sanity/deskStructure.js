import { globalMenu } from './desk/global';
import { pagesMenu, otherPagesMenu } from './desk/pages';
import { pageBlog } from './desk/p-blog';
import { menusMenu } from './desk/menus';
import { colorsMenu } from './desk/colors';
import { settingsMenu } from './desk/settings';

const deskStructure = (S) =>
	S.list()
		.title('Website')
		.items([
			globalMenu(S),
			pagesMenu(S),
			otherPagesMenu(S),
			S.divider(),
			pageBlog(S),
			S.divider(),
			menusMenu(S),
			colorsMenu(S),
			S.divider(),
			settingsMenu(S),
		]);

export default deskStructure;

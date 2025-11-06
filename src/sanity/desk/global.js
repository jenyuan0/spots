import { ComponentIcon } from '@sanity/icons';

export const globalMenu = (S) => {
	return S.listItem()
		.title('Global Modules')
		.child(
			S.list()
				.title('Global Modules')
				.items([
					S.listItem()
						.title('Announcement')
						.child(
							S.editor()
								.id('gAnnouncement')
								.schemaType('gAnnouncement')
								.documentId('gAnnouncement')
						)
						.icon(ComponentIcon),
					S.listItem()
						.title('Header')
						.child(
							S.editor()
								.id('gHeader')
								.schemaType('gHeader')
								.documentId('gHeader')
						)
						.icon(ComponentIcon),
					S.listItem()
						.title('Footer')
						.child(
							S.editor()
								.id('gFooter')
								.schemaType('gFooter')
								.documentId('gFooter')
						)
						.icon(ComponentIcon),
					S.listItem()
						.title('Newsletter')
						.child(
							S.editor()
								.id('gNewsletter')
								.schemaType('gNewsletter')
								.documentId('gNewsletter')
						)
						.icon(ComponentIcon),
					S.listItem()
						.title('Plan Form')
						.child(
							S.editor()
								.id('gPlanForm')
								.schemaType('gPlanForm')
								.documentId('gPlanForm')
						)
						.icon(ComponentIcon),
				])
		)
		.icon(ComponentIcon);
};

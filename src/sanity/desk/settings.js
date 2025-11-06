import {
	CogIcon,
	EarthGlobeIcon,
	PackageIcon,
	EnterRightIcon,
	BookIcon,
} from '@sanity/icons';

export const settingsMenu = (S) => {
	return S.listItem()
		.title('Settings')
		.child(
			S.list()
				.title('Settings')
				.items([
					S.listItem()
						.title('General')
						.child(
							S.editor()
								.id('settingsGeneral')
								.schemaType('settingsGeneral')
								.documentId('settingsGeneral')
						)
						.icon(EarthGlobeIcon),
					S.listItem()
						.title('Integrations')
						.child(
							S.editor()
								.id('settingsIntegration')
								.schemaType('settingsIntegration')
								.documentId('settingsIntegration')
						)
						.icon(PackageIcon),
					S.listItem()
						.title('Redirects')
						.child(S.documentTypeList('settingsRedirect').title('Redirects'))
						.icon(EnterRightIcon),
				])
		)
		.icon(CogIcon);
};

export const settingsLocalization = (S) => {
	return S.listItem()
		.id('settingsLocalization')
		.title('Localization')
		.icon(BookIcon)
		.child(
			S.editor()
				.title('Localization')
				.id('settingsLocalization')
				.schemaType('settingsLocalization')
				.documentId('settingsLocalization')
		);
};

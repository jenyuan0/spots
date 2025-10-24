import { headers } from 'next/headers';
import { get404PageData } from '@/sanity/lib/fetch';
import Page404 from '@/app/[lang]/(pages)/_components/Page404';
import { i18n } from '../../../../languages';

async function detectLanguage(headersList) {
	const activatedLanguages = i18n.languages.map((language) => language.id);

	// 1. Try to get language from referer
	const referer = headersList.get('referer') || '';
	if (referer) {
		try {
			const refererUrl = new URL(referer);
			const pathSegments = refererUrl?.pathname?.split('/').filter(Boolean);
			const langSegment = pathSegments[0];

			if (activatedLanguages.includes(langSegment)) {
				return langSegment;
			}
		} catch {
			console.error(
				'Page 404 page could not find language param in header referer'
			);
		}
	}

	const cookie = headersList.get('cookie') || '';
	const langCookie = cookie
		.split(';')
		.find((c) => c.trim().startsWith('preferredLanguage='))
		?.split('=')[1]
		?.trim();

	if (langCookie && activatedLanguages.includes(langCookie)) {
		return langCookie;
	}

	// 3. Check Accept-Language header
	const acceptLanguage = headersList.get('accept-language') || '';
	if (acceptLanguage) {
		const primaryLang = acceptLanguage
			.split(',')[0]
			.split('-')[0]
			.toLowerCase();

		if (activatedLanguages.includes(primaryLang)) {
			return primaryLang;
		}
	}

	return 'en';
}

export default async function NotFound() {
	const headersList = await headers();
	const targetLanguage = await detectLanguage(headersList);

	// Create params object
	const params = {
		lang: targetLanguage,
		slug: [],
	};

	const pageData = await get404PageData({ params });
	const { page } = pageData || {};

	return <Page404 data={page} />;
}

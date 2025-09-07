import { NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import { i18n } from '../languages';
import Negotiator from 'negotiator';

// Cache supported locale IDs to avoid repeated array mapping
const SUPPORTED_LOCALE_IDS = i18n.languages.map((item) => item.id);

// Create a Set for O(1) locale checking instead of O(n) array operations
const SUPPORTED_LOCALES_SET = new Set(SUPPORTED_LOCALE_IDS);

// Cache the locale pattern regex for better performance
const LOCALE_PATH_REGEX = new RegExp(
	`^/(${SUPPORTED_LOCALE_IDS.join('|')})(/|$)`,
	'i' // Add case-insensitive flag
);

function getLocale(request) {
	// Negotiator expects plain object so we need to transform headers
	const negotiatorHeaders = {};
	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

	// Use negotiator and intl-localematcher to get best locale
	let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
		i18n.languages
	);

	return matchLocale(languages, SUPPORTED_LOCALE_IDS, i18n.base);
}

export function middleware(request) {
	// Add null checks to prevent build errors
	if (!request || !request.nextUrl) {
		return NextResponse.next();
	}

	const pathname = request.nextUrl?.pathname;

	console.log('LOCALE_PATH_REGEX:', LOCALE_PATH_REGEX);
	console.log('Testing pathname:', pathname);
	console.log('hasLocale result:', LOCALE_PATH_REGEX.test(pathname));

	// Ignore specific files and paths
	if (
		pathname.startsWith('/_next/') ||
		pathname.startsWith('/api/') ||
		pathname.includes('.') // Ignore files with extensions
	) {
		return;
	}

	// Use regex for faster locale detection instead of array.every()
	const hasLocale = LOCALE_PATH_REGEX.test(pathname);

	// Redirect if there is no locale
	if (!hasLocale) {
		const locale = getLocale(request);
		// Clean up pathname - remove leading slash to avoid double slash
		const cleanPathname = pathname.startsWith('/')
			? pathname.slice(1)
			: pathname;
		return NextResponse.redirect(
			new URL(`/${locale}/${cleanPathname}`, request.url)
		);
	}
	return NextResponse.next();
}

export const config = {
	// Matcher ignoring `/_next/` and `/api/`
	matcher: ['/((?!api|_next|sanity|.*\\..*).*)'],
};

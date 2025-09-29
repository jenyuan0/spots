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
	'i' // IMPORTANT: Case-insensitive for detection
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

// Add this helper function to find the correct locale ID with proper casing
function getNormalizedLocale(pathname) {
	// Extract the potential locale from the pathname
	const pathSegments = pathname.split('/').filter(Boolean);
	if (pathSegments.length === 0) return null;

	const potentialLocale = pathSegments[0];

	// Find matching locale with correct casing (case-insensitive search)
	const normalizedLocale = SUPPORTED_LOCALE_IDS.find(
		(locale) => locale.toLowerCase() === potentialLocale.toLowerCase()
	);

	return normalizedLocale;
}

export function middleware(request) {
	// Add null checks to prevent build errors
	if (!request || !request.nextUrl) {
		return NextResponse.next();
	}

	const pathname = request.nextUrl?.pathname;

	// Ignore specific files and paths
	if (
		pathname.startsWith('/_next/') ||
		pathname.startsWith('/api/') ||
		pathname.includes('.') // Ignore files with extensions
	) {
		return;
	}

	// Check if path has a locale (case-insensitive)
	const hasLocale = LOCALE_PATH_REGEX.test(pathname);

	if (hasLocale) {
		// Locale exists, but check if it needs case correction
		const normalizedLocale = getNormalizedLocale(pathname);
		const pathSegments = pathname.split('/').filter(Boolean);
		const currentLocale = pathSegments[0];

		// If the case doesn't match, redirect to correct case
		if (normalizedLocale && currentLocale !== normalizedLocale) {
			const restOfPath = pathSegments.slice(1).join('/');
			const correctedPath = `/${normalizedLocale}${restOfPath ? '/' + restOfPath : ''}`;
			return NextResponse.redirect(new URL(correctedPath, request.url));
		}
	} else {
		// No locale found, add it
		const locale = getLocale(request);
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

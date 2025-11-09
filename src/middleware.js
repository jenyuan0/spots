import { NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import { i18n } from '../languages.js';
import Negotiator from 'negotiator';

const SUPPORTED_LOCALE_IDS = i18n.languages.map((item) => item.id);
const SUPPORTED_LOCALES_SET = new Set(SUPPORTED_LOCALE_IDS);

// Map full locale IDs to short codes for URLs
const LOCALE_TO_SHORT_CODE = {
	zh_TW: 'tw',
	zh_CN: 'cn',
	en: 'en',
};

// Map short codes to full locale IDs for data fetching
const SHORT_CODE_TO_LOCALE = {
	tw: 'zh_TW',
	cn: 'zh_CN',
	en: 'en',
};

const LOCALE_PATH_REGEX = new RegExp(
	`^/(${SUPPORTED_LOCALE_IDS.join('|')})(/|$)`,
	'i'
);

const SHORT_CODE_PATH_REGEX = new RegExp(
	`^/(${Object.keys(SHORT_CODE_TO_LOCALE).join('|')})(/|$)`,
	'i'
);

function getLocale(request) {
	const negotiatorHeaders = {};
	request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

	let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
		i18n.languages
	);

	return matchLocale(languages, SUPPORTED_LOCALE_IDS, i18n.base);
}

function getPathLocale(pathname) {
	const pathSegments = pathname.split('/').filter(Boolean);
	if (pathSegments.length === 0) return null;

	return pathSegments[0];
}

export function middleware(request) {
	if (!request || !request.nextUrl) {
		return NextResponse.next();
	}

	const pathname = request.nextUrl?.pathname;

	if (
		pathname.startsWith('/_next/') ||
		pathname.startsWith('/api/') ||
		pathname.includes('.')
	) {
		return;
	}

	const pathLocale = getPathLocale(pathname);

	// Check if it's a full locale (case-insensitive)
	const matchedFullLocale = SUPPORTED_LOCALE_IDS.find(
		(locale) => locale.toLowerCase() === pathLocale?.toLowerCase()
	);

	// If it's a full locale (zh_TW, zh_CN), redirect to short code
	if (matchedFullLocale) {
		const shortCode = LOCALE_TO_SHORT_CODE[matchedFullLocale];

		// Only redirect if short code is different from full locale
		if (shortCode && shortCode !== matchedFullLocale) {
			const newPathname = pathname.replace(
				new RegExp(`^/${matchedFullLocale}(/|$)`, 'i'),
				`/${shortCode}$1`
			);
			return NextResponse.redirect(new URL(newPathname, request.url));
		}

		// If they're the same (like en), allow through
		return NextResponse.next();
	}

	// If it's a short code, allow through
	if (SHORT_CODE_PATH_REGEX.test(pathname)) {
		return NextResponse.next();
	}

	// No locale found, add default (in short code format)
	const detectedLocale = getLocale(request);
	const shortCode = LOCALE_TO_SHORT_CODE[detectedLocale] || detectedLocale;
	const cleanPathname = pathname.startsWith('/') ? pathname.slice(1) : pathname;

	return NextResponse.redirect(
		new URL(
			`/${shortCode}${cleanPathname ? '/' + cleanPathname : ''}`,
			request.url
		)
	);
}

export const config = {
	matcher: ['/((?!api|_next|sanity|.*\\..*).*)'],
};

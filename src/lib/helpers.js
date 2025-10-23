import sanitizeHtml from 'sanitize-html';
import { imageBuilder } from '@/sanity/lib/image';
import { format, add, isSameMonth } from 'date-fns';

// ***UTILITIES / GET***

export function getRandomInt(min, max) {
	const _min = Math.ceil(min);
	const _max = Math.floor(max);

	// inclusive of max and min
	return Math.floor(Math.random() * (_max - _min + 1) + _min);
}

export function getUrlBaseAndPath(url) {
	if (url.includes('?')) {
		return url.split('?')[0];
	} else {
		return url;
	}
}

export function hasArrayValue(arr) {
	if (!arr) return null;
	return Array.isArray(arr) && arr.length > 0 && arr.some((item) => item != '');
}

// ***UTILITIES / FORMAT***

export function formatNumberSuffix(val, suffixOnly) {
	if (!string) return null;

	let int = parseInt(val);
	let integer = suffixOnly ? '' : int;

	if (int > 3 && int < 21) return `${integer}th`;

	switch (int % 10) {
		case 1:
			return `${integer}st`;
		case 2:
			return `${integer}nd`;
		case 3:
			return `${integer}rd`;
		default:
			return `${integer}th`;
	}
}

export function formatHandleize(string) {
	if (!string) return null;
	return String(string)
		.normalize('NFKD') // split accented characters into their base characters and diacritical marks
		.replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
		.replace(/\s+/g, '-') // replace spaces with hyphens
		.replace(/[^\w-]/g, '') // remove non-alphanumeric characters except hyphens
		.replace(/-+/g, '-') // remove consecutive hyphens
		.trim() // trim leading or trailing whitespace
		.toLowerCase(); // convert to lowercase
}

export function formatPad(val, length = 2, char = 0) {
	if (!val) return null;
	// example, leading zero: 8 = "08",
	// example, password: 000088885581 = "********5581"
	return val.toString().padStart(length, char);
}

export function formatClamp(val, min = 0, max = 1) {
	if (!val) return null;
	// example, formatClamp(999, 0, 300) = 300
	return value < min ? min : value > max ? max : value;
}

export function formatNumberWithCommas(string) {
	if (!string) return null;
	// example, formatNumberWithCommas(3000.12) = 3,000.12
	const parts = string.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	return parts.join('.');
}

export function formatNumberEuro(string) {
	// example, formatNumberEuro(3000.12) = 3 000,12
	const parts = string.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

	return parts.join(',');
}

export function formatDateUsStandard(date) {
	return [
		formatPad(date.getDate()),
		formatPad(date.getMonth() + 1),
		date.getFullYear(),
	].join('/');
}

// usage: <p dangerouslySetInnerHTML={{ __html: formatNewLineToBr(text) }}/>
export function formatNewLineToBr(text) {
	if (!text) return;

	return sanitizeHtml(text.replace(/\n/g, '<br>'), {
		allowedTags: ['br'],
		allowedAttributes: {},
	});
}

export function formatTime(time) {
	if (!isNaN(time)) {
		return format(time, 'h:mm a');
	}
}

export function formatTimeToAMPM(militaryTime) {
	if (militaryTime) {
		const [hours, minutes] = militaryTime.split(':');
		let hour = parseInt(hours);
		const minute = parseInt(minutes);
		const period = hour >= 12 ? 'PM' : 'AM';

		// Convert hour to 12-hour format
		if (hour === 0) {
			hour = 12;
		} else if (hour > 12) {
			hour = hour - 12;
		}

		const formattedMinutes = minute.toString().padStart(2, '0');

		return `${hour}:${formattedMinutes} ${period}`;
	}
}

export function formatAddress(address) {
	const { street, city, zip } = address;
	const formatStreet = (str) => {
		return str
			.trim()
			.split(' ')
			.map((word) =>
				['de', 'du', 'des', 'le', 'la', 'les', 'à', 'en'].includes(word)
					? word
					: word.charAt(0).toUpperCase() + word.slice(1)
			)
			.join(' ');
	};

	return `${street ? `${formatStreet(street.trim())}, ` : ''}${city?.trim() || ''}${zip ? ` ${zip.trim()}` : ''}`;
}

export function formatObjectToHtml(obj) {
	return Object.entries(obj)
		.map(([key, value]) => {
			const formattedKey = key
				.replace(/([A-Z])/g, ' $1')
				.replace(/^./, (str) => str.toUpperCase())
				.replace(/\?/g, '');

			return `${formattedKey}: ${value}`;
		})
		.join('<br>');
}

export function formatUrl(url) {
	const [protocol, rest] = url.split('://');
	const normalizedRest = rest.replace(/\/+/g, '/');
	return `${protocol}://${normalizedRest}`;
}

export function formatPluralize(phrase) {
	const irregularPlurals = {
		man: 'men',
		woman: 'women',
		child: 'children',
		person: 'people',
		mouse: 'mice',
		foot: 'feet',
		tooth: 'teeth',
		goose: 'geese',
	};

	const pluralizeWord = (word) => {
		const lower = word.toLowerCase();
		if (irregularPlurals[lower])
			return matchCase(word, irregularPlurals[lower]);
		if (lower.endsWith('y') && !/[aeiou]y$/.test(lower))
			return word.replace(/y$/i, 'ies');
		if (/(s|sh|ch|x|z)$/i.test(lower)) return word + 'es';
		if (lower.endsWith('f')) return word.replace(/f$/i, 'ves');
		if (lower.endsWith('fe')) return word.replace(/fe$/i, 'ves');
		return word + 's';
	};

	const matchCase = (original, replacement) => {
		if (original === original.toUpperCase()) return replacement.toUpperCase();
		if (original[0] === original[0].toUpperCase())
			return replacement[0].toUpperCase() + replacement.slice(1);
		return replacement;
	};

	if (!phrase || typeof phrase !== 'string') return phrase;

	const segments = phrase.split(/\s+(&|\band\b)?\s+/i);

	for (let i = segments.length - 1; i >= 0; i--) {
		const word = segments[i];
		if (
			/^[a-z]+$/i.test(word) &&
			word.toLowerCase() !== 'and' &&
			word !== '&'
		) {
			segments[i] = pluralizeWord(word);
			break;
		}
	}

	return segments.join(' ');
}

// ***UTILITIES / VALIDATION***

export function validateEmail(string) {
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	return regex.test(string);
}

export function validateUsPhone(string) {
	const regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

	return regex.test(string);
}

export function validateAndReturnJson(json) {
	try {
		JSON.parse(json);
	} catch (e) {
		console.error(e);
		return false;
	}

	return JSON.parse(string);
}

// ***UTILITIES / ARRAY***

export function arrayIntersection(a1, a2) {
	return a1.filter(function (n) {
		return a2.indexOf(n) !== -1;
	});
}

// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
export const arrayUniqueValues = (array) => {
	let unique = [...new Set(array)];

	return unique;
};

// sorting array of objects asc
export function arraySortObjValAsc(arr, objVal) {
	return arr.sort(function (a, b) {
		if (a[objVal] > b[objVal]) {
			return 1;
		}
		if (b[objVal] > a[objVal]) {
			return -1;
		}
		return 0;
	});
}

// sorting array of objects desc
export function arraySortObjValDesc(arr, objVal) {
	return arr.sort(function (a, b) {
		if (a[objVal] > b[objVal]) {
			return -1;
		}
		if (b[objVal] > a[objVal]) {
			return 1;
		}
		return 0;
	});
}

// https://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript
export function arrayCartesian(...arrays) {
	return [...arrays].reduce(
		(a, b) =>
			a.map((x) => b.map((y) => x.concat(y))).reduce((a, b) => a.concat(b), []),
		[[]]
	);
}

// --- SCROLL TRAP STATE (module-scoped) ---
let _scrollTrapCleanup = null;
let _scrollTrapTarget = null;

// Attach listeners that prevent page scroll outside a given scrollable element.
// Returns a cleanup function to remove all listeners.
function _addScrollTrap(targetEl) {
	_scrollTrapTarget = targetEl;

	const handleWheel = (e) => {
		const el = _scrollTrapTarget;
		if (!el) return;

		const deltaY = e.deltaY;
		const atTop = el.scrollTop === 0;
		const atBottom =
			Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= 1;

		const scrollingUp = deltaY < 0;
		const scrollingDown = deltaY > 0;
		const shouldPrevent = (scrollingUp && atTop) || (scrollingDown && atBottom);

		// If the wheel target is outside the scrollable container OR we've hit a boundary, block page scroll
		if (!el.contains(e.target) || shouldPrevent) {
			e.preventDefault();
		}
	};

	let lastTouchY = null;

	const handleTouchStart = (e) => {
		if (e.touches.length !== 1) return;
		lastTouchY = e.touches[0].clientY;
	};

	const handleTouchMove = (e) => {
		const el = _scrollTrapTarget;
		// If not interacting inside the target, block page scroll
		if (lastTouchY === null || !el || !el.contains(e.target)) {
			if (e.cancelable) e.preventDefault();
			return;
		}
		const currentTouchY = e.touches[0].clientY;
		const deltaY = currentTouchY - lastTouchY;

		const atTop = el.scrollTop === 0;
		const atBottom =
			Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= 1;

		const scrollingUp = deltaY > 0;
		const scrollingDown = deltaY < 0;
		const shouldPrevent = (scrollingUp && atTop) || (scrollingDown && atBottom);

		if (!el.contains(e.target) || shouldPrevent) {
			if (e.cancelable) e.preventDefault();
		}
		lastTouchY = currentTouchY;
	};

	const handleTouchEnd = () => {
		lastTouchY = null;
	};

	document.addEventListener('wheel', handleWheel, { passive: false });
	document.addEventListener('touchstart', handleTouchStart, { passive: false });
	document.addEventListener('touchmove', handleTouchMove, { passive: false });
	document.addEventListener('touchend', handleTouchEnd, { passive: false });

	return () => {
		document.removeEventListener('wheel', handleWheel);
		document.removeEventListener('touchstart', handleTouchStart);
		document.removeEventListener('touchmove', handleTouchMove);
		document.removeEventListener('touchend', handleTouchEnd);
		_scrollTrapTarget = null;
	};
}

// ***ACTIONS***

export function scrollDisable(targetElOrSelector) {
	// React/SSR guard
	if (typeof window === 'undefined' || typeof document === 'undefined') return;
	// If a target is provided, set up a scroll trap that allows the target to scroll
	// while preventing the page from scrolling outside of it. This avoids body locking.
	if (targetElOrSelector) {
		// Resolve element from selector or take element directly
		const el =
			typeof targetElOrSelector === 'string'
				? document.querySelector(targetElOrSelector)
				: targetElOrSelector;

		if (el) {
			// If already trapped for another element, clear it first
			if (_scrollTrapCleanup) {
				_scrollTrapCleanup();
				_scrollTrapCleanup = null;
			}
			_scrollTrapCleanup = _addScrollTrap(el);
			return; // Do not body-lock when we trap a specific container
		}
		// If selector didn't match, warn and skip global lock
		console.warn(
			'scrollDisable: target not found, skipping (no global lock applied)'
		);
		return;
	}

	// --- GLOBAL BODY LOCK (existing behavior) ---
	const y = window.scrollY || window.pageYOffset || 0;
	document.body.dataset.scrollY = String(y);

	const scrollbarWidth =
		window.innerWidth - document.documentElement.clientWidth;

	document.documentElement.style.overflow = 'hidden';
	document.documentElement.style.overscrollBehavior = 'none';

	document.body.style.position = 'fixed';
	document.body.style.top = `-${y}px`;
	document.body.style.left = '0';
	document.body.style.right = '0';
	document.body.style.width = '100%';
	if (scrollbarWidth > 0) {
		document.body.style.paddingRight = `${scrollbarWidth}px`;
	}
	document.body.style.touchAction = 'none';
}

export function scrollEnable() {
	if (typeof window === 'undefined' || typeof document === 'undefined') return;
	// If we set up a scoped trap, remove it first
	if (_scrollTrapCleanup) {
		_scrollTrapCleanup();
		_scrollTrapCleanup = null;
	}

	// If the body was globally locked, restore it; otherwise do nothing (scoped trap case)
	const hadBodyLock =
		!!document.body.dataset.scrollY || document.body.style.position === 'fixed';
	const y = hadBodyLock
		? parseInt(document.body.dataset.scrollY || '0', 10)
		: null;

	document.documentElement.style.overflow = '';
	document.documentElement.style.overscrollBehavior = '';

	document.body.style.position = '';
	document.body.style.top = '';
	document.body.style.left = '';
	document.body.style.right = '';
	document.body.style.width = '';
	document.body.style.paddingRight = '';
	document.body.style.touchAction = '';
	delete document.body.dataset.scrollY;

	// Restore scroll only if we had a global lock
	if (hadBodyLock && y !== null && !Number.isNaN(y)) {
		window.scrollTo(0, y);
	}
}

// simple debounce
export function debounce(fn, ms) {
	let timer;

	return (_) => {
		clearTimeout(timer);
		timer = setTimeout((_) => {
			timer = null;
			fn.apply(this, arguments);
		}, ms);
	};
}

// delay with promise
export function sleeper(ms) {
	return function (x) {
		return new Promise((resolve) => setTimeout(() => resolve(x), ms));
	};
}

// ***REACT SPECIFIC***

export function buildImageSrc(
	image,
	{ width, height, format, quality = 80 } = {}
) {
	if (!image || !imageBuilder) {
		return false;
	}

	try {
		let imgSrc = imageBuilder.image(image);

		if (width) {
			imgSrc = imgSrc.width(Math.round(width));
		}

		if (height) {
			imgSrc = imgSrc.height(Math.round(height));
		}

		if (format) {
			imgSrc = imgSrc.format(format);
		}

		if (quality) {
			imgSrc = imgSrc.quality(quality);
		}

		return imgSrc && imgSrc.fit('max').auto('format').url();
	} catch (error) {
		console.error('Error building image source:', error);
		return false;
	}
}

export function buildImageSrcSet(
	image,
	{ srcSizes, aspectRatio = 1, format, quality = 80 } = {}
) {
	if (!image || !srcSizes) {
		return false;
	}

	try {
		const sizes = srcSizes
			.map((width) => {
				let imgSrc = buildImageSrc(image, {
					width,
					height: aspectRatio
						? Math.round(width * aspectRatio) / 100
						: undefined,
					format,
					quality,
				});

				if (format) {
					imgSrc = imgSrc.format(format);
				}

				return imgSrc ? `${imgSrc} ${width}w` : '';
			})
			.filter(Boolean);

		return sizes.length ? sizes.join(',') : false;
	} catch (error) {
		console.error('Error building image srcset:', error);
		return false;
	}
}

export function buildRgbaCssString(color) {
	if (!color) {
		return false;
	}

	const r = color?.rgb?.r || 255;
	const g = color?.rgb?.g || 255;
	const b = color?.rgb?.b || 255;
	const a = color?.rgb?.a || 1;

	return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function slugify(str) {
	return String(str)
		.normalize('NFKD') // split accented characters into their base characters and diacritical marks
		.replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
		.trim() // trim leading or trailing whitespace
		.toLowerCase() // convert to lowercase
		.replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
		.replace(/\s+/g, '-') // replace spaces with hyphens
		.replace(/-+/g, '-'); // remove consecutive hyphens
}

export function toCamelCase(str) {
	if (!str) return null;

	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index == 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}

export function isValidUrl(urlString) {
	const urlPattern = new RegExp(
		'^(https?:\\/\\/)?' + // validate protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
			'(\\#[-a-z\\d_]*)?$',
		'i'
	);
	return !!urlPattern.test(urlString);
}

export function colorArray(startingColor) {
	let arr = ['green', 'blue', 'red', 'orange', 'purple'];

	if (!startingColor) {
		// If no color provided, shuffle array randomly
		const shuffled = [...arr];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}
	// Otherwise use original rotation logic
	const index = arr.indexOf(startingColor);
	return [...arr.slice(index), ...arr.slice(0, index)];
}

export const springConfig = {
	stiffness: 200,
	damping: 30,
	mass: 0.5,
};

export function formatLanguageCode(lang) {
	if (!lang || typeof lang !== 'string') {
		return 'en';
	}

	const formatted = lang.toLowerCase().replace('_', '-');

	// Validate that this is a proper locale code
	try {
		new Intl.DateTimeFormat(formatted);
		return lang;
	} catch (error) {
		console.warn(`Invalid locale "${formatted}", falling back to "en"`);
		return 'en';
	}
}

export function getLocalizationPlural(lang, items, word) {
	const count = Array.isArray(items) ? items.length : items;
	const isEnglish = lang === 'en';
	const pluralSuffix = isEnglish && count > 1 ? 's' : '';
	return `${count} ${word}${pluralSuffix}`;
}

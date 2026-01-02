import React, {
	Suspense,
	useEffect,
	useRef,
	useState,
	useCallback,
	useMemo,
} from 'react';
import clsx from 'clsx';
import { scrollEnable, scrollDisable } from '@/lib/helpers';
import { useSearchParams } from 'next/navigation';
import useKey from '@/hooks/useKey';
import useMagnify from '@/hooks/useMagnify';
import useLightbox from '@/hooks/useLightbox';
import MagnifyLocation from './MagnifyLocation';
import MagnifyCase from './MagnifyCase';
import Button from '@/components/Button';
import usePlanner from '@/hooks/usePlanner';
import useOutsideClick from '@/hooks/useOutsideClick';

function MagnifyContent({ item, localization, localizationHighlights }) {
	const { planYourTrip, unlockInsiderRates, closeLabel } = localization || {};
	const containerRef = useRef();
	const contentRef = useRef();
	const timerRef = useRef();
	const [isActive, setIsActive] = useState(false);
	const [pageSlug, setPageSlug] = useState(null);
	const [color, setColor] = useState('brown');
	const [locMeta, setLocMeta] = useState({
		hasHotelCategory: false,
		title: '',
	});
	const { lightboxActive } = useLightbox();
	const { mag, removeMag } = useMagnify();
	const { setPlannerActive, setPlannerContent } = usePlanner();
	const isTop = useMemo(() => {
		const stack = mag || [];
		if (!stack.length) return false;

		const top = stack[stack.length - 1];
		return top?.slug === item?.slug && top?.type === item?.type;
	}, [mag]);
	const type = item?.type || 'location';
	const mParam = item?.slug;

	const handleMeta = useCallback((meta) => {
		setLocMeta(meta);
	}, []);

	const handleColorChange = useCallback((c) => {
		setColor(c || 'brown');
	}, []);

	useEffect(() => {
		setPageSlug(window?.location.pathname?.split('/').pop());
		setTimeout(() => {
			setIsActive(true);
		}, 1);
	}, []);

	useEffect(() => {
		if (isActive) {
			scrollDisable(containerRef.current);
		} else {
			scrollEnable();
		}
	}, [isActive]);

	const handleClose = () => {
		const stack = useMagnify.getState().mag || [];
		if (!stack.length) return;

		setIsActive(false);

		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			removeMag();
		}, 500);
	};

	useOutsideClick(contentRef, () => {
		if (!isTop) return;
		handleClose();
	});

	useKey(() => {
		if (lightboxActive) return;
		if (!isTop) return;
		handleClose();
	});

	return (
		<div
			className={clsx('g-magnify', {
				'is-active': isActive,
			})}
			ref={containerRef}
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
				'--cr-secondary': `var(--cr-${color}-l)`,
			}}
			role="dialog"
			aria-label="Content details"
			aria-modal={isActive}
		>
			<div className="g-magnify__content" ref={contentRef}>
				<div className="g-magnify__header">
					<button
						type="button"
						className="g-magnify__toggle"
						onClick={handleClose}
					>
						<div
							className={clsx(
								'g-magnify__toggle__label',
								'pill',
								`cr-${color}-l`
							)}
						>
							{closeLabel || 'Close'}
						</div>
						<div className="g-magnify__toggle__icon trigger">
							<div className="icon-close" />
						</div>
					</button>
					{type === 'location' && locMeta.hasHotelCategory ? (
						<Button
							className={`btn cr-${color}-d`}
							onClick={() => {
								setPlannerActive(true);
								setPlannerContent({
									heading: 'Unlock Insider Rate & Perks',
									subject: `Rate & Perks for ${locMeta.title}`,
									where: locMeta.title,
								});
							}}
						>
							{unlockInsiderRates || 'Unlock Insider Rates'}
						</Button>
					) : (
						<Button
							className={`btn cr-${color}-d js-gtm-design-popup`}
							onClick={() => {
								setPlannerActive(true);
								setPlannerContent({
									type: 'design',
								});
							}}
						>
							{planYourTrip || 'Plan Your Trip with Spots'}
						</Button>
					)}
				</div>
				<div className="g-magnify__body">
					{type === 'location' && (
						<MagnifyLocation
							key={mParam || `location-${idx}`}
							mParam={mParam}
							pageSlug={pageSlug}
							onColorChange={handleColorChange}
							onMeta={handleMeta}
							localization={localization}
							localizationHighlights={localizationHighlights}
						/>
					)}
					{type === 'case' && (
						<div className="g-magnify-cases">
							<MagnifyCase
								key={mParam || `case-${idx}`}
								mParam={mParam}
								pageSlug={pageSlug}
								onColorChange={handleColorChange}
								localization={localization}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export function Magnify({ siteData }) {
	const { localization, localizationHighlights } = siteData || {};
	const { mag, addMag, clearMag } = useMagnify();
	// Prevent duplicate hydration in React 18 StrictMode (effects run twice in dev)
	const hasHydratedFromUrlRef = useRef(false);
	const hydratedSearchKeyRef = useRef('');
	const searchParams = useSearchParams();

	// Supports multi-layer deep links via query params:
	// m=slug1~slug2~slug3
	// t=location~case~location
	const STACK_SEP = '~';

	const parseStackFromSearch = useCallback((sp) => {
		const mRaw = sp?.get('m');
		if (!mRaw) return [];
		const tRaw = sp?.get('t') || '';

		const slugs = decodeURIComponent(mRaw).split(STACK_SEP).filter(Boolean);
		const types = decodeURIComponent(tRaw).split(STACK_SEP).filter(Boolean);

		return slugs.map((slug, i) => ({
			slug,
			type: types[i] || 'location',
		}));
	}, []);

	const serializeStackToSearch = useCallback((stack, url) => {
		const params = url.searchParams;

		if (!stack?.length) {
			params.delete('m');
			params.delete('t');
			return;
		}

		params.set(
			'm',
			encodeURIComponent(
				stack
					.map((x) => x?.slug)
					.filter(Boolean)
					.join(STACK_SEP)
			)
		);
		params.set(
			't',
			encodeURIComponent(
				stack.map((x) => x?.type || 'location').join(STACK_SEP)
			)
		);
	}, []);

	useEffect(() => {
		const searchKey = searchParams?.toString() || '';

		// React 18 StrictMode runs effects twice in dev; this keeps hydration idempotent.
		if (
			hasHydratedFromUrlRef.current &&
			hydratedSearchKeyRef.current === searchKey
		) {
			return;
		}

		const stackFromUrl = parseStackFromSearch(searchParams);
		const currentStack = useMagnify.getState().mag || mag || [];

		// Deep link support (multi-layer): only hydrate if nothing is open yet
		if (stackFromUrl.length && currentStack.length === 0) {
			// Mark hydrated BEFORE mutating state so a StrictMode re-run can't duplicate.
			hasHydratedFromUrlRef.current = true;
			hydratedSearchKeyRef.current = searchKey;

			stackFromUrl.forEach((item) => addMag(item));
			return;
		}

		// Even if there's nothing to hydrate, record that we've processed this URL.
		hasHydratedFromUrlRef.current = true;
		hydratedSearchKeyRef.current = searchKey;
	}, [parseStackFromSearch, searchParams, addMag, mag]);

	useEffect(() => {
		const stack = mag || [];
		const url = new URL(window.location.href);
		serializeStackToSearch(stack, url);
		const newUrl = `${window.location.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''}`;

		if (!stack) {
			clearMag();
		}

		window.history.pushState({}, '', newUrl);
	}, [serializeStackToSearch, mag, clearMag]);

	return (
		<>
			{(mag || []).map((item, idx) => (
				<MagnifyContent
					key={idx}
					item={item}
					localization={localization}
					localizationHighlights={localizationHighlights}
				/>
			))}
		</>
	);
}

export default function Export({ siteData }) {
	return (
		<Suspense>
			<Magnify siteData={siteData} />
		</Suspense>
	);
}

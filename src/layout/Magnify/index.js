import React, {
	Suspense,
	useEffect,
	useRef,
	useState,
	useCallback,
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

export function Magnify({ siteData }) {
	const { localization, localizationHighlights } = siteData || {};
	const { planYourTrip, unlockInsiderRates, closeLabel } = localization || {};
	const [isActive, setIsActive] = useState(false);
	const [color, setColor] = useState('brown');
	const [locMeta, setLocMeta] = useState({
		hasHotelCategory: false,
		title: '',
	});
	const [type, setType] = useState('location');
	const [pageSlug, setPageSlug] = useState(null);
	const [mParam, setMParam] = useState(null);
	const { mag, clearMag } = useMagnify();
	const { lightboxActive } = useLightbox();
	const searchParams = useSearchParams();
	const containerRef = useRef();
	const timerRef = useRef();
	const { setPlannerActive, setPlannerContent } = usePlanner();

	const handleMeta = useCallback((meta) => {
		setLocMeta(meta);
	}, []);

	const handleColorChange = useCallback((c) => {
		setColor(c || 'brown');
	}, []);

	useEffect(() => {
		setPageSlug(window?.location.pathname?.split('/').pop());
	}, []);

	useEffect(() => {
		const m = searchParams.get('m');
		const t = searchParams.get('t');

		if (m) {
			if (t) setType(t);
			setMParam(m);
			setIsActive(true);
			scrollDisable(containerRef.current);
		} else {
			setIsActive(false);
			setMParam(null);
			scrollEnable();
		}
		return () => {
			scrollEnable();
			cleanup();
		};
	}, [searchParams]);

	useEffect(() => {
		cleanup();

		if (mag?.type) setType(mag?.type);

		if (mag?.slug) {
			const url = new URL(window.location.href);
			const params = url.searchParams;

			// Add/replace params
			const mValue = `${mag.slug}`;
			params.set('m', mValue);
			params.set('t', mag?.type);

			// Build URL with both params
			const newUrl = `${window.location.pathname}?${params.toString()}`;
			window.history.pushState({}, '', newUrl);
		}
	}, [mag]);

	const cleanup = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	};

	const handleClose = () => {
		if (!isActive) return;

		setIsActive(false);
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			clearMag();
			setMParam(null);

			// Reset URL param
			const url = new URL(window.location.href);
			const params = url.searchParams;

			params.delete('m');
			params.delete('t');

			// Construct new URL with remaining parameters
			const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
			window.history.pushState({}, '', newUrl);
		}, 500);
	};

	// TODO
	// having to click esc twice in order to close magnify

	useKey(() => {
		if (!lightboxActive) {
			handleClose();
		}
	});

	return (
		<div
			ref={containerRef}
			className={clsx('g-magnify', { 'is-active': isActive })}
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
				'--cr-secondary': `var(--cr-${color}-l)`,
			}}
			role="dialog"
			aria-label="Content details"
			aria-modal={isActive}
		>
			<div
				className="g-magnify__overlay"
				aria-hidden="true"
				role="presentation"
				onClick={handleClose}
			/>
			<div className="g-magnify__content">
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
							key={mParam || 'location'}
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
								key={mParam || 'case'}
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

export default function Export({ siteData }) {
	return (
		<Suspense>
			<Magnify siteData={siteData} />
		</Suspense>
	);
}

import React, { Suspense, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { scrollEnable, scrollDisable } from '@/lib/helpers';
import { useSearchParams } from 'next/navigation';
import useOutsideClick from '@/hooks/useOutsideClick';
import useKey from '@/hooks/useKey';
import useMagnify from '@/hooks/useMagnify';
import useLightbox from '@/hooks/useLightbox';
import MagnifyLocation from './MagnifyLocation';
import MagnifyCase from './MagnifyCase';

export function Magnify() {
	const [isActive, setIsActive] = useState(false);
	const [color, setColor] = useState('brown');
	const [type, setType] = useState('location');
	const [pageSlug, setPageSlug] = useState(null);
	const [mParam, setMParam] = useState(null);
	const { mag, clearMag } = useMagnify();
	const { lightboxActive } = useLightbox();
	const searchParams = useSearchParams();
	const containerRef = useRef();
	const timerRef = useRef();

	useEffect(() => {
		setPageSlug(window?.location.pathname?.split('/').pop());
	}, []);

	useEffect(() => {
		const m = searchParams.get('m');
		if (m) {
			setMParam(m);
			setIsActive(true);
		} else {
			setIsActive(false);
			setMParam(null);
		}
		return cleanup;
	}, [searchParams]);

	useEffect(() => {
		cleanup();

		if (mag?.type) {
			setType(mag?.type);
		}

		if (mag?.slug) {
			const url = new URL(window.location.href);
			const params = url.searchParams;
			scrollDisable();

			// Remove existing 'm' parameter if present
			params.delete('m');

			// Add new 'm' parameter
			const mValue = `/${mag.slug}`;

			// If there are other params, append with &m=, otherwise use ?m=
			const separator = params.toString() ? '&' : '?';
			const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}${separator}m=${mValue}`;

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
		scrollEnable();
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

			// Construct new URL with remaining parameters
			const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
			window.history.pushState({}, '', newUrl);
		}, 500);
	};

	// useOutsideClick(containerRef, handleClose, 'g-lightbox');

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
			data-type={type}
			role="dialog"
			aria-label="Content details"
			aria-modal={isActive}
		>
			<button
				className="g-magnify__overlay"
				aria-hidden="true"
				onClick={handleClose}
			/>
			<div className="g-magnify__content">
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
						Close
					</div>
					<div className="g-magnify__toggle__icon trigger">
						<div className="icon-close" />
					</div>
				</button>
				<div className="g-magnify__body">
					{type === 'location' && (
						<MagnifyLocation
							key={mParam || 'location'}
							mParam={mParam}
							pageSlug={pageSlug}
							onColorChange={(c) => setColor(c || 'brown')}
						/>
					)}
					{type === 'case' && (
						<MagnifyCase
							key={mParam || 'case'}
							mParam={mParam}
							pageSlug={pageSlug}
							onColorChange={(c) => setColor(c || 'brown')}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default function Export() {
	return (
		<Suspense>
			<Magnify />
		</Suspense>
	);
}

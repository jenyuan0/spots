import React, { Suspense, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { scrollEnable, scrollDisable } from '@/lib/helpers';
import { client } from '@/sanity/lib/client';
import { useSearchParams } from 'next/navigation';
import useOutsideClick from '@/hooks/useOutsideClick';
import useKey from '@/hooks/useKey';
import useMagnify from '@/hooks/useMagnify';
import useLightbox from '@/hooks/useLightbox';
import MagnifyLocation from './MagnifyLocation';
import { getLocationsData, fileMetaFields } from '@/sanity/lib/queries';

export function Magnify() {
	const [isActive, setIsActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [content, setContent] = useState({});
	const [color, setColor] = useState('brown');
	const [pageSlug, setPageSlug] = useState(null);
	const { mag, clearMag } = useMagnify();
	const { lightboxActive } = useLightbox();
	const searchParams = useSearchParams();
	const containerRef = useRef();
	const timerRef = useRef();

	const fetchLocationContent = async (mParam) => {
		setIsLoading(true);

		try {
			const dataSlug = mParam.split('/').pop();
			const [content, reservations] = await Promise.all([
				client.fetch(
					`*[_type == "gLocations" && slug.current == "${dataSlug}"][0]{
						${getLocationsData()}
					}`
				),
				client.fetch(`
					*[_type == "gItineraries" && slug.current == "${pageSlug}"][0].reservations[]{
						"location": location->{
							_id
						},
						startTime,
						endTime,
						notes,
						attachments[]{${fileMetaFields}}
					}
				`),
			]);
			setContent({
				content: content,
				reservations: reservations,
			});
			setColor(mag?.color || content.color || 'brown');
			setIsActive(true);
			scrollDisable();
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		setPageSlug(window?.location.pathname?.split('/').pop());
	}, []);

	useEffect(() => {
		const mParam = searchParams.get('m');
		if (mParam) {
			fetchLocationContent(mParam);
		} else {
			setIsActive(false);
			scrollEnable();
		}
		return cleanup;
	}, [searchParams]);

	useEffect(() => {
		cleanup();

		if (mag?.slug) {
			const url = new URL(window.location.href);
			const params = url.searchParams;

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
			setContent({});
			clearMag();

			// Reset URL param
			const url = new URL(window.location.href);
			const params = url.searchParams;

			params.delete('m');

			// Construct new URL with remaining parameters
			const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
			window.history.pushState({}, '', newUrl);
		}, 500);
	};

	useOutsideClick(containerRef, handleClose, 'g-lightbox');

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
			<button
				className="g-magnify__overlay"
				aria-hidden="true"
				onClick={handleClose}
			></button>
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
					{content && !isLoading && <MagnifyLocation data={content} />}
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

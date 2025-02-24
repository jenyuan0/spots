import React, { Suspense, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { client } from '@/sanity/lib/client';
import { useSearchParams } from 'next/navigation';
import { formatAddress } from '@/lib/helpers';
import { format } from 'date-fns';
import Carousel from '@/components/Carousel';
import Link from 'next/link';
import Img from '@/components/Image';
import Button from '@/components/Button';
import CustomPortableText from '@/components/CustomPortableText';
import useOutsideClick from '@/hooks/useOutsideClick';
import useKey from '@/hooks/useKey';
import useMagnify from '@/hooks/useMagnify';
import { fileMeta } from '@/sanity/lib/queries';
import { hasArrayValue } from '@/lib/helpers';

export function ContentLocation({ data, color }) {
	const { _id, title, address, images, content, contentItinerary, urls, fees } =
		data?.content || {};
	const res = data.reservations?.filter((r) => r.location._id === _id);
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');

	return (
		<div className="g-magnify-locations">
			{title && <h2 className="g-magnify-locations__heading t-h-2">{title}</h2>}
			{res?.length > 0 && (
				<div className="g-magnify-locations__res wysiwyg">
					<h3 className="t-l-1">Reservation{res.length > 1 && 's'}</h3>
					{res?.map((res, i) => {
						const resStart = res?.startTime && new Date(res?.startTime);
						const resEnd = res?.endTime && new Date(res?.endTime);
						const timeRange =
							resStart &&
							(resEnd
								? `${format(resStart, 'MMMM do, h:mm aaa')}—${format(resEnd, 'h:mm aaa')}`
								: format(resStart, 'MMMM do, h:mm aaa'));

						return (
							<div key={`res-${i}`}>
								{timeRange && <div className="t-h-4">{timeRange}</div>}
								{res?.notes && <CustomPortableText blocks={res.notes} />}

								{res?.attachments && (
									<ul>
										{res?.attachments.map((att, i) => (
											<Link key={`res-att-${i}`} href={att.url} target="_blank">
												{att.filename}
											</Link>
										))}
									</ul>
								)}
							</div>
						);
					})}
				</div>
			)}
			{address && (
				<div className="g-magnify-locations__address wysiwyg">
					<h3 className="t-l-1">Address</h3>
					<div className="t-h-3">{formatAddress(address)}</div>
					<Link
						className={clsx('btn-underline', color && `cr-${color}-d`)}
						href={`https://www.google.com/maps/dir//${encodeURIComponent(addressString)}`}
						target="_blank"
					>
						Get Direction
					</Link>
				</div>
			)}
			{images && (
				<div className="g-magnify-locations__images">
					<Carousel isShowDots={true} isAutoplay={true} autoplayInterval={3000}>
						{images.map((image, i) => (
							<Img key={`image-${i}`} image={image} />
						))}
					</Carousel>
				</div>
			)}
			{content && (
				<div className="g-magnify-locations__content wysiwyg">
					<CustomPortableText blocks={content} />
				</div>
			)}
			{contentItinerary && (
				<div className="g-magnify-locations__content wysiwyg">
					<CustomPortableText blocks={contentItinerary} />
				</div>
			)}
			{hasArrayValue(fees) && (
				<div className="g-magnify-locations__fees wysiwyg">
					<h3 className="t-l-1">Fees</h3>
					<p>{fees.map((fee) => fee).join(' • ')}</p>
				</div>
			)}
			{hasArrayValue(urls) && (
				<div className="g-magnify-locations__urls wysiwyg">
					<ul>
						{urls.map((url, i) => (
							<li key={`url-${i}`}>
								<Link href={url} target={'_blank'}>
									{url
										.replace(/^(https?:\/\/)?(www\.)?/, '')
										.replace(/\/$/, '')}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export function Magnify() {
	const [isActive, setIsActive] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [content, setContent] = useState({});
	const [color, setColor] = useState(null);
	const [pageSlug, setPageSlug] = useState(null);
	const { mag, clearMag } = useMagnify();
	const searchParams = useSearchParams();
	const containerRef = useRef();
	const timerRef = useRef();

	const fetchLocationContent = async (mParam) => {
		setIsLoading(true);

		try {
			const dataSlug = mParam.split('/').pop();
			const [content, reservations] = await Promise.all([
				client.fetch(
					`*[_type == "gLocations" && slug.current == "${dataSlug}"][0]`
				),
				client.fetch(`
					*[_type == "gItineraries" && slug.current == "${pageSlug}"][0].reservations[]{
						"location": location->{
							_id
						},
						startTime,
						endTime,
						notes,
						attachments[]{${fileMeta}}
					}
				`),
			]);
			setContent({
				content: content,
				reservations: reservations,
			});
			setIsActive(true);
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
		const cParam = searchParams.get('c');
		setColor(cParam);

		if (mParam) {
			fetchLocationContent(mParam);
		} else {
			setIsActive(false);
		}
		return cleanup;
	}, [searchParams]);

	useEffect(() => {
		cleanup();

		if (mag?.slug) {
			window.history.pushState(
				{},
				'',
				`?m=/${mag?.type}/${mag.slug}${mag?.color ? `&c=${mag.color}` : ''}`
			);
		}
	}, [mag?.slug]);

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
			setContent({});
			clearMag();
			window.history.pushState({}, '', window.location.pathname);
		}, 500);
	};

	useOutsideClick(containerRef, handleClose);
	useKey(handleClose);

	return (
		<div
			ref={containerRef}
			className={clsx('g-magnify', { 'is-active': isActive })}
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
				'--cr-secondary': `var(--cr-${color}-l)`,
			}}
			role="dialog"
			aria-modal={isActive}
		>
			<div className="g-magnify__header">
				<Button
					className={clsx('btn', color && `cr-${color}-d`)}
					onClick={handleClose}
				>
					<span className="icon-close" />
					Close
				</Button>
			</div>

			<div className="g-magnify__content">
				{content && !isLoading && (
					<ContentLocation data={content} color={color} />
				)}
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

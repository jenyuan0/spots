import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { hasArrayValue, formatAddress } from '@/lib/helpers';
import Link from '@/components/CustomLink';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import Carousel from '@/components/Carousel';
import CategoryPillList from '@/components/CategoryPillList';
import LocationHighlights from '@/components/LocationHighlights';
import useLightbox from '@/hooks/useLightbox';
import { client } from '@/sanity/lib/client';
import { getLocationsData, fileMetaFields } from '@/sanity/lib/queries';

export default function MagnifyLocation({
	mParam,
	pageSlug,
	onColorChange,
	onMeta,
}) {
	const [locationContent, setLocationContent] = useState(null);
	const [color, setColor] = useState(null);
	const [reservations, setReservations] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const { setLightboxImages, setLightboxActive } = useLightbox();

	useEffect(() => {
		const fetchData = async () => {
			if (!mParam) return;
			try {
				const dataSlug = mParam.split('/').pop();
				const [content, resvs] = await Promise.all([
					client.fetch(
						`*[_type == "gLocations" && language == "en" && slug.current == "${dataSlug}"][0]{
                ${getLocationsData()}
              }`
					),
					client.fetch(`
              *[_type == "gItineraries" && language == "en" && slug.current == "${pageSlug}"][0].reservations[]{
                "location": location->{ _id },
                startTime,
                endTime,
                notes,
                attachments[]{${fileMetaFields}}
              }
            `),
				]);
				const contentColor =
					(content &&
						(content.color ||
							content?.categories?.[0]?.color?.title?.toLowerCase())) ||
					'brown';

				setLocationContent(content);
				setReservations(resvs || []);
				setColor(contentColor);
				if (onColorChange) onColorChange(contentColor);
			} catch (e) {
				console.error('Error fetching location content:', e);
			}
		};

		if (!isLoaded) {
			setIsLoaded(true);
			fetchData();
		}
	}, [mParam, pageSlug, onColorChange]);

	// --- meta for parent (must run before any early return) ---
	const metaTitle = locationContent?.title || '';
	const metaHasHotelCategory = Array.isArray(locationContent?.categories)
		? locationContent.categories.some((cat) => cat?.slug === 'hotels')
		: false;
	const lastMetaRef = useRef({ hasHotelCategory: false, title: '' });

	useEffect(() => {
		const nextMeta = {
			hasHotelCategory: metaHasHotelCategory,
			title: metaTitle,
		};
		const prev = lastMetaRef.current;
		if (
			prev.hasHotelCategory !== nextMeta.hasHotelCategory ||
			prev.title !== nextMeta.title
		) {
			lastMetaRef.current = nextMeta;
			if (onMeta) onMeta(nextMeta);
		}
	}, [metaHasHotelCategory, metaTitle, onMeta]);
	// --- end meta ---

	if (!isLoaded || !locationContent) {
		return null;
	}

	const data = { content: locationContent, reservations };

	const {
		_id,
		title,
		slug,
		address,
		images,
		categories,
		subcategories,
		highlights,
		content: contentBlocks,
		contentItinerary,
		urls,
		fees,
	} = data?.content || {};
	const res = data.reservations?.filter((r) => r.location._id === _id);
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');
	const hasHotelCategory = categories?.some((cat) => cat?.slug === 'hotels');

	return (
		<div className="g-magnify-locations">
			{highlights && (
				<div className="g-magnify-locations__highlights t-l-2">
					<LocationHighlights highlights={highlights} />
				</div>
			)}
			{title && (
				<h2 className="g-magnify-locations__heading t-h-2">
					{/* <Link href={`/locations/${slug}`}>{title}</Link> */}
					{title}
				</h2>
			)}
			{res?.length > 0 && (
				<div className="g-magnify-locations__res wysiwyg-b-1">
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
							<p key={`res-${i}`}>
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
							</p>
						);
					})}
				</div>
			)}
			{images && (
				<Carousel
					className="g-magnify-locations__images"
					isShowDots={true}
					gap={'5px'}
				>
					{images.map((image, i) => (
						<button
							key={`image-${i}`}
							onClick={() => {
								setLightboxImages(images, i);
								setLightboxActive(true);
							}}
						>
							<Img key={`image-${i}`} image={image} />
						</button>
					))}
				</Carousel>
			)}
			{address && (
				<div className="g-magnify-locations__address wysiwyg-b-1">
					<h3 className="t-l-1">Address</h3>
					<p>
						<Link
							href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}+${encodeURIComponent(addressString)}`}
							isNewTab={true}
						>
							{formatAddress(address)}
						</Link>
					</p>
				</div>
			)}
			{hasArrayValue(urls) && (
				<div className="g-magnify-locations__urls wysiwyg-b-1">
					<h3 className="t-l-1">Website</h3>
					<ul>
						{urls.map((url, i) => (
							<li key={`url-${i}`}>
								<Link href={url} isNewTab={true}>
									{url
										.replace(/^(https?:\/\/)?(www\.)?/, '')
										.replace(/\/$/, '')}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
			{contentBlocks && (
				<div className="g-magnify-locations__content wysiwyg-page">
					<CustomPortableText blocks={contentBlocks} />
				</div>
			)}
			{contentItinerary && (
				<div className="g-magnify-locations__content wysiwyg-page">
					<CustomPortableText blocks={contentItinerary} />
				</div>
			)}
			{hasArrayValue(fees) && (
				<div className="g-magnify-locations__fees wysiwyg-b-1">
					<h3 className="t-l-1">Fees</h3>
					<p>{fees.map((fee) => fee).join(' • ')}</p>
				</div>
			)}
			{(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
				<div className="g-magnify-locations__categories">
					<CategoryPillList
						categories={categories}
						subcategories={subcategories}
						isLink={true}
					/>
				</div>
			)}
		</div>
	);
}

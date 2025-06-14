import React from 'react';
import { format } from 'date-fns';
import { hasArrayValue, formatAddress } from '@/lib/helpers';
import Link from '@/components/CustomLink';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import CategoryPillList from '@/components/CategoryPillList';
import LocationHighlights from '@/components/LocationHighlights';
import useSearchHotel from '@/hooks/useSearchHotel';
import useLightbox from '@/hooks/useLightbox';

export default function MagnifyLocation({ data }) {
	const {
		_id,
		title,
		slug,
		address,
		images,
		categories,
		subcategories,
		highlights,
		content,
		contentItinerary,
		urls,
		fees,
	} = data?.content || {};
	const { setSearchHotelActive, setSearchContent } = useSearchHotel();
	const res = data.reservations?.filter((r) => r.location._id === _id);
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');
	const { setLightboxImages, setLightboxActive } = useLightbox();
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
					<Link href={`/paris/locations/${slug}`}>{title}</Link>
				</h2>
			)}
			{hasHotelCategory && (
				<div className="g-magnify-locations__cta">
					<Button
						className={`btn cr-green-d`}
						onClick={() => {
							setSearchHotelActive(true);
							setSearchContent({
								heading: 'Unlock Insider Rates',
								subject: `Rate & Perks for ${title}`,
								placeholder: `Hi! Can you check if there’s an insider rate or perks for ${title} from [DATES]?`,
							});
						}}
					>
						Unlock Insider Rates
					</Button>
				</div>
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
			{content && (
				<div className="g-magnify-locations__content wysiwyg-page">
					<CustomPortableText blocks={content} />
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

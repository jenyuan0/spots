import React from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { hasArrayValue, formatAddress } from '@/lib/helpers';
import Link from '@/components/CustomLink';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import Carousel from '@/components/Carousel';
import CategoryPillList from '@/components/CategoryPillList';
import useLightbox from '@/hooks/useLightbox';

export default function MagnifyLocation({ data, color = 'green' }) {
	const {
		_id,
		title,
		address,
		images,
		categories,
		subcategories,
		content,
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
	const { setLightboxImages, setLightboxActive } = useLightbox();

	return (
		<div className="g-magnify-locations">
			{title && <h2 className="g-magnify-locations__heading t-h-2">{title}</h2>}
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
				<div className="g-magnify-locations__content wysiwyg-b-1">
					<CustomPortableText blocks={content} />
				</div>
			)}
			{contentItinerary && (
				<div className="g-magnify-locations__content wysiwyg-b-1">
					<CustomPortableText blocks={contentItinerary} />
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
			{hasArrayValue(fees) && (
				<div className="g-magnify-locations__fees wysiwyg-b-1">
					<h3 className="t-l-1">Fees</h3>
					<p>{fees.map((fee) => fee).join(' • ')}</p>
				</div>
			)}
		</div>
	);
}

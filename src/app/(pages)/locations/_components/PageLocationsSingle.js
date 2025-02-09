'use client';

import React from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import { hasArrayValue } from '@/lib/helpers';
import Carousel from '@/components/Carousel';
import Image from '@/components/Image';
import LocationCard from '@/components/LocationCard';
import GuideCard from '@/components/GuideCard';

export default function PageLocationsSingle({ data }) {
	const {
		title,
		geo,
		address,
		price,
		categories,
		images,
		content,
		contentItinerary,
		relatedLocations,
		relatedGuides,
		defaultRelatedLocations,
		defaultRelatedGuides,
	} = data || {};

	return (
		<>
			<section className="p-guides-single">
				<h1 className="p-guides-single__title">{title}</h1>
				<div className="p-guides-single__content wysiwyg-page">
					<h2 className="t-h-3">Content</h2>
					{content ? <CustomPortableText blocks={content} /> : 'EMPTY'}
					<h2 className="t-h-3">Content (Itinerary only)</h2>
					{contentItinerary ? (
						<CustomPortableText blocks={contentItinerary} />
					) : (
						'EMPTY'
					)}

					<pre>
						lat: {geo.lat || 'EMPTY'}
						<br />
						lng: {geo.lng || 'EMPTY'}
						<br />
						<br />
						street: {address?.street || 'EMPTY'}
						<br />
						city: {address?.city || 'EMPTY'}
						<br />
						zip: {address?.zip || 'EMPTY'}
						<br />
						<br />
						PRICE: ${price || 'EMPTY'}
						<br />
						CATEGORIES: {categories?.map((cat) => cat.title).join(', ')}
						<br />
					</pre>

					{images && (
						<Carousel
							isShowDots={true}
							isAutoplay={true}
							autoplayInterval={3000}
						>
							{images?.map((image) => (
								<Image key={image.id} image={image} />
							))}
						</Carousel>
					)}
				</div>
			</section>

			{(hasArrayValue(defaultRelatedLocations) ||
				hasArrayValue(relatedLocations)) && (
				<section className="p-guides-related">
					<h2 className="p-guides-related__title">Related Locations</h2>
					<div className="p-guides-related__content">
						{(relatedLocations || defaultRelatedLocations).map((item) => (
							<LocationCard key={item._id} data={item} />
						))}
					</div>
				</section>
			)}

			{(hasArrayValue(defaultRelatedGuides) ||
				hasArrayValue(relatedGuides)) && (
				<section className="p-guides-related">
					<h2 className="p-guides-related__title">Related Guides</h2>
					<div className="p-guides-related__content">
						{(relatedGuides || defaultRelatedGuides).map((item) => (
							<GuideCard key={item._id} data={item} />
						))}
					</div>
				</section>
			)}
		</>
	);
}

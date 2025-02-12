'use client';

import React from 'react';
import { hasArrayValue } from '@/lib/helpers';
import CustomPortableText from '@/components/CustomPortableText';
import Carousel from '@/components/Carousel';
import Img from '@/components/Image';
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
			<section className="p-locations-single data-container">
				<h1 className="p-locations-single__title">{title}</h1>

				<div className="data-container-small">
					{images && (
						<Carousel
							isShowDots={true}
							isAutoplay={true}
							autoplayInterval={3000}
						>
							{images?.map((image) => (
								<Img key={image.id} image={image} />
							))}
						</Carousel>
					)}
				</div>

				<div className="p-locations-single__content">
					<div className="data-block">
						CONTENT:{' '}
						{content ? <CustomPortableText blocks={content} /> : 'EMPTY'}
						<br />
						<br />
						CONTENT (Itinerary only:){' '}
						{contentItinerary ? (
							<CustomPortableText blocks={contentItinerary} />
						) : (
							'EMPTY'
						)}
						<br />
						<br />
						lat: {geo.lat || 'EMPTY'}
						<br />
						lng: {geo.lng || 'EMPTY'}
						<br />
						street: {address?.street || 'EMPTY'}
						<br />
						city: {address?.city || 'EMPTY'}
						<br />
						zip: {address?.zip || 'EMPTY'}
						<br />
						PRICE: ${price || 'EMPTY'}
						<br />
						CATEGORIES: {categories?.map((cat) => cat.title).join(', ')}
						<br />
					</div>
				</div>

				<div className="data-block">
					{(hasArrayValue(relatedLocations) ||
						hasArrayValue(defaultRelatedLocations)) && (
						<section className="p-guides-related">
							<h2 className="p-guides-related__title">Related Guides</h2>
							<div className="p-guides-related__content">
								{[...Array(4)].map((_, index) => {
									const relatedItems = relatedLocations || [];
									const defaultItems = defaultRelatedLocations || [];
									const allItems = [...relatedItems, ...defaultItems];
									const item = allItems[index];
									return (
										item && (
											<LocationCard key={`${item._id}-${index}`} data={item} />
										)
									);
								})}
							</div>
						</section>
					)}

					{(hasArrayValue(relatedGuides) ||
						hasArrayValue(defaultRelatedGuides)) && (
						<section className="p-guides-related">
							<h2 className="p-guides-related__title">Related Guides</h2>
							<div className="p-guides-related__content">
								{[...Array(4)].map((_, index) => {
									const relatedItems = relatedGuides || [];
									const defaultItems = defaultRelatedGuides || [];
									const allItems = [...relatedItems, ...defaultItems];
									const item = allItems[index];
									return (
										item && (
											<GuideCard key={`${item._id}-${index}`} data={item} />
										)
									);
								})}
							</div>
						</section>
					)}
				</div>
			</section>
		</>
	);
}

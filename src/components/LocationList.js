import React from 'react';
import LocationCard from '@/components/LocationCard';
import CustomPortableText from '@/components/CustomPortableText';

// TODO
// fallback locations

export default function LocationList({ data, color, isItinerary = false }) {
	const { title, content, locations, fallbackRains, fallbackLongWait } = data;

	return (
		<div className="c-location-list">
			{!isItinerary && title && (
				<h2 className="c-location-list__title t-h-2">{title}</h2>
			)}
			{content && (
				<div className="c-location-list__content wysiwyg-b-1">
					<CustomPortableText blocks={content} />
				</div>
			)}
			{locations && (
				<div className="c-location-list__cards">
					{locations.map((item, index) => (
						<LocationCard
							key={`item-${index}`}
							data={item}
							layout={'horizontal-full'}
							hasDirection={true}
						/>
					))}
				</div>
			)}

			{/* {isItinerary && (
				<>
					<div className="locations">
						<h3>Fallback (rain):</h3>
						{fallbackRains
							? fallbackRains?.map((item, index) => (
									<LocationCard key={`item-${index}`} data={item} />
								))
							: 'NONE'}
					</div>
					<div className="locations">
						<h3>Fallback (long wait):</h3>
						{fallbackLongWait
							? fallbackLongWait?.map((item, index) => (
									<LocationCard key={`item-${index}`} data={item} />
								))
							: 'NONE'}
					</div>
				</>
			)} */}
		</div>
	);
}

import React from 'react';
import clsx from 'clsx';
import LocationCard from '@/components/LocationCard';
import CustomPortableText from '@/components/CustomPortableText';

export default function LocationList({ data, color, isItinerary = false }) {
	const { title, content, locations, fallbackRains, fallbackLongWait } = data;

	return (
		<div className="c-location-list">
			{!isItinerary && <h2 className="c-location-list__title">{title}</h2>}
			{content && (
				<div className="c-location-list__content wysiwyg">
					<CustomPortableText blocks={content} />
				</div>
			)}

			{locations && (
				<div className="c-location-list__cards">
					{locations.map((item, index) => (
						<React.Fragment key={`item-${index}`}>
							<LocationCard
								key={`item-${index}`}
								data={item}
								layout={'horizontal'}
								color={color}
							/>
							{item.content && (
								<div className="c-location-list__item-content wysiwyg-page">
									<h3 className="t-h-3">{item.title}</h3>
									<CustomPortableText blocks={item.content} />
								</div>
							)}
						</React.Fragment>
					))}
				</div>
			)}

			{isItinerary && (
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
			)}
		</div>
	);
}

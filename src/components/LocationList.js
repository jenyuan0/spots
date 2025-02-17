import React from 'react';
import LocationCard from '@/components/LocationCard';
import CustomPortableText from '@/components/CustomPortableText';

export default function LocationList({ data, color, reservations }) {
	const { content, locations, fallbackRains, fallbackLongWait } = data;
	console.log(reservations);

	return (
		<div className="c-location-list">
			{content && (
				<div className="c-location-list__content">
					<CustomPortableText blocks={content} />
				</div>
			)}

			{locations && (
				<div className="c-location-list__cards">
					{locations.map((item, index) => (
						<LocationCard
							key={`item-${index}`}
							data={item}
							layout={'horizontal'}
							color={color}
							reservation={reservations.find(
								(obj) => obj?.location._id === item._id
							)}
						/>
					))}
				</div>
			)}
			{/* <div className="locations">
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
			</div> */}
		</div>
	);
}

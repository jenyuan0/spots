import React from 'react';
import LocationCard from '@/components/LocationCard';
import CustomPortableText from '@/components/CustomPortableText';

export default function LocationList({ data }) {
	const { title, content, locations } = data;

	return (
		<div className="c-location-list">
			{title && <h2 className="c-location-list__title t-h-2">{title}</h2>}
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
							layout={'horizontal-1'}
							hasDirection={true}
						/>
					))}
				</div>
			)}
		</div>
	);
}

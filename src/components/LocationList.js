import React from 'react';
import LocationCard from '@/components/LocationCard';
import CustomPortableText from '@/components/CustomPortableText';
import ResponsiveGrid from '@/components/ResponsiveGrid';

export default function LocationList({ data }) {
	const { title, content, locations } = data;

	return (
		<div className="c-location-list">
			{title && <h2 className="c-location-list__title t-l-1">{title}</h2>}
			{content && (
				<div className="c-location-list__content wysiwyg-b-1">
					<CustomPortableText blocks={content} />
				</div>
			)}
			{locations && (
				<ResponsiveGrid className="c-location-list__cards" size={'med'}>
					{locations.map((item, index) => (
						<LocationCard
							key={`item-${index}`}
							data={item}
							layout={'horizontal-2'}
							hasDirection={false}
						/>
					))}
				</ResponsiveGrid>
			)}
		</div>
	);
}

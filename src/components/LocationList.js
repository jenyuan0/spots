import React from 'react';
import LocationCard from '@/components/LocationCard';
import CustomPortableText from '@/components/CustomPortableText';

export default function LocationList({ data }) {
	const { content, locations, fallbackRains, fallbackLongWait } = data;

	return (
		<>
			{content && <CustomPortableText blocks={content} />}
			<div className="locations">
				<h3>Locations:</h3>
				{locations &&
					locations?.map((item, index) => (
						<LocationCard key={`item-${index}`} data={item} />
					))}
			</div>
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
	);
}

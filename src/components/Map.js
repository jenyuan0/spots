import React, { useState } from 'react';
import clsx from 'clsx';
import { formatTimeToAMPM, formatTime } from '@/lib/helpers';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import Img from '@/components/Image';

// TODO:
// 1. make route
// 2. getbounds to set zoom level
// 3. customize map color scheme
// 4. custom border radius via #filter-round is not working

const getMiddle = (prop, markers) => {
	if (!markers) {
		return 0;
	}

	// Extract values for the given property (lat/lng)
	const values = markers.map((m) => m['geo'][prop]);
	let min = Math.min(...values);
	let max = Math.max(...values);

	// Handle longitude wraparound case
	if (prop === 'lng' && max - min > 180) {
		// Normalize longitude values to handle 180/-180 boundary
		const normalizedValues = values.map((val) =>
			val < max - 180 ? val + 360 : val
		);
		min = Math.min(...normalizedValues);
		max = Math.max(...normalizedValues);
	}

	// Calculate middle point
	let result = (min + max) / 2;

	// Adjust longitude result back to -180/180 range if needed
	if (prop === 'lng' && result > 180) {
		result -= 360;
	}

	return result;
};

export default function TheMap({ id, locations }) {
	const [selectedMarker, setSelectedMarker] = useState();
	const center = {
		lat: getMiddle('lat', locations),
		lng: getMiddle('lng', locations),
	};

	return (
		<div className="c-map">
			<APIProvider apiKey={process.env.NEXT_PUBLIC_SANITY_GOOGLE_MAP_API_KEY}>
				<Map
					defaultCenter={center}
					defaultZoom={13}
					gestureHandling={'greedy'}
					// colorScheme={'LIGHT'}
					// disableDefaultUI={true}
					mapId={id || 'x'}
				>
					{locations.map((location, index) => {
						const isSelected = selectedMarker === location.title;
						const resStartTime = location?.res?.startTime
							? formatTime(new Date(location.res.startTime))
							: false;
						const actStartTime = location?.activity?.startTime
							? formatTimeToAMPM(location.activity.startTime)
							: false;

						return (
							<AdvancedMarker
								key={`${location.title}-${index}`}
								position={{ lat: location.geo.lat, lng: location.geo.lng }}
								title={location.title}
								onClick={() => setSelectedMarker(location.title)}
							>
								<div className="c-map__marker">
									<div className="c-map__marker__thumb">
										<span className="object-fit">
											<Img image={location.thumb} />
										</span>
									</div>
									<div
										className={clsx('c-map__marker__content', {
											'is-selected': isSelected,
										})}
									>
										<div className="c-map__marker__title">{location.title}</div>
										{(resStartTime || actStartTime) && (
											<div className="c-map__marker__time t-l-2">
												{resStartTime ? (
													<span>Reservation: {resStartTime}</span>
												) : location?.activity?.title ? (
													`${location.activity.title} (${actStartTime})`
												) : (
													actStartTime
												)}
											</div>
										)}
									</div>
								</div>
							</AdvancedMarker>
						);
					})}
				</Map>
			</APIProvider>
		</div>
	);
}

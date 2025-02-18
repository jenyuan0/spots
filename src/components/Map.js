import React, { useState, useCallback } from 'react';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import Img from '@/components/Image';

const getMiddle = (prop, markers) => {
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

export default function Maps({ locations }) {
	const [selectedMarker, setSelectedMarker] = useState();
	const center = {
		lat: getMiddle('lat', locations),
		lng: getMiddle('lng', locations),
	};

	const getBounds = useCallback(() => {
		const bounds = new window.google.maps.LatLngBounds();
		locations.forEach((location) => {
			bounds.extend(new window.google.maps.LatLng(location.lat, location.lng));
		});
		return bounds;
	}, [locations]);

	// Function to fit bounds and set zoom
	const onLoad = useCallback(
		(map) => {
			const bounds = getBounds();
			map.fitBounds(bounds);
			console.log(bounds);
			// Optional: set max/min zoom levels
			const listener = window.google.maps.event.addListener(map, 'idle', () => {
				if (map.getZoom() > 16) map.setZoom(16);
				window.google.maps.event.removeListener(listener);
			});
		},
		[getBounds]
	);

	return (
		<div className="c-map bg-subtle">
			<APIProvider apiKey={process.env.NEXT_PUBLIC_SANITY_GOOGLE_MAP_API_KEY}>
				<Map
					defaultCenter={center}
					defaultZoom={13}
					// colorScheme={'LIGHT'}
					gestureHandling={'greedy'}
					// disableDefaultUI={true}
					mapId="x"
					onLoad={onLoad}
				>
					{locations.map((location, index) => {
						const isSelected = selectedMarker === location.title;

						return (
							<AdvancedMarker
								key={`${location.title}-${index}`}
								position={{ lat: location.geo.lat, lng: location.geo.lng }}
								title={location.title}
								onClick={() => setSelectedMarker(location.title)}
							>
								<div
									style={{
										// padding: '8px 16px',
										// border: '2px solid #000000',
										// borderRadius: '20px',
										// background: isSelected ? '#ff0000' : '#ffffff',
										// color: isSelected ? '#ffffff' : '#000000',
										cursor: 'pointer',
										transition: 'all 0.3s ease',
									}}
								>
									<div
										style={{
											position: 'relative',
											width: '60px',
											height: '60px',
											borderRadius: '100px',
											overflow: 'hidden',
										}}
									>
										<span className="object-fit">
											<Img image={location.thumb} />
										</span>
									</div>
									<div
										style={{
											padding: '8px 16px',
											border: '2px solid #000000',
											borderRadius: '20px',
											transition: 'all 0.3s ease',
											transform: isSelected ? 'scale(1.2)' : 'scale(1)',
										}}
									>
										{location.title}
									</div>
								</div>
							</AdvancedMarker>
						);
					})}
				</Map>
			</APIProvider>
			{/* <GoogleMap
				mapContainerStyle={containerStyle}
				center={{
					lat: locations[0].lat,
					lng: locations[0].lng,
				}}
				zoom={10}
				onLoad={onLoad}
				onUnmount={onUnmount}
			>
				{locations.map((location) => {
					const isSelected = selectedMarker === location.name;

					return (
						<AdvancedMarker
							key={location.name}
							position={{ lat: location.lat, lng: location.lng }}
							title={location.name}
							onClick={() => setSelectedMarker(location.name)}
						>
							<div
								style={{
									padding: '8px 16px',
									background: isSelected ? '#ff0000' : '#ffffff',
									border: '2px solid #000000',
									borderRadius: '20px',
									color: isSelected ? '#ffffff' : '#000000',
									cursor: 'pointer',
									transition: 'all 0.3s ease',
									transform: isSelected ? 'scale(1.2)' : 'scale(1)',
								}}
							>
								{location.name}
							</div>
						</AdvancedMarker>
					);
				})}
			</GoogleMap> */}
		</div>
	);

	// return (
	// 	<LoadScript
	// 		googleMapsApiKey={process.env.NEXT_PUBLIC_SANITY_GOOGLE_MAP_API_KEY}
	// 		libraries={['marker']}
	// 	>
	// 		<GoogleMap
	// 			mapContainerStyle={mapStyles}
	// 			zoom={13}
	// 			center={{ lat: locations[0].lat, lng: locations[0].lng }}
	// 		>
	// 			{locations.map((location) => {
	// 				const isSelected = selectedMarker === location.name;

	// 				return (
	// 					<AdvancedMarkerElement
	// 						key={location.name}
	// 						position={{ lat: location.lat, lng: location.lng }}
	// 						title={location.name}
	// 						onClick={() => setSelectedMarker(location.name)}
	// 					>
	// 						<div
	// 							style={{
	// 								padding: '8px 16px',
	// 								background: isSelected ? '#ff0000' : '#ffffff',
	// 								border: '2px solid #000000',
	// 								borderRadius: '20px',
	// 								color: isSelected ? '#ffffff' : '#000000',
	// 								cursor: 'pointer',
	// 								transition: 'all 0.3s ease',
	// 								transform: isSelected ? 'scale(1.2)' : 'scale(1)',
	// 							}}
	// 						>
	// 							{location.name}
	// 						</div>
	// 					</AdvancedMarkerElement>
	// 				);
	// 			})}
	// 		</GoogleMap>
	// 	</LoadScript>
	// );
}

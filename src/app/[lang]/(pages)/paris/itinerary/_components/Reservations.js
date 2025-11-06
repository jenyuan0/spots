'use client';

import React from 'react';
import Link from '@/components/CustomLink';
import CustomPortableText from '@/components/CustomPortableText';
import LocationCard from '@/components/LocationCard';

export default function Reservations({ reservations }) {
	return (
		<div className="p-itinerary__reservations">
			<div className="p-itinerary__reservations__header">
				<h1 className="t-h-1">Reservations:</h1>
			</div>

			<div className="p-itinerary__reservations__list">
				{reservations?.map((item, index) => {
					const findReservation = (location, reservations) =>
						reservations?.find((r) => r.location._id === location._id);
					let location = {
						...item.location,
						res: findReservation(item.location, reservations),
					};

					return (
						<div key={`item-${index}`}>
							<LocationCard key={`item-${index}`} data={location} />
							Time: {item?.startTime} — {item?.endTime || 'NO END'}
							<br />
							Notes:
							{item?.notes ? (
								<CustomPortableText blocks={item?.notes} />
							) : (
								'NONE'
							)}
							<br />
							Attachments:{' '}
							<ul>
								{item?.attachments?.map((attachment, index) => (
									<li key={`attachment-${index}`}>
										<Link href={attachment.url}>{attachment.filename}</Link>
									</li>
								))}
							</ul>
						</div>
					);
				})}
			</div>
		</div>
	);
}

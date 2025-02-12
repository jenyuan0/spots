'use client';

import React from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import LocationList from '@/components/LocationList';
import CustomLink from '@/components/CustomLink';
import Img from '@/components/Image';
import Carousel from '@/components/Carousel';
import LocationCard from '@/components/LocationCard';
import GuideCard from '@/components/GuideCard';

export function getActivities({ data }) {
	const { _type } = data;

	switch (_type) {
		case 'freeform':
			return <CustomPortableText blocks={data} />;

		case 'locationList':
			return <LocationList data={data} />;
	}
}

export default function PageItinerarySingle({ data }) {
	const {
		title,
		images,
		plan,
		guides,
		type,

		NumOfDays,
		NumOfTravelers,
		budget,
		accomodations,

		passcode,
		name,
		startDate,
		introMessage,
		endingMessage,
		emergencyContact,
		accommodation,
		reservations,
	} = data || {};

	return (
		<>
			<section className="p-itinerary-single data-container">
				<h1 className="p-itinerary-single__title">{title}</h1>

				{images && (
					<div className="data-container-small">
						<Carousel
							isShowDots={true}
							isAutoplay={true}
							autoplayInterval={3000}
						>
							{images?.map((image) => (
								<Img key={image.id} image={image} />
							))}
						</Carousel>
					</div>
				)}

				<div className="p-itinerary-single__content">
					<h1>PLAN:</h1>
					{plan?.map((plan, index) => {
						return (
							<div className="data-block" key={`item-${index}`}>
								<h2>
									Day {index + 1}: {plan.title || plan?.day.title}{' '}
								</h2>

								<div className="data-block">
									Content:{' '}
									{plan.content || plan?.day?.content ? (
										<CustomPortableText
											blocks={plan.content || plan.day.content}
										/>
									) : (
										'NONE'
									)}
								</div>

								<div className="data-block">
									{plan?.day?.images && (
										<Carousel
											isShowDots={true}
											isAutoplay={true}
											autoplayInterval={3000}
										>
											{plan?.day?.images?.map((image) => (
												<Img key={image.id} image={image} />
											))}
										</Carousel>
									)}
								</div>

								<h2>Activities:</h2>
								{plan.day?.activities.map((activity, index) => {
									return (
										<div className="data-block" key={`activity-${index}`}>
											<strong>
												ACTIVITY {index + 1} ({activity._type}):
											</strong>{' '}
											{getActivities({ data: activity })}
										</div>
									);
								})}
							</div>
						);
					})}

					<br />
					<br />

					{guides && (
						<>
							<h1>Guides:</h1>
							<div className="data-block">
								{guides?.map((item, index) => {
									return <GuideCard key={`item-${index}`} data={item} />;
								})}
							</div>
						</>
					)}

					<br />
					<br />
					<h1>TYPE: {type}</h1>
					<div className="data-block">
						{type == 'premade' ? (
							<>
								NumOfDays: {NumOfDays}
								<br />
								NumOfTravelers: {NumOfTravelers}
								<br />
								Budget: {budget?.low}—{budget?.high}
								<br />
								Accomodations:
								{accomodations &&
									accomodations?.map((item, index) => (
										<LocationCard key={`item-${index}`} data={item} />
									))}
							</>
						) : (
							<>
								Passcode: {passcode || 'NONE'}
								<br />
								Name: {name || 'NONE'}
								<br />
								Start Date: {startDate || 'NONE'}
								<br />
								Intro Message:{' '}
								{introMessage ? (
									<CustomPortableText blocks={introMessage} />
								) : (
									'NONE'
								)}
								<br />
								CustomPortableText Ending Message:{' '}
								{endingMessage ? (
									<CustomPortableText blocks={endingMessage} />
								) : (
									'NONE'
								)}
								<br />
								Emergency Contact:{' '}
								{emergencyContact ? (
									<CustomPortableText blocks={emergencyContact} />
								) : (
									'NONE'
								)}
								<br />
								<h3>Accomodation</h3>
								{accommodation ? (
									<>
										{accommodation.location && (
											<LocationCard data={accommodation.location} />
										)}
										<br />
										Accomodations check-in:{' '}
										{accommodation.checkInTime || 'NONE'}
										<br />
										Accomodations check-out:{' '}
										{accommodation.checkOutTime || 'NONE'}
										<br />
										Accomodations notes: {accommodation.notes || 'NONE'}
										<br />
										Accomodations attachments:{' '}
										{accommodation.attachments || 'NONE'}
									</>
								) : (
									'NO ACCOMMODATION'
								)}
							</>
						)}
					</div>
					<br />
					<br />
					{reservations && (
						<>
							<h1>RESERVATIONS:</h1>
							<div className="data-block">
								{reservations?.map((item, index) => {
									return (
										<div className="data-block" key={`item-${index}`}>
											<LocationCard
												key={`item-${index}`}
												data={item?.location}
											/>
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
														<CustomLink link={{ route: attachment.url }}>
															{attachment.filename}
														</CustomLink>
													</li>
												))}
											</ul>
										</div>
									);
								})}
							</div>
						</>
					)}
				</div>
			</section>
		</>
	);
}

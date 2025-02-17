'use client';

import React, { useState } from 'react';
import { formatToAMPM } from '@/lib/helpers';
import HeaderItinerary from '@/layout/HeaderItinerary';
import CustomPortableText from '@/components/CustomPortableText';
import LocationList from '@/components/LocationList';
import CustomLink from '@/components/CustomLink';
import Img from '@/components/Image';
import Carousel from '@/components/Carousel';
import LocationCard from '@/components/LocationCard';
import GuideCard from '@/components/GuideCard';
import Accordion from '@/components/Accordions/Accordion';
import { format, add } from 'date-fns';

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
	const colors = ['green', 'blue', 'red', 'orange', 'purple'];
	const [activeDay, setActiveDay] = useState(0);
	const startDateObj = new Date(startDate);
	const convertToAMPM = (militaryTime) => {
		const [hours, minutes] = militaryTime.split(':');
		let hour = parseInt(hours);
		const minute = parseInt(minutes);
		const period = hour >= 12 ? 'PM' : 'AM';

		// Convert hour to 12-hour format
		if (hour === 0) {
			hour = 12;
		} else if (hour > 12) {
			hour = hour - 12;
		}

		const formattedMinutes = minute.toString().padStart(2, '0');

		return `${hour}:${formattedMinutes} ${period}`;
	};

	return (
		<>
			{type == 'custom' && (
				<HeaderItinerary data={data} colors={colors} activeDay={activeDay} />
			)}

			{plan?.map((plan, i) => {
				const date = add(startDateObj, { days: i });

				return (
					<div
						className="p-itinerary__plan f-v f-a-s"
						key={`item-${i}`}
						style={{
							'--cr-text': `var(--cr-${colors[i % colors.length]}-d)`,
							'--cr-background': `var(--cr-${colors[i % colors.length]}-l)`,
						}}
					>
						<div className="p-itinerary__plan__header wysiwyg">
							<div className="t-l-1">Day {i + 1}</div>
							<h2 className="t-h-2">{plan.title || format(date, 'MMMM do')}</h2>
						</div>

						{plan?.day?.images && (
							<div className="p-itinerary__plan__images">
								<Carousel
									isShowDots={true}
									isAutoplay={true}
									autoplayInterval={3000}
								>
									{plan?.day?.images?.map((image) => (
										<Img key={image.id} image={image} />
									))}
								</Carousel>
							</div>
						)}

						{(plan.content || plan?.day?.content) && (
							<div className="p-itinerary__plan__highlight wysiwyg">
								<h3 className="t-l-1">Day Highlight</h3>
								<CustomPortableText blocks={plan.content || plan.day.content} />
							</div>
						)}

						<div className="p-itinerary__plan__activities">
							<h2 className="p-itinerary__plan__activities__title t-l-1">
								Activities
							</h2>
							{plan.day?.activities.map((activity, index) => {
								const { title, startTime } = activity;
								const locationLength = activity.locations?.length || 0;

								return (
									<Accordion
										key={`${i}-activity-${index}`}
										title={
											title ||
											`${locationLength} Spot${locationLength !== 1 && 's'}`
										}
										subtitle={startTime ? convertToAMPM(startTime) : '-'}
									>
										<LocationList data={activity} />
									</Accordion>
								);
							})}
						</div>
					</div>
				);
			})}

			<section className="p-itinerary data-container">
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

'use client';

import React, { useState } from 'react';
import { formatTimeToAMPM } from '@/lib/helpers';
import { format, add, isSameMonth } from 'date-fns';
import clsx from 'clsx';
import HeaderItinerary from '@/layout/HeaderItinerary';
import CustomPortableText from '@/components/CustomPortableText';
import LocationList from '@/components/LocationList';
import CustomLink from '@/components/CustomLink';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import LocationCard from '@/components/LocationCard';
import GuideCard from '@/components/GuideCard';
import Accordion from '@/components/Accordions/Accordion';
import Map from '@/components/Map';

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
	const endDateObj = add(startDateObj, { days: plan.length });

	return (
		<>
			{type == 'custom' && (
				<HeaderItinerary data={data} colors={colors} activeDay={activeDay} />
			)}
			<div className="p-itinerary__header wysiwyg">
				<div className="t-l-1">
					{format(startDateObj, 'MMMM do')}—
					{isSameMonth(startDateObj, endDateObj)
						? format(endDateObj, 'do')
						: format(endDateObj, 'MMMM do')}
				</div>
				<h1 className="t-h-1">{title}</h1>
			</div>
			{/* {images && (
				<div className="p-itinerary__images">
					<Carousel
						isShowDots={true}
						isAutoplay={true}
						itemWidth={'auto'}
						gap={'10px'}
					>
						{images?.map((image) => (
							<div key={image.id} className="p-itinerary__images__image">
								<Img image={image} />
							</div>
						))}
					</Carousel>
				</div>
			)} */}
			{plan?.map((plan, i) => {
				const date = add(startDateObj, { days: i });
				const color = colors[i % colors.length];
				const allLocations = plan?.day?.activities
					.reduce((acc, activity) => {
						const locations = Array.isArray(activity.locations)
							? activity.locations
							: [];
						return [...acc, ...locations];
					}, [])
					.filter((location) => location !== '');

				return (
					<div
						className="p-itinerary__plan f-v f-a-s"
						key={`plan-${i}`}
						style={{
							'--cr-primary': `var(--cr-${color}-d)`,
							'--cr-secondary': `var(--cr-${color}-l)`,
						}}
					>
						<div className="p-itinerary__plan__header wysiwyg">
							<div className="t-l-1">Day {i + 1}</div>
							<h2 className="t-h-2">{plan.title || format(date, 'MMMM do')}</h2>
						</div>

						{plan.day?.images && (
							<div className="p-itinerary__plan__images">
								<Carousel
									isShowDots={true}
									isAutoplay={true}
									autoplayInterval={6000}
								>
									{plan?.day?.images?.map((image, i) => (
										<Img key={`image-${i}-${image.id}`} image={image} />
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
										subtitle={startTime ? formatTimeToAMPM(startTime) : '-'}
									>
										<LocationList
											data={activity}
											color={color}
											reservations={reservations}
										/>
									</Accordion>
								);
							})}
						</div>

						<div className="p-itinerary__plan__footer f-v f-a-c">
							<Button className={clsx('btn', `cr-${color}-d`)}>Show Map</Button>
						</div>

						<Map locations={allLocations} />
					</div>
				);
			})}

			<section className="p-itinerary data-container">
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

'use client';

import React, { useState } from 'react';
import { format, add, isSameDay, isSameMonth } from 'date-fns';
import HeaderItinerary from '@/layout/HeaderItinerary';
import CustomPortableText from '@/components/CustomPortableText';
import CustomLink from '@/components/CustomLink';
import Img from '@/components/Image';
import Button from '@/components/Button';
import LocationCard from '@/components/LocationCard';
import GuideCard from '@/components/GuideCard';
import Plan from './Plan';

// TODO:
// 1. custom background image for each day
// 2. weather dependent icon next to each day's title
// 3. more fun

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
	const [activeTab, setActiveTab] = useState('plan');
	const startDateObj = new Date(startDate);
	const endDateObj = add(startDateObj, { days: plan.length });

	return (
		<>
			{type == 'custom' && (
				<HeaderItinerary
					data={data}
					colors={colors}
					activeDay={activeDay}
					setActiveDay={setActiveDay}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
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

			<div className="p-itinerary__tab" dataTabActive={activeTab == 'plan'}>
				{plan?.map((plan, i) => {
					const date = add(startDateObj, { days: i });
					const color = colors[i % colors.length];

					return (
						<Plan
							key={`plan-${i}`}
							index={i}
							plan={plan}
							reservations={reservations}
							date={date}
							color={color}
						/>
					);
				})}
			</div>

			<div
				className="p-itinerary__tab"
				dataTabActive={activeTab == 'plan'}
			></div>

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

'use client';

import React from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import { hasArrayValue } from '@/lib/helpers';
import Carousel from '@/components/Carousel';
import Image from '@/components/Image';
import LocationCard from '@/components/LocationCard';
import GuideCard from '@/components/GuideCard';

export default function PageItinerarySingle({ data }) {
	const {
		title,
		images,
		plan,
		type,
		NumOfDays,
		NumOfTravelers,
		budget,
		accomodations,

		passcode,
		name,
		startDate,
		accommodation,
	} = data || {};

	return (
		<>
			<section className="p-guides-single" style={{ maxWidth: '900px' }}>
				<h1 className="p-guides-single__title">{title}</h1>
				<div className="p-guides-single__content wysiwyg-page">
					TYPE: {type}
					<br />
					PLAN:
					<br />
					{plan &&
						plan?.map((plan, index) => {
							return (
								<div key={index}>
									<h2>
										Day {index + 1}: {plan.dayTitle || plan?.day.title}{' '}
									</h2>
									Content:
									{(plan.content || plan?.day?.content) && (
										<CustomPortableText
											blocks={plan.content || plan.day.content}
										/>
									)}
									{plan?.day?.images && (
										<Carousel
											isShowDots={true}
											isAutoplay={true}
											autoplayInterval={3000}
										>
											{plan?.day?.images?.map((image) => (
												<Image key={image.id} image={image} />
											))}
										</Carousel>
									)}
									{plan.day.activities.map((activity, index) => {
										return (
											<div key={index}>
												ACTIVITY {index + 1}:{console.log(activity)}
											</div>
										);
									})}
								</div>
							);
						})}
					<br />
					<br />
					<br />
					<h2>Premade:</h2>
					NumOfDays: {NumOfDays}
					<br />
					NumOfTravelers: {NumOfTravelers}
					<br />
					Budget: {budget?.low}—{budget?.high}
					<br />
					Accomodations:
					{accomodations &&
						accomodations?.map((accomodation) => (
							<LocationCard data={accomodation} />
						))}{' '}
					<br />
					<br />
					<br />
					<h2>Custom:</h2>
					passcode: {passcode}
					<br />
					name: {name}
					<br />
					startDate: {startDate}
					<br />
					{accommodation ? (
						<>
							Accomodations check-in: {accommodation.checkInTime}
							<br />
							Accomodations check-out: {accommodation.checkOutTime}
							<br />
							Accomodations notes: {accommodation.notes}
							<br />
							Accomodations attachments: {accommodation.attachments}
						</>
					) : (
						'NO ACCOMMODATION'
					)}
					<br />
					<br />
					<br />
					{images && (
						<Carousel
							isShowDots={true}
							isAutoplay={true}
							autoplayInterval={3000}
						>
							{images?.map((image) => (
								<Image key={image.id} image={image} />
							))}
						</Carousel>
					)}
				</div>
			</section>
		</>
	);
}

'use client';

import React, { useState } from 'react';
import { format, add, isSameDay, isSameMonth } from 'date-fns';
import LocationCard from '@/components/LocationCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import ItineraryDay from './ItineraryDay';
import PlanForm from '@/components/PlanForm';
import PlanSection from '@/components/PlanSection';
import Carousel from '@/components/Carousel';
import Img from '@/components/Image';

// TODO:
// 1. custom background image for each day
// 2. weather dependent icon next to each day's title
// 3. more fun - weather dependent scenary based on section or active accordion, e.g. cloud emerging, sun coming up then going down, etc.
// add "passion points" or "highlights": https://indagare.com/journeys/slovenia-and-croatia-september-2025

// INSPO:
// https://kaer.co/destination/es-raco-darta
// https://travel.priorworld.com/itineraries/four-days-in-rome-2
// https://www.abercrombiekent.com/journeys/private-ready-to-book/villa-castiglioni
// https://www.elsewhere.io/
// https://casaportufornia.com/
// https://www.airbnb.com/rooms/32011367

export default function PageItinerarySingle({ data }) {
	const {
		title,
		subtitle,
		images,
		color,
		totalDays,
		totalActivities,

		introduction,
		accomodations,
		plan,
		guides,
		type,

		NumOfDays,
		NumOfTravelers,
		budget,

		passcode,
		name,
		startDate,
		introMessage,
		endingMessage,
		emergencyContact,
		accommodation,
		reservations,
		planForm,
	} = data || {};
	const [activeDay, setActiveDay] = useState(0);
	const [activeTab, setActiveTab] = useState('plan');
	const startDateObj = startDate ? new Date(startDate) : false;
	const endDateObj = startDateObj
		? add(startDateObj, { days: plan.length })
		: false;

	return (
		<>
			<div
				className="p-itinerary__header"
				style={{
					'--cr-primary': `var(--cr-${color?.title || 'brown'}-d)`,
					'--cr-secondary': `var(--cr-${color?.title || 'brown'}-l)`,
				}}
			>
				<div className="p-itinerary__header__text wysiwyg">
					{startDateObj && (
						<div className="t-l-1">
							{format(startDateObj, 'MMMM do')}—
							{isSameMonth(startDateObj, endDateObj)
								? format(endDateObj, 'do')
								: format(endDateObj, 'MMMM do')}
						</div>
					)}
					<h1 className="t-l-2">{title}</h1>
					<h2 className="t-h-1">{subtitle}</h2>
				</div>
				<ul className="p-itinerary__header__stats">
					<li>
						<div className="t-l-2">Day{totalDays > 1 && 's'}</div>
						<div className="t-h-2">{totalDays}</div>
					</li>
					<li>
						<div className="t-l-2">Spot{totalActivities > 1 && 's'}</div>
						<div className="t-h-2">{totalActivities}</div>
					</li>
				</ul>
			</div>

			<div
				className="p-itinerary__body"
				style={{
					'--cr-primary': `var(cr-${color?.title || 'brown'}-d)`,
					'--cr-secondary': `var(cr-${color?.title || 'brown'}-l)`,
				}}
			>
				<div className="p-itinerary__sections">
					{images && (
						<Carousel
							className="p-itinerary__images"
							align="start"
							gap={'10px'}
							isShowNav={true}
						>
							{images.map((image, i) => (
								<Img key={`image-${i}`} image={image} />
							))}
						</Carousel>
					)}
					{introduction && (
						<div className="p-itinerary__introduction p-itinerary__section">
							<h2 className="p-itinerary__section__title t-l-1">
								Trip Highlights
							</h2>
							<p className="t-h-3">{introduction}</p>
						</div>
					)}
					{accomodations && (
						<div className="p-itinerary__accomodations p-itinerary__section">
							<h3 className="p-itinerary__section__title t-h-2">
								Accomodation
								<span className="t-l-1">
									{accomodations.length} Option
									{accomodations.length > 1 && 's'}
								</span>
							</h3>
							<ResponsiveGrid className="p-itinerary__accomodations__grid">
								{accomodations.map((item, index) => (
									<LocationCard
										key={`item-${index}`}
										data={item}
										layout={'vertical-2'}
										hasDirection={true}
									/>
								))}
							</ResponsiveGrid>
						</div>
					)}
					{plan && (
						<div
							className="p-itinerary__days p-itinerary__section"
							datatabactive={activeTab == 'plan' ? 'true' : 'false'}
						>
							<h3 className="p-itinerary__section__title t-h-2">
								Trip Itinerary
								<span className="t-l-1">
									{plan.length} Day
									{plan.length > 1 && 's'}
								</span>
							</h3>
							{plan?.map((plan, i) => {
								const date = startDateObj
									? add(startDateObj, { days: i })
									: false;
								return (
									<ItineraryDay
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
					)}
				</div>
				<div className="p-itinerary__sidebar">
					<div className="p-itinerary__sidebar-flex" />
					<div className="p-itinerary__sidebar-sticky">
						<PlanForm
							data={planForm}
							title={false}
							budget={budget}
							offering={true}
						/>
						<div className="p-itinerary__sidebar__form-message t-b-2">
							{'Average response time < 16hr'}
						</div>
					</div>
				</div>
			</div>

			<div className="p-itinerary__contact">
				<PlanSection data={data?.planForm} isH1={true} isH1Style={true} />
			</div>

			{/* <section className="p-itinerary">
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
									Accomodations check-in: {accommodation.checkInTime || 'NONE'}
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
			</section>

			{reservations && <Reservations reservations={reservations} />} */}
		</>
	);
}

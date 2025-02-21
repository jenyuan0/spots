'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { formatTimeToAMPM } from '@/lib/helpers';
import { format, isSameDay } from 'date-fns';
import clsx from 'clsx';
import CustomPortableText from '@/components/CustomPortableText';
import LocationList from '@/components/LocationList';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import Accordion from '@/components/Accordions/Accordion';
import Map from '@/components/Map';

// Helper functions
const getActivitiesPlusRes = (activities, reservations, date) =>
	activities.map((activity) => ({
		...activity,
		locations: Array.isArray(activity.locations)
			? activity.locations.map((location) => ({
					...location,
					res: findReservation(location, reservations, date),
				}))
			: [],
	}));

const findReservation = (location, reservations, date) =>
	reservations?.find(
		(r) =>
			r.location._id === location._id && date && isSameDay(r?.startTime, date)
	);

const getLocationsPlusActivity = (activitiesPlusRes) =>
	activitiesPlusRes
		.reduce(
			(acc, activity) => [
				...acc,
				...(Array.isArray(activity.locations)
					? activity.locations.map((location) => ({
							...location,
							activity,
						}))
					: []),
			],
			[]
		)
		.filter((location) => location !== '');

const getColorStyles = (color) => ({
	'--cr-primary': `var(--cr-${color}-d)`,
	'--cr-secondary': `var(--cr-${color}-l)`,
});

export default function Plan({ index, plan, reservations, color, date }) {
	const baseId = useId();
	const activities = plan?.day?.activities || [];
	const activitiesPlusRes = getActivitiesPlusRes(
		activities,
		reservations,
		date
	);

	// State management
	const [isMapActive, setIsMapActive] = useState(false);
	const [checkedActivities, setCheckedActivities] = useState(() => {
		const initialSet = new Set();
		activities.forEach((activity) => initialSet.add(activity.title));
		return initialSet;
	});

	const filterLocationsByActivities = useCallback(() => {
		if (checkedActivities.size === 0) {
			return getLocationsPlusActivity([]);
		}
		const filteredActivities = activitiesPlusRes.filter((activity) =>
			checkedActivities.has(activity.title)
		);
		return getLocationsPlusActivity(filteredActivities);
	}, [activitiesPlusRes, checkedActivities]);

	// Handle checkbox changes
	const handleActivityToggle = (title) => {
		setCheckedActivities((prev) => {
			const next = new Set(prev);
			next.has(title) ? next.delete(title) : next.add(title);
			return next;
		});
	};

	// Process locations for map
	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				setIsMapActive(false);
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, []);

	return (
		<div className="p-itinerary__plan f-v f-a-s" style={getColorStyles(color)}>
			<div className="p-itinerary__plan__header wysiwyg">
				<div className="t-l-1">Day {index + 1}</div>
				<h2 className="t-h-2">{plan.title || format(date, 'MMMM do')}</h2>
			</div>

			{plan.day?.images && (
				<div className="p-itinerary__plan__images">
					<Carousel isShowDots={true} isAutoplay={true} autoplayInterval={6000}>
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
				{activitiesPlusRes?.map((activity, i) => {
					const { title, startTime } = activity;

					return (
						<Accordion
							key={`${index}-activity-${i}`}
							title={title}
							subtitle={startTime ? formatTimeToAMPM(startTime) : '-'}
						>
							<LocationList data={activity} />
						</Accordion>
					);
				})}
			</div>

			<div className="p-itinerary__plan__footer f-v f-a-c">
				<Button
					className={clsx('btn', `cr-${color}-d`)}
					onClick={() => {
						setIsMapActive(true);
					}}
				>
					Show Map
				</Button>
			</div>

			<div
				className={clsx('p-itinerary__plan__map', {
					'is-active': isMapActive,
				})}
			>
				<Map id={baseId} locations={filterLocationsByActivities()} />
				<Button
					className={clsx(
						'p-itinerary__plan__map__close',
						'btn',
						`cr-${color}-d`
					)}
					onClick={() => {
						setIsMapActive(false);
					}}
				>
					<span className="icon-close" />
					Close
				</Button>

				<div className="p-itinerary__plan__map__filters">
					<h2 className="t-h-4">{plan.title || format(date, 'MMMM do')}</h2>
					<ul>
						{activities?.map((activity, i) => {
							const { title, startTime } = activity;
							const locationLength = activity.locations?.length || 0;
							const id = `${baseId}-activity-${i}`;

							return (
								<li key={id} className="t-l-1">
									<input
										id={id}
										type="checkbox"
										checked={checkedActivities.has(title)}
										onChange={() => handleActivityToggle(title)}
									/>
									<label htmlFor={id}>
										{startTime && formatTimeToAMPM(startTime)} {title}
										{locationLength && ` (${locationLength})`}
									</label>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}

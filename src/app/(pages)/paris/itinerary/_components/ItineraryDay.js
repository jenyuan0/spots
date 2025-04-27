'use client';

import React, { useState, useCallback, useId } from 'react';
import { formatTimeToAMPM, scrollEnable, scrollDisable } from '@/lib/helpers';
import { format, isSameDay } from 'date-fns';
import clsx from 'clsx';
import useKey from '@/hooks/useKey';
import CustomPortableText from '@/components/CustomPortableText';
import LocationCard from '@/components/LocationCard';
import Button from '@/components/Button';
import Accordion from '@/components/Accordions/Accordion';
import Map from '@/components/Map';
import { IconMaximize, IconMinimize } from '@/components/SvgIcons';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import useWindowDimensions from '@/hooks/useWindowDimensions';

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

export default function ItineraryDay({
	index,
	plan,
	reservations,
	date,
	color,
}) {
	const baseId = useId();
	const activities = plan?.day?.activities || [];
	const activitiesPlusRes = getActivitiesPlusRes(
		activities,
		reservations,
		date
	);
	const { isTabletScreen } = useWindowDimensions();

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
		if (title === 'selectAll') {
			setCheckedActivities(
				new Set(activities.map((activity) => activity.title))
			);
		} else if (title === 'deselectAll') {
			setCheckedActivities(new Set());
		} else {
			setCheckedActivities((prev) => {
				const next = new Set(prev);
				next.has(title) ? next.delete(title) : next.add(title);
				return next;
			});
		}
	};

	const handleMapClose = () => {
		setIsMapActive(false);
		scrollEnable();
	};

	useKey(() => {
		if (!window.location.search.includes('?m=')) {
			handleMapClose();
		}
	});

	return (
		<div className="p-itinerary__day">
			<div className="p-itinerary__day__header">
				<h3 className="p-itinerary__day__badge">
					<div className="t-l-2">Day</div>
					<div className="t-h-2">{index + 1}</div>
				</h3>
				{(plan.content || plan?.day?.content) && (
					<p className="t-b-1">
						<CustomPortableText
							blocks={plan.content || plan.day.content}
							hasPTag={false}
						/>
					</p>
				)}
			</div>

			<div className="p-itinerary__day__activities">
				{activitiesPlusRes?.map((activity, i) => {
					const {
						title,
						startTime,
						locations,
						content,
						fallbackRains,
						fallbackLongWait,
					} = activity;

					return (
						<Accordion
							key={`${index}-activity-${i}`}
							title={title}
							subtitle={startTime ? formatTimeToAMPM(startTime) : 'Optional'}
						>
							{content && (
								<div className="p-itinerary__day__activities__content wysiwyg-b-1">
									<CustomPortableText blocks={content} />
								</div>
							)}
							<ResponsiveGrid
								className={'p-itinerary__day__activities__locations'}
							>
								{locations.map((item, index) => (
									<LocationCard
										key={`item-${index}`}
										data={item}
										layout={
											!isTabletScreen
												? `horizontal-${locations.length == 1 ? '2' : '1'}`
												: 'vertical-2'
										}
										hasDirection={true}
									/>
								))}
							</ResponsiveGrid>
							{/* // TODO // fallback locations */}
							{/* {<div className="locations">
											<h3>Fallback (rain):</h3>
											{fallbackRains
												? fallbackRains?.map((item, index) => (
														<LocationCard key={`item-${index}`} data={item} />
													))
												: 'NONE'}
										</div>
										<div className="locations">
											<h3>Fallback (long wait):</h3>
											{fallbackLongWait
												? fallbackLongWait?.map((item, index) => (
														<LocationCard key={`item-${index}`} data={item} />
													))
												: 'NONE'}
										</div>} */}
						</Accordion>
					);
				})}
			</div>
			<div className="p-itinerary__day__footer f-v f-a-c">
				<Button
					className={clsx('btn', color && `cr-${color?.title}-d`)}
					icon={<IconMaximize />}
					onClick={() => {
						setIsMapActive(true);
						scrollDisable();
					}}
				>
					Show Map
				</Button>
			</div>
			<div
				className={clsx('p-itinerary__day__map', {
					'is-active': isMapActive,
				})}
			>
				<Map id={baseId} locations={filterLocationsByActivities()} />
				<Button
					className={clsx(
						'p-itinerary__day__map__close btn',
						color && `cr-${color?.title}-d`
					)}
					icon={<IconMinimize />}
					onClick={handleMapClose}
				>
					Close Map
				</Button>
				<div className="p-itinerary__day__map__filters">
					<h2 className="t-h-3">Filter Activities</h2>
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
										{startTime && formatTimeToAMPM(startTime)} - {title}
										{locationLength && ` (${locationLength})`}
									</label>
								</li>
							);
						})}
						<li className="p-itinerary__day__map__filters__batch-action t-l-2">
							<button
								onClick={() => {
									handleActivityToggle(
										checkedActivities.size == activities.length
											? 'deselectAll'
											: 'selectAll'
									);
								}}
							>
								<u>
									{checkedActivities.size == activities.length
										? 'Deselect All'
										: 'Select All'}
								</u>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

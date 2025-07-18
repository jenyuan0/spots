import clsx from 'clsx';
import React, { useEffect, useState, useRef } from 'react';
import Button from '@/components/Button';
import Field from '@/components/Field';
import { IconWhatsApp, IconEmail } from '@/components/SvgIcons';
import { client } from '@/sanity/lib/client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import dayjs from 'dayjs';
import useOutsideClick from '@/hooks/useOutsideClick';
import useWindowDimensions from '@/hooks/useWindowDimensions';

const DATE_FORMAT = 'MMM D';

function getWhoMessage([adults, children, pets]) {
	const parts = [];
	if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
	if (children > 0)
		parts.push(`${children} Children${children > 1 ? 's' : ''}`);
	if (pets > 0) parts.push(`${pets} Pet${pets > 1 ? 's' : ''}`);
	return parts.join(', ') || '';
}

export default function HotelForm({ data }) {
	const { isTabletScreen } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	const [subject] = useState(data?.subject ?? 'Hotel search');
	const [heading, setHeading] = useState(data?.heading ?? '');
	const [subheading, setSubheading] = useState(data?.subheading ?? '');
	const [where, setWhere] = useState(data?.where || '');
	const [whenMessage, setWhenMessage] = useState('');
	const [whoMessage, setWhoMessage] = useState('');
	const [message, setMessage] = useState('');
	const [budget, setBudget] = useState('');
	const [errorIsVisible, setErrorIsVisible] = useState(false);

	const [budgetTotal, setBudgetTotal] = useState(0);
	const [budgetPerNight, setBudgetPerNight] = useState(0);

	const [budgetMin, setBudgetMin] = useState(0);
	const [budgetMax, setBudgetMax] = useState(0);

	const [content, setContent] = useState();
	const fetchContent = async () => {
		try {
			const data = await Promise.all([
				client.fetch(`
					*[_type == "pHotelBooking"][0]{
						contactHeading,
						contactSubheading,
						contactPlaceholder
					}
				`),
			]);
			setContent(data[0]);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchContent();
	}, []);

	useEffect(() => {
		if (content) {
			const newHeading = data?.heading ?? content.contactHeading ?? '';
			const newSubheading = data?.subheading ?? content.contactSubheading ?? '';
			const newWhere = data?.where || '';
			setHeading(newHeading);
			setSubheading(newSubheading);
			setWhere(newWhere);

			let parts = ['Hi, I’m looking for help finding a hotel'];
			if (newWhere) parts.push(`in ${newWhere}`);
			if (whenMessage) parts.push(`for ${whenMessage}`);
			if (whoMessage) parts.push(`for ${whoMessage.toLowerCase()}`);
			if (budgetMin > 0 && budgetMax > 0)
				parts.push(
					`with a per-night budget of $${budgetMin.toLocaleString()}–${budgetMax.toLocaleString()}`
				);
			setMessage(parts.join(' ') + '.');
		}
	}, [data, content, whenMessage, whoMessage, budgetMin, budgetMax]);

	const [whenCalActive, setWhenCalActive] = useState(false);
	const [whenStartDate, setWhenStartDate] = useState(new Date());
	const [whenRange, setWhenRange] = useState([null, null]);
	const whenFieldRef = useRef();
	useOutsideClick(whenFieldRef, () => {
		setWhenCalActive(false);
	});

	const handleDateChange = (value) => {
		const startDateObj = dayjs(value[0]);
		const endDateObj = dayjs(value[1]);

		if (endDateObj.isSame(startDateObj, 'day')) {
			return;
		}

		setWhenRange(value);

		const startDate = startDateObj.format(DATE_FORMAT);
		const endDate = endDateObj.format(DATE_FORMAT);
		const nights = endDateObj.diff(startDateObj, 'day');

		setWhenMessage(`${startDate}—${endDate} (${nights} nights)`);

		const minPerNight = 200;
		const maxPerNight = 1200;

		setBudgetMin(minPerNight);
		setBudgetMax(maxPerNight);

		let currentPerNight = budgetPerNight;
		if (currentPerNight === 0) {
			currentPerNight = minPerNight;
		}

		// Recalculate per night budget proportionally to new nights
		let newTotal = currentPerNight * nights;

		setBudgetTotal(newTotal);
		setBudgetPerNight(currentPerNight);
	};

	const handleActiveStartDateChange = ({
		action,
		activeStartDate: newStartDate,
	}) => {
		if (action === 'prev' || action === 'next') {
			setWhenStartDate(newStartDate);
		}
	};

	const [whoDetailsActive, setWhoDetailsActive] = useState(false);
	const whoFieldRef = useRef();
	useOutsideClick(whoFieldRef, () => {
		setWhoDetailsActive(false);
	});
	const [who, setWho] = useState([1, 0, 0]);

	useEffect(() => {
		setWhoMessage(getWhoMessage(who));
	}, []);

	const updateWho = (index, delta) => {
		const newWho = [...who];
		newWho[index] = Math.max(0, Math.min(8, (newWho[index] || 0) + delta));
		setWho(newWho);
		setWhoMessage(getWhoMessage(newWho));
	};

	useEffect(() => {
		let parts = ['Hi, I’m looking for help finding a hotel'];
		if (where) parts.push(`${data?.where ? 'at' : 'in'} ${where}`);
		if (whenMessage) parts.push(`for ${whenMessage}`);
		if (whoMessage) parts.push(`for ${whoMessage.toLowerCase()}`);
		if (budgetMin > 0 && budgetMax > 0)
			parts.push(
				`with a per-night budget of $${budgetMin.toLocaleString()}–${budgetMax.toLocaleString()}${budgetMax == 1200 ? '\+' : ''}`
			);
		setMessage(parts.join(' ') + '.');
	}, [where, whoMessage, whenMessage, budgetMin, budgetMax]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return false;

	const nights =
		whenRange[0] && whenRange[1]
			? dayjs(whenRange[1]).diff(dayjs(whenRange[0]), 'day')
			: 1;

	return (
		<div className="g-hotel-form c-form">
			<div className="g-hotel-form__header wysiwyg">
				{heading && <h2 className="t-h-1">{heading}</h2>}
				{subheading && <p className="t-h-4">{subheading}</p>}
			</div>

			<div className={'g-hotel-form__intake c-form__fields'}>
				<Field
					type={'text'}
					label={'Where'}
					placeholder={'Your Destination'}
					value={where}
					onChange={(e) => setWhere(e.target.value)}
				/>
				<div
					ref={whenFieldRef}
					className="g-hotel-form__when c-field"
					data-size="1/2"
				>
					<Field
						type={'text'}
						label={'When'}
						placeholder={'Select Dates'}
						value={whenMessage}
						readOnly={true}
						onClick={(e) => {
							setWhenCalActive(!whenCalActive);
						}}
					/>
					<Calendar
						className={clsx({
							'is-active': whenCalActive == true,
						})}
						selectRange={true}
						value={whenRange}
						minDate={new Date()}
						maxDate={
							new Date(new Date().setFullYear(new Date().getFullYear() + 1))
						}
						showNeighboringMonth={false}
						showDoubleView={!isTabletScreen}
						activeStartDate={whenStartDate}
						onActiveStartDateChange={handleActiveStartDateChange}
						onChange={handleDateChange}
					/>
				</div>
				<div
					ref={whoFieldRef}
					className="g-hotel-form__who c-field"
					data-size="1/2"
				>
					<Field
						type={'text'}
						label={'Who'}
						placeholder={'Add guests'}
						value={whoMessage}
						readOnly={true}
						onClick={(e) => {
							setWhoDetailsActive(!whoDetailsActive);
						}}
					/>
					<div
						className={clsx('g-hotel-form__who__detail', {
							'is-active': whoDetailsActive == true,
						})}
					>
						<div className="g-hotel-form__who__detail__item">
							<div className="g-hotel-form__who__detail__label-group">
								<div className="g-hotel-form__who__detail__label">Adult</div>
								<div className="g-hotel-form__who__detail__sublabel cr-subtle-4">
									Age 13 or above
								</div>
							</div>
							<div className="g-hotel-form__who__detail__form">
								<button
									type="button"
									onClick={() => updateWho(0, -1)}
									disabled={who[0] === 1}
								>
									<span className="icon-minus" />
								</button>
								<div className="g-hotel-form__who__detail__qty">
									{who[0] || 0}
								</div>
								<button
									type="button"
									onClick={() => updateWho(0, 1)}
									disabled={who[0] === 8}
								>
									<span className="icon-plus" />
								</button>
							</div>
						</div>
						<div className="g-hotel-form__who__detail__item">
							<div className="g-hotel-form__who__detail__label-group">
								<div className="g-hotel-form__who__detail__label">Children</div>
								<div className="g-hotel-form__who__detail__sublabel cr-subtle-4">
									Ages 0–12
								</div>
							</div>
							<div className="g-hotel-form__who__detail__form">
								<button
									type="button"
									onClick={() => updateWho(1, -1)}
									disabled={who[1] === 0}
								>
									<span className="icon-minus" />
								</button>
								<div className="g-hotel-form__who__detail__qty">
									{who[1] || 0}
								</div>
								<button
									type="button"
									onClick={() => updateWho(1, 1)}
									disabled={who[1] === 8}
								>
									<span className="icon-plus" />
								</button>
							</div>
						</div>
						<div className="g-hotel-form__who__detail__item">
							<div className="g-hotel-form__who__detail__label-group">
								<div className="g-hotel-form__who__detail__label">Pets</div>
								<div className="g-hotel-form__who__detail__sublabel cr-subtle-4">
									Dogs, cats, etc.
								</div>
							</div>
							<div className="g-hotel-form__who__detail__form">
								<button
									type="button"
									onClick={() => updateWho(2, -1)}
									disabled={who[2] === 0}
								>
									<span className="icon-minus" />
								</button>
								<div className="g-hotel-form__who__detail__qty">
									{who[2] || 0}
								</div>
								<button
									type="button"
									onClick={() => updateWho(2, 1)}
									disabled={who[2] === 8}
								>
									<span className="icon-plus" />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="g-hotel-form__budget c-field">
					<h2 className="t-b-1">
						What’s your ideal nightly budget (if you have one)?
					</h2>
					<div className="budget-slider">
						<div className="slider-track"></div>
						<div
							className="slider-range"
							style={{
								left:
									Math.max(0, ((budgetMin - 200) / (1200 - 200)) * 100) + '%',
								right: 100 - ((budgetMax - 200) / (1200 - 200)) * 100 + '%',
							}}
						></div>
						<input
							type="range"
							min={200}
							max={1200}
							value={budgetMin}
							onChange={(e) => {
								const val = parseInt(e.target.value);
								const value = Math.max(200, Math.min(val, budgetMax - 10));
								setBudgetMin(value);
							}}
							className="thumb thumb-left"
						/>
						<input
							type="range"
							min={200}
							max={1200}
							value={budgetMax}
							onChange={(e) => {
								const val = parseInt(e.target.value);
								const value = Math.max(200, Math.max(val, budgetMin + 10));
								setBudgetMax(value);
								if (budgetMin == 0) setBudgetMin(200);
							}}
							className="thumb thumb-right"
						/>
					</div>
					<div className="g-hotel-form__budget__minmax">
						<div className="g-hotel-form__budget__minmax__item">
							<div className="t-l-2">Min</div>
							<div className="pill">
								${budgetMin > 0 ? budgetMin.toLocaleString() : '0'}
							</div>
						</div>
						<div className="g-hotel-form__budget__minmax__item">
							<div className="t-l-2">Max</div>
							<div className="pill">
								$
								{budgetMax > 0
									? `${budgetMax.toLocaleString()}${budgetMax == 1200 ? '+' : ''}`
									: '0'}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="g-hotel-form__footer">
				<div className="g-hotel-form__cta">
					<Button
						icon={<IconWhatsApp />}
						className={'btn cr-green-d js-gtm-whatsapp'}
						href={`https://wa.me/33686047390?text=${encodeURI(message)}`}
						isNewTab={true}
						onClick={() => {
							setErrorIsVisible(true);
						}}
					>
						Send via WhatsApp
					</Button>
					<div className="t-l-2 cr-subtle-5">Or</div>
					<Button
						icon={<IconEmail />}
						className={'btn cr-blue-d js-gtm-email'}
						href={`mailto:vip@spotstravel.co?subject=${encodeURI(subject)}&body=${encodeURI(message)}`}
						isNewTab={true}
						onClick={() => {
							setErrorIsVisible(true);
						}}
					>
						Send via Email
					</Button>
					<div
						className={clsx('g-hotel-form__error t-b-1', {
							'is-visible': errorIsVisible,
						})}
					>
						Need another way? Reach us at <strong>vip@spotstravel.co</strong>
					</div>
				</div>
			</div>
		</div>
	);
}

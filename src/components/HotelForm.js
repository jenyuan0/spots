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

	const [subject, setSubject] = useState(data?.subject ?? 'Hotel search');
	const [heading, setHeading] = useState(data?.heading ?? '');
	const [subheading, setSubheading] = useState(data?.subheading ?? '');
	const [where, setWhere] = useState(data?.where || '');
	const [whenMessage, setWhenMessage] = useState('');
	const [whoMessage, setWhoMessage] = useState('');
	const [message, setMessage] = useState('');
	const [budgetChoice, setBudgetChoice] = useState('');
	const [errorIsVisible, setErrorIsVisible] = useState(false);

	useEffect(() => {
		setWhere(data?.where || '');
	}, [data]);

	useEffect(() => {
		if (content) {
			const newHeading = data?.heading ?? content.contactHeading ?? '';
			const newSubheading = data?.subheading ?? content.contactSubheading ?? '';
			setHeading(newHeading);
			setSubheading(newSubheading);
		}
		let parts = ['Hi,'];

		if (where) {
			const isRoom = data?.where;
			parts.push(
				`${isRoom ? 'I’m looking to book a room at' : 'I’m looking for help finding a hotel in'} ${where}`
			);
			setSubject(`Hotel ${isRoom ? 'inquiry for' : 'search in'} ${where}`);
		}
		if (whenMessage) parts.push(`for ${whenMessage}`);
		if (whoMessage) parts.push(`for ${whoMessage.toLowerCase()}`);
		if (budgetChoice) parts.push(`with a nightly budget of ${budgetChoice}`);
		setMessage(parts.join(' ') + '.');
	}, [data, content, whenMessage, whoMessage, budgetChoice, where]);

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
		setWhenCalActive(false);
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
		setIsMounted(true);
	}, []);

	if (!isMounted) return false;

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
						onFocus={() => setWhenCalActive(true)}
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

				<div
					className={clsx('g-hotel-form__budget c-field', {
						'is-visible': whenRange[0] && whenRange[1],
					})}
				>
					<div className="g-hotel-form__budget__title t-b-1">
						(Optional) What’s your ideal nightly budget?
					</div>
					{['$250—$500', '$500—$750', '$750+'].map((option) => (
						<button
							key={option}
							className={clsx('pill', {
								'is-active': budgetChoice === option,
							})}
							onClick={() =>
								setBudgetChoice(budgetChoice === option ? '' : option)
							}
						>
							{option}
						</button>
					))}
				</div>
				{/*
5. What’s your ideal hotel vibe? (Optional)
[ ] Design-forward boutique
[ ] Luxury classic
[ ] Family-friendly comfort
[ ] I’m open

6. What’s your hotel budget per night?
[ ] $250–500
[ ] $500–750
[ ] $750+
[ ] I’m flexible—recommend what fits best

7. Anything else we should know? (Optional)
[Free text: dietary needs, accessibility, must-haves, etc.) */}
			</div>
			<div className="g-hotel-form__footer">
				<div className="g-hotel-form__cta">
					<Button
						icon={<IconWhatsApp />}
						className={'btn cr-green-d js-gtm-whatsapp'}
						href={`https://wa.me/33686047390?text=${encodeURIComponent(message)}`}
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
						href={`mailto:vip@spotstravel.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
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

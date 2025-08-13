import clsx from 'clsx';
import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from 'react';
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
	if (adults === 0 && children === 0 && pets === 0) return '';
	const parts = [];
	if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
	if (children > 0)
		parts.push(`${children} Children${children > 1 ? 's' : ''}`);
	if (pets > 0) parts.push(`${pets} Pet${pets > 1 ? 's' : ''}`);
	return parts.join(', ');
}

export default function PlannerForm({ data, plan }) {
	const { isTabletScreen } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);
	const [content, setContent] = useState();
	const [type, setType] = useState(null);

	useEffect(() => {
		const controller = new AbortController();
		const DOC_MAP = { hotel: 'pHotelBooking', design: 'pTravelDesign' };
		const docType = DOC_MAP[type] ?? 'pHotelBooking';

		(async () => {
			try {
				const doc = await client.fetch(
					`*[_type == $docType][0]{
						contactHeading,
						contactSubheading,
						contactPlaceholder,
						contactSubject
					}`,
					{ docType },
					{ signal: controller.signal }
				);
				setContent(doc || {});
			} catch (error) {
				if (error.name !== 'AbortError') {
					console.error('Error fetching data:', error);
				}
			}
		})();

		return () => controller.abort();
	}, [type]);

	const [subject, setSubject] = useState();
	const [formText, setFormText] = useState({
		heading: data?.heading ?? '',
		subheading: data?.subheading ?? '',
	});
	const [where, setWhere] = useState('');
	const [whenMessage, setWhenMessage] = useState('');
	const [whoMessage, setWhoMessage] = useState('');
	const [message, setMessage] = useState('');
	const [budgetChoice, setBudgetChoice] = useState('');
	const [helpPlanChoice, setHelpPlanChoice] = useState(''); // 'yes' | 'no'
	const [errorIsVisible, setErrorIsVisible] = useState(false);

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

	const updateWho = useCallback((index, delta) => {
		setWho((prevWho) => {
			const newWho = [...prevWho];
			newWho[index] = Math.max(0, Math.min(8, (newWho[index] || 0) + delta));
			setWhoMessage(getWhoMessage(newWho));
			return newWho;
		});
	}, []);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setType(plan || data?.type);

		if (content) {
			const newHeading = data?.heading ?? content.contactHeading ?? '';
			const newSubheading = data?.subheading ?? content.contactSubheading ?? '';
			setFormText({ heading: newHeading, subheading: newSubheading });
			setSubject(data?.subject ?? content.contactSubject ?? '');
		}
	}, [content, plan, data]);

	const computedMessage = useMemo(() => {
		let parts = ['Hi,'];

		if (type == 'design') {
			parts.push(
				`I’m looking for help planning a trip${where && ` to ${where}`}`
			);
			setSubject(`Travel Planning to ${where}`);
		} else if (where) {
			const isRoom = data?.where;
			parts.push(
				`${isRoom ? 'I’m looking to book a room at' : 'I’m looking for help finding a hotel in'} ${where}`
			);
			setSubject(`Hotel ${isRoom ? 'inquiry for' : 'search in'} ${where}`);
		} else {
			parts.push(`I’m looking for help finding a hotel`);
		}
		if (whenMessage) parts.push(`for ${whenMessage}`);
		if (whoMessage) parts.push(`for ${whoMessage.toLowerCase()}`);
		if (budgetChoice) parts.push(`with a nightly budget of ${budgetChoice}`);
		if (helpPlanChoice && helpPlanChoice.toLowerCase() === 'yes') {
			parts.push('and I’d like help planning the trip');
		}
		const newMessage = parts.join(' ') + '.';
		setMessage(newMessage);
		return newMessage;
	}, [
		data,
		content,
		whenMessage,
		whoMessage,
		budgetChoice,
		where,
		helpPlanChoice,
	]);

	useEffect(() => {
		setWhere(data?.where || '');
	}, [data]);

	if (!isMounted) return null;

	return (
		<div className="g-planner-form c-form">
			<div className="g-planner-form__header wysiwyg">
				<div
					className="pill"
					style={{
						'--cr-primary': 'var(--cr-green-l)',
						'--cr-secondary': 'var(--cr-green-d)',
					}}
				>
					{type == 'design' ? `Free Consultation` : 'Always Free'}
				</div>
				{formText.heading && <h2 className="t-h-1">{formText.heading}</h2>}
				{formText.subheading && <p className="t-h-4">{formText.subheading}</p>}
			</div>
			<div className={'g-planner-form__intake c-form__fields'}>
				<Field
					type={'text'}
					label={'Where'}
					placeholder={'Your Destination(s)'}
					value={where}
					onChange={(e) => setWhere(e.target.value)}
				/>
				<div
					ref={whenFieldRef}
					className="g-planner-form__when c-field"
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
					className="g-planner-form__who c-field"
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
						className={clsx('g-planner-form__who__detail', {
							'is-active': whoDetailsActive == true,
						})}
					>
						<div className="g-planner-form__who__detail__item">
							<div className="g-planner-form__who__detail__label-group">
								<div className="g-planner-form__who__detail__label">Adult</div>
								<div className="g-planner-form__who__detail__sublabel cr-subtle-4">
									Age 13 or above
								</div>
							</div>
							<div className="g-planner-form__who__detail__form">
								<button
									type="button"
									onClick={() => updateWho(0, -1)}
									disabled={who[0] === 1}
								>
									<span className="icon-minus" />
								</button>
								<div className="g-planner-form__who__detail__qty">
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
						<div className="g-planner-form__who__detail__item">
							<div className="g-planner-form__who__detail__label-group">
								<div className="g-planner-form__who__detail__label">
									Children
								</div>
								<div className="g-planner-form__who__detail__sublabel cr-subtle-4">
									Ages 0–12
								</div>
							</div>
							<div className="g-planner-form__who__detail__form">
								<button
									type="button"
									onClick={() => updateWho(1, -1)}
									disabled={who[1] === 0}
								>
									<span className="icon-minus" />
								</button>
								<div className="g-planner-form__who__detail__qty">
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
						<div className="g-planner-form__who__detail__item">
							<div className="g-planner-form__who__detail__label-group">
								<div className="g-planner-form__who__detail__label">Pets</div>
								<div className="g-planner-form__who__detail__sublabel cr-subtle-4">
									Dogs, cats, etc.
								</div>
							</div>
							<div className="g-planner-form__who__detail__form">
								<button
									type="button"
									onClick={() => updateWho(2, -1)}
									disabled={who[2] === 0}
								>
									<span className="icon-minus" />
								</button>
								<div className="g-planner-form__who__detail__qty">
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
				{type !== 'design' && (
					<>
						<div
							className={clsx('g-planner-form__help c-field', {
								'is-visible': whenRange[0] && whenRange[1],
							})}
							role="radiogroup"
							aria-label="Help planning"
						>
							<div className="g-planner-form__help__title t-b-1">
								Would you like help planning your trip?
							</div>
							{['Yes', 'No'].map((option) => (
								<button
									key={option}
									className={clsx('pill', {
										'is-active': helpPlanChoice === option,
									})}
									role="radio"
									aria-checked={helpPlanChoice === option}
									onClick={() =>
										setHelpPlanChoice(helpPlanChoice === option ? '' : option)
									}
								>
									{option}
								</button>
							))}
						</div>
						<div
							className={clsx('g-planner-form__budget c-field', {
								'is-visible': whenRange[0] && whenRange[1],
							})}
							role="radiogroup"
							aria-label="Budget choice"
						>
							<div className="g-planner-form__budget__title t-b-1">
								What’s your ideal nightly budget?
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
					</>
				)}
				{/*
5. What’s your ideal hotel vibe? (Optional)
[ ] Design-forward boutique
[ ] Luxury classic
[ ] Family-friendly comfort
[ ] I’m open

7. Anything else we should know? (Optional)
[Free text: dietary needs, accessibility, must-haves, etc.) */}
			</div>
			<div className="g-planner-form__footer">
				<div className="g-planner-form__cta">
					<Button
						icon={<IconWhatsApp />}
						className={'btn cr-green-d js-gtm-whatsapp'}
						href={`https://wa.me/33686047390?text=${encodeURIComponent(computedMessage)}`}
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
						href={`mailto:vip@spotstravel.co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(computedMessage)}`}
						isNewTab={true}
						onClick={() => {
							setErrorIsVisible(true);
						}}
					>
						Send via Email
					</Button>
					<div
						className={clsx('g-planner-form__error t-b-1', {
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

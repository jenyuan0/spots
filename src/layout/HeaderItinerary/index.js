import React from 'react';
import clsx from 'clsx';
import Link from '@/components/CustomLink';

export default function HeaderItinerary({ data, activeDay, colors }) {
	const { plan, accomodation, reservations } = data;

	return (
		<header className={'g-header-itinerary'}>
			<div className="g-header-itinerary__logo">
				<h1 className="t-h-2">
					<Link href={'/'}>SPOTS</Link>
				</h1>
			</div>
			<div className="g-header-itinerary__links">
				<div className="g-header-itinerary__links__title t-l-2">Your Trip</div>
				<ol className="g-header-itinerary__daylist f-h f-j-c t-h-4">
					{plan.map((el, i) => (
						<li
							key={`day-${i}`}
							className={clsx('g-header-itinerary__daylist__li', {
								'is-active': i == activeDay,
							})}
							style={{ '--cr-dot': `var(--cr-${colors[i % colors.length]}-l)` }}
						>
							<Link href={`#day-${i + 1}`}>Day {i + 1}</Link>
						</li>
					))}
				</ol>
			</div>
			<div className="g-header-itinerary__links">
				<div className="g-header-itinerary__links__title t-l-2">Details</div>
				<ul className="g-header-itinerary__details f-v f-a-c t-h-4">
					{accomodation && (
						<li>
							<Link href={'/'}>Your Accomodation</Link>
						</li>
					)}
					{reservations && (
						<li>
							<Link href={'/'}>Reservations</Link>
						</li>
					)}
					<li>
						<Link href={'/'}>What to Pack</Link>
					</li>
					<li>
						<Link href={'/'}>Before your trip</Link>
					</li>
				</ul>
			</div>
			<div className="g-header-itinerary__links">
				<div className="g-header-itinerary__links__title t-l-2">Others</div>
				<ul className="g-header-itinerary__others f-v f-a-c t-h-4">
					<li>
						<Link href={'/'}>Guides</Link>
					</li>
					<li>
						<Link href={'/'}>Need Help?</Link>
					</li>
				</ul>
			</div>
		</header>
	);
}

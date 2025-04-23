'use client';

import React from 'react';
import CustomForm from '@/components/CustomForm';
import { formatNumberWithCommas } from '@/lib/helpers';

export default function PlanForm({
	data,
	isH1,
	isH1Style,
	title,
	heading,
	hiddenFields,
	budget,
	offering,
}) {
	const formTitle = title === false ? false : title || data.formTitle;
	const formHeading = heading === false ? false : heading || data.formHeading;
	const formData = {
		...data,
	};

	return (
		<div className="g-plan__form">
			<div className="g-plan__form__header wysiwyg">
				{(budget?.low || budget?.high) && (
					<p>
						<span className="t-h-5">
							${formatNumberWithCommas(budget.low)}
							{budget.high ? `—$${formatNumberWithCommas(budget.high)}` : '+'}
						</span>{' '}
						<span className="t-b-2">/ person</span>
					</p>
				)}
				{isH1 ? (
					<>
						<h1 className={`t-h-${isH1Style ? '1' : '2'}`}>{formHeading}</h1>
						<h2 className={`t-h-4`}>{formTitle}</h2>
					</>
				) : (
					<>
						<h2 className={`t-h-${isH1Style ? '1' : '2'}`}>{formHeading}</h2>
						<h3 className={`t-h-4`}>{formTitle}</h3>
					</>
				)}
			</div>
			{offering && (
				<ul className="g-plan__offers t-b-2">
					{/* <li>
						<span>Get started in 5 minutes</span>
					</li> */}
					{/* <li>
						<span>Start your journey feeling like a local from day one.</span>
					</li> */}
					<li>
						<span>Smart route planning, train & chauffeur options</span>
					</li>
					<li>
						<span>24/7 travel support & assistance during your trip</span>
					</li>
					<li>
						<span>All-inclusive: Hotels, dining, and activities</span>
					</li>
					<li>
						<span>Customize and tailor every detail to your preference</span>
					</li>
					{/* <li>
						<span>All reservations confirmed before you arrive</span>
					</li> */}
					{/* <li>Digital and offline itinerary: Access your anytime anywhere</li> */}
					{/* <li>
						Need more help? <u>Ask us anything</u>
					</li> */}
					{/* <li>Get started in 10 minutes</li> */}
				</ul>
			)}
			<CustomForm data={formData} hiddenFields={hiddenFields} />
		</div>
	);
}

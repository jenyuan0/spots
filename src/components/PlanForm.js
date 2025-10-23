'use client';

import React from 'react';
import CustomForm from '@/components/CustomForm';
import { formatNumberWithCommas, hasArrayValue } from '@/lib/helpers';

export default function PlanForm({
	data,
	isH1,
	isH1Style,
	title,
	heading,
	hiddenFields,
	budget,
	displayOffering = false,
}) {
	const { offering } = data || {};
	const formTitle = title === false ? false : title || data.formTitle;
	const formHeading = heading === false ? false : heading || data.formHeading;
	const formData = {
		...data,
	};

	return (
		<div className="g-plan__form">
			<div className="g-plan__form__header wysiwyg">
				{(budget?.low || budget?.high) && (
					<p className="g-plan__form__budget">
						<span className="t-h-5">
							${formatNumberWithCommas(budget.low)}
							{budget.high ? `—$${formatNumberWithCommas(budget.high)}` : '+'}
						</span>{' '}
						<span className="t-b-2">/ person</span>
					</p>
				)}
				{isH1 ? (
					<>
						{formHeading && (
							<h1 className={`t-h-${isH1Style ? '1' : '2'}`}>{formHeading}</h1>
						)}
						{formTitle && <h2 className={`t-h-4`}>{formTitle}</h2>}
					</>
				) : (
					<>
						{formHeading && (
							<h2 className={`t-h-${isH1Style ? '1' : '2'}`}>{formHeading}</h2>
						)}
						{formTitle && <h3 className={`t-h-4`}>{formTitle}</h3>}
					</>
				)}
			</div>
			{displayOffering && hasArrayValue(offering) && (
				<ul className="g-plan__offers t-b-2">
					{/* <li>
						<span>Get started in 5 minutes</span>
					</li> */}
					{/* <li>
						<span>Start your journey feeling like a local from day one.</span>
					</li> */}

					{offering.map((offer, index) => {
						return (
							<li key={`plan-form-${index}`}>
								<span>{offer}</span>
							</li>
						);
					})}

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

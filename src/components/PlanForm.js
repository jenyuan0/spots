'use client';

import React from 'react';
import Link from '@/components/CustomLink';
import CustomForm from '@/components/CustomForm';
import { formatNumberWithCommas } from '@/lib/helpers';

export default function PlanForm({
	data,
	isH1,
	isH1Style,
	title,
	heading,
	successMessage,
	errorMessage,
	budget,
	offering,
	showSupport,
}) {
	const { email, whatsapp, line } = data;
	const formTitle = title === false ? false : title || data.formTitle;
	const formHeading = heading === false ? false : heading || data.formHeading;
	const formData = {
		...data,
		...(successMessage ? { successMessage: successMessage } : {}),
		...(errorMessage ? { errorMessage: errorMessage } : {}),
	};

	return (
		<div className="g-plan__form">
			<div className="g-plan__form__header wysiwyg">
				{budget && (
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
						<h1 className={`t-b-${isH1Style ? '1' : '2'}`}>{formTitle}</h1>
						<h2 className={`t-h-${isH1Style ? '1' : '2'}`}>{formHeading}</h2>
					</>
				) : (
					<>
						<h2 className={`t-b-${isH1Style ? '1' : '2'}`}>{formTitle}</h2>
						<h3 className={`t-h-${isH1Style ? '1' : '2'}`}>{formHeading}</h3>
					</>
				)}
			</div>
			{offering && (
				<ul className="g-plan__offering t-b-2">
					<li>
						<span>Get started in 5 minutes</span>
					</li>
					{/* <li>
						<span>Start your journey feeling like a local from day one.</span>
					</li> */}
					<li>
						<span>All-inclusive: Hotels, dining, and activities</span>
					</li>
					<li>
						<span>Customize and tailor every detail to your preference</span>
					</li>
					<li>
						<span>All reservations confirmed before you arrive</span>
					</li>
					{/* <li>Digital and offline itinerary: Access your anytime anywhere</li> */}
					{/* <li>
						Need more help? <u>Ask us anything</u>
					</li> */}
					{/* <li>Get started in 10 minutes</li> */}
				</ul>
			)}
			<CustomForm data={formData} />
			{showSupport && (
				<div className="g-plan__support">
					{email && (
						<Link className="g-plan__support-item" href={`mailto:${email}`}>
							<span className="t-l-1">Email</span>
							<span className="t-h-5">{email}</span>
						</Link>
					)}
					{whatsapp && (
						<Link
							className="g-plan__support-item t-l-1"
							href={`https://wa.me/${encodeURIComponent(whatsapp)}`}
							target="_blank"
						>
							<span className="t-l-1">WhatsApp</span>
							<span className="t-h-5">{whatsapp}</span>
						</Link>
					)}
					{line && (
						<Link
							className="g-plan__support-item t-l-1"
							href={`https://line.me/R/${encodeURIComponent(line)}`}
							target="_blank"
						>
							<span className="t-l-1">LINE</span>
							<span className="t-h-5">{line}</span>
						</Link>
					)}
				</div>
			)}
		</div>
	);
}

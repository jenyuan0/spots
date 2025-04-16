'use client';

import React from 'react';
import Link from '@/components/CustomLink';
import CustomForm from '@/components/CustomForm';

export default function PlanForm({
	data,
	isH1,
	isH1Style,
	title,
	heading,
	successMessage,
	errorMessage,
}) {
	const { email, whatsapp, line } = data;
	const formTitle = title || data.formTitle;
	const formHeading = heading || data.formHeading;
	const formData = {
		...data,
		...(successMessage ? { successMessage: successMessage } : {}),
		...(errorMessage ? { errorMessage: errorMessage } : {}),
	};

	return (
		<div className="g-plan__form">
			<div className="g-plan__form__header wysiwyg">
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
			<CustomForm data={formData} />
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
		</div>
	);
}

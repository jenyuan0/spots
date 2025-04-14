'use client';
import React from 'react';
import CustomForm from '@/components/CustomForm';

export default function PageContact({ data }) {
	const { title, contactForm } = data || {};

	return (
		<section className="p-contact">
			<h1>{title}</h1>
			{contactForm && <CustomForm data={contactForm} />}
		</section>
	);
}

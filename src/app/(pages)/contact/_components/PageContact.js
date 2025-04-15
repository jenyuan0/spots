'use client';
import React from 'react';
import { ContactSection } from '@/components/ContactSection';

export default function PageContact({ data }) {
	return (
		<section className="p-contact">
			<ContactSection data={data?.planForm} isH1={true} isH1Style={true} />
		</section>
	);
}

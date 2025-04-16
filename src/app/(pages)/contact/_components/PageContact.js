'use client';
import React from 'react';
import PlanSection from '@/components/PlanSection';

export default function PageContact({ data }) {
	return (
		<section className="p-contact">
			<PlanSection data={data?.planForm} isH1={true} isH1Style={true} />
		</section>
	);
}
